import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

import { DEFAULT_STATUS, ROLE_TYPE } from "@/core/utils/constant";

import { User } from "./users.schema";

@Schema({ collection: "contacts", timestamps: true })
export class Contact extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    index: true,
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ index: true, enum: ROLE_TYPE, required: true })
  role: ROLE_TYPE;

  @Prop({ index: true })
  createdOn: number;

  @Prop({ default: DEFAULT_STATUS.INACTIVE, index: true })
  isDeleted: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
export type ContactDocument = Contact & Document;
