import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "users", timestamps: true })
export class User extends Document {
  @Prop({})
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({})
  userName: string;

  @Prop({})
  password: string;

  @Prop({ index: true, unique: true, validate: /.+@.+\..+/ })
  email: string;

  @Prop({ default: "" })
  accessToken: string;

  @Prop({})
  createdOn: number;

  @Prop({})
  lastLoginOn: number;

  @Prop({ required: false, default: false })
  isDeleted: boolean;

  @Prop({ required: false })
  otp: number;

  @Prop({ required: false })
  otpEstablishedOn: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
