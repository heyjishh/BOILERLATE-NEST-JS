import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { User, UserDocument } from "@/models/users.schema";
import { IResponseList } from "@/core/interfaces/global.interfaces";

import { FindAllUsersDTO } from "./dtos/argument.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findOne(
    matchCriteria: Record<string, any>,
    projections: Record<string, any> = {},
  ): Promise<User | null> {
    const user = await this.userModel
      .findOne(matchCriteria, projections)
      .lean();
    return user as User;
  }

  async create(user: any) {
    return (await this.userModel.create(user)).toJSON();
  }

  async findOneAndUpdate(id: string, dataToUpdate: any): Promise<User | null> {
    const user: User = (await this.userModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { $set: dataToUpdate },
        { new: true, lean: true, projection: { password: 0 } },
      )
      .exec()) as User;
    return user as User;
  }

  async findAll(query: FindAllUsersDTO): Promise<IResponseList> {
    const conditions: Record<string, any> = {
      status: true,
    };

    if (query.search) {
      conditions["$or"] = [
        { email: { $regex: query.search, $options: "i" } },
        { firstName: { $regex: query.search, $options: "i" } },
        { lastName: { $regex: query.search, $options: "i" } },
        { empId: { $regex: query.search, $options: "i" } },
      ];
    }

    const users: User[] = (await this.userModel
      .find(conditions)
      .select({ password: 0, accessToken: 0 })
      .skip(query.skip)
      .limit(query.limit)
      .lean()) as User[];
    const count = await this.userModel.countDocuments(conditions);
    return { count, data: users };
  }
}
