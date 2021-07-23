import mongoose, { model, ObjectId, Schema, Model, Document } from 'mongoose';
import { tokenTypes } from '../config/jwt';

export interface TokenDocument extends Document {
  token: string;
  user: ObjectId;
  type: Type;
  ip: string;
  expires: Date;
  blacklisted: boolean;
}

enum Type {
  tokenTypes,
}

const TokenSchema: Schema = new Schema(
  {
    token: {
      type: String,
      trim: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes],
      required: true,
    },
    ip: {
      type: String,
      // required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Token: Model<TokenDocument> = model('Token', TokenSchema);
export default Token;
