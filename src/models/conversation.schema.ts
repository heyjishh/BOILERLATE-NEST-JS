import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

import { DEFAULT_STATUS, ROLE_TYPE } from "@/core/utils/constant";

import { User } from "./users.schema";
import { Contact } from "./contacts.schema";

@Schema({ collection: "conversations", timestamps: true })
export class Conversation extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Contact.name,
    index: true,
  })
  contactId: Types.ObjectId;

  @Prop({ index: true, enum: ROLE_TYPE, default: null })
  role: ROLE_TYPE;

  @Prop({ index: true })
  messages: [{ type: MongooseSchema.Types.ObjectId, ref: 'messages', index: true }]

  @Prop({ default: DEFAULT_STATUS.INACTIVE })
  isDeleted: boolean;

  @Prop({ index: true })
  createdOn: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
export type ConversationDocument = Conversation & Document;
