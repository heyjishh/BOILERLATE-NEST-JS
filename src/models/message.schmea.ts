import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

import { DEFAULT_STATUS } from "@/core/utils/constant";

import { User } from "./users.schema";

@Schema({ collection: "messages", timestamps: true })
export class Message extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: true })
  context: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: DEFAULT_STATUS.INACTIVE, index: true })
  isDeleted: boolean;

  @Prop({ index: true })
  createdOn: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export type MessageDocument = Message & Document;
