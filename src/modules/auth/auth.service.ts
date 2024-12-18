import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Model, Types } from "mongoose";
import { DateTime } from "luxon";
import { InjectModel } from "@nestjs/mongoose";

import { RESPONSE_MESSAGES } from "src/core/utils/response-messages";
import { comparePasswords, generateOTP, hashPassword } from "src/core/utils";
import { DEFAULT_STATUS, } from "src/core/utils/constant";
import { User, UserDocument } from "@/models/users.schema";

import { UsersService } from "../users/users.service";
import {
  IGenerateAccessToken,
  IJwtTokenPayload,
  ILoginCriteria,
  JwtUser,
} from "./interface";
import {
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UserLoginDto,
  VerifyOtpResetPasswordDto,
} from "./dto/argument.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async createUser(
    payload: Partial<
      CreateUserDto & {
        createdOn: number;
        lastLoginOn: number;
        status: boolean;
        isDeleted: boolean;
        createdBy: Types.ObjectId;
      }
    >,
    USER: JwtUser,
  ): Promise<User> {

    const isUserExists: User = await this.userModel.findOne({
      $or: [
        { email: payload.email },
        { userName: payload.userName },
      ],
    });

    if (isUserExists)
      throw new BadRequestException(
        RESPONSE_MESSAGES.ALREADY_ASSOCIATED_ACCOUNT,
      );

    payload.password = await hashPassword(payload.password);
    payload.createdOn = DateTime.now().toMillis();
    payload.lastLoginOn = DateTime.now().toMillis();
    payload.status = DEFAULT_STATUS.ACTIVE;
    payload.isDeleted = false;
    payload.createdBy = new Types.ObjectId(USER?._id as any);

    const user: User = (
      await this.userModel.create({ ...payload })
    ).toObject();
    delete user.password;
    return user;
  }

  async login(
    payload: UserLoginDto,
  ): Promise<User | undefined> {
    const { email, password } = payload;

    const criteria: ILoginCriteria = this.buildLoginCriteria(
      email,
      password,
    );

    const user = await this.userModel.findOne(criteria);
    if (!user)
      throw new BadRequestException(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    if (user.isDeleted)
      throw new BadRequestException(RESPONSE_MESSAGES.ALREADY_ACCOUNT_DELETED);

    await this.validatePassword(password, user);
    const accessToken = await this.generateAndUpdateToken(user);
    user.accessToken = accessToken;
    await user.save();
    return user;
  }

  async validatePassword(password: string, user: User): Promise<void> {
    if (!(await comparePasswords(password, user.password))) {
      throw new BadRequestException(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }
  }

  async generateAndUpdateToken(user: User): Promise<string> {
    const generatePayload: IGenerateAccessToken = {
      userId: new Types.ObjectId(user._id as any),
    };
    const { accessToken } = await this.generateToken(generatePayload);
    user.lastLoginOn = DateTime.now().toMillis();

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLoginOn: user.lastLoginOn,
          accessToken: user.accessToken,
        },
      },
    );
    return accessToken;
  }

  async adminLogin(payload: UserLoginDto): Promise<User | undefined> {
    return this.login(payload);
  }

  async validateToken(
    payload: IJwtTokenPayload,
  ): Promise<User | undefined | null> {
    try {
      const isJwtVerified = this.jwtService.verify(payload.jwt);
      if (isJwtVerified) {
        const user: User = await this.userModel
          .findOne({ accessToken: payload.jwt })
          .select({
            createdAt: 0,
            updatedAt: 0,
            password: 0,
            accessToken: 0,
          });
        return user as User;
      }
      return null;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        await this.userModel.updateOne(
          { accessToken: payload.jwt },
          { accessToken: null },
        );
      }
      console.error(`Error validating token:`, err);
      throw new UnauthorizedException(RESPONSE_MESSAGES.INVALID_TOKEN);
    }
  }

  async logoutUser(user: JwtUser): Promise<void> {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(user._id) },
      { accessToken: null },
    );
  }

  async generateToken(
    payload: IGenerateAccessToken,
  ): Promise<{ accessToken: string }> {
    const userId = new Types.ObjectId(payload.userId);
    const user = await this.usersService.findOne({ _id: userId });
    if (!user) throw new BadRequestException(RESPONSE_MESSAGES.USER_NOT_FOUND);
    const jwtPayload: IGenerateAccessToken = {
      _id: userId,
      date: Date.now(),
    };
    const accessToken: string = this.jwtService.sign(jwtPayload);
    return { accessToken };
  }

  // Helper method to build login criteria
  private buildLoginCriteria(
    email: string,
    password: string,
  ): ILoginCriteria {
    const criteria: Record<string, any> = {
      status: true,
      isDeleted: false,
    };

    if (email && password) {
      criteria.$or = [
        { email: email },
        { userName: email },
      ];
    }
    return criteria;
  }

  async forgotPassword(query: ForgotPasswordDto): Promise<void> {
    try {
      const criteria: Record<string, any> = {
        isDeleted: DEFAULT_STATUS.INACTIVE,
        status: DEFAULT_STATUS.ACTIVE,
      };
      if (query.email) {
        criteria.$or = [
          { email: { $regex: query.email, $options: "i" } },
          { phoneNumber: { $regex: query.email, $options: "i" } },
          { empId: { $regex: query.email, $options: "i" } },
        ];
      }

      const user: User = await this.userModel.findOne(criteria);
      if (!user)
        throw new BadRequestException(RESPONSE_MESSAGES.USER_NOT_FOUND);

      if (
        (user.otpEstablishedOn &&
          DateTime.now().minus({ minutes: 5 }) >
          DateTime.fromMillis(user.otpEstablishedOn)) ||
        (!user.otp && !user.otpEstablishedOn)
      ) {
        const generateOtp: number = generateOTP();
        if (!generateOtp)
          throw new BadRequestException(RESPONSE_MESSAGES.OTP_NOT_GENERATED);

        // await this.mailService.sendEmail(
        //   user.email,
        //   "OTP Verification Code",
        //   "sendForgotOTP",
        //   { otp: generateOtp, name: `${user.firstName} ${user.lastName}` },
        // );

        Object.assign(user, {
          otp: generateOtp,
          otpEstablishedOn: DateTime.now().toMillis(),
        });
        await user.save();
        return;
      }
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyOtp(query: VerifyOtpResetPasswordDto): Promise<void> {
    try {
      const criteria: Record<string, any> = {
        isDeleted: DEFAULT_STATUS.INACTIVE,
        status: DEFAULT_STATUS.ACTIVE,
        otp: query.otp,
        otpEstablishedOn: {
          $gt: DateTime.now().minus({ minutes: 5 }).toMillis(),
        },
      };
      if (query.email) {
        criteria.$or = [
          { email: { $regex: query.email, $options: "i" } },
          { phoneNumber: { $regex: query.email, $options: "i" } },
          { empId: { $regex: query.email, $options: "i" } },
        ];
      }

      const user: User = await this.userModel.findOne(criteria);
      if (!user) throw new BadRequestException(RESPONSE_MESSAGES.INVALID_OTP);

      const password = "Minda@123";
      const createNewPassword = await hashPassword(password);
      Object.assign(user, {
        password: createNewPassword,
        otp: null,
        otpEstablishedOn: null,
      });

      // await this.mailService.sendEmail(
      //   user.email,
      //   "OTP Verified Successfully",
      //   "newPasswordSucess",
      //   { name: `${user.firstName} ${user.lastName}`, password: "Minda@123" },
      // );

      await user.save();
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetPassword(query: ResetPasswordDto, user: JwtUser): Promise<void> {
    try {
      if (query.password !== query.confirmPassword)
        throw new BadRequestException(
          RESPONSE_MESSAGES.CONFIRM_PASSWORD_NOT_MATCHED,
        );

      const userData: User = await this.userModel.findOne({ _id: user._id });
      if (!userData)
        throw new BadRequestException(RESPONSE_MESSAGES.USER_NOT_FOUND);

      const checkPreviousPass = await comparePasswords(
        query.password,
        userData.password,
      );
      if (checkPreviousPass)
        throw new BadRequestException(RESPONSE_MESSAGES.PASSWORD_SAME_AS_OLD);

      const newPassword = await hashPassword(query.password);
      Object.assign(userData, { password: newPassword });
      await userData.save();
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
