import mongoose from "mongoose";

interface JwtUser {
  _id: string;
  avatar: string;
  email?: string;
  role?: number;
  password?: string;
  empId?: string;
  countryCode?: string;
  phoneNumber?: string;
  status?: boolean;
  isDeleted?: boolean;
}

interface IJwtTokenPayload {
  jwt: string;
}

interface ILoginCriteria {
  email?: string;
  role?: number;
  password?: string;
  empId?: string;
  countryCode?: string;
  phoneNumber?: string;
  status?: boolean;
  isDeleted?: boolean;
}

interface IGenerateAccessToken {
  role?: number;
  userId?: mongoose.Types.ObjectId;
  userRole?: number;
  _id?: mongoose.Types.ObjectId;
  date?: number;
}

export type { JwtUser, IJwtTokenPayload, ILoginCriteria, IGenerateAccessToken };
