import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  userId: Types.ObjectId;
  token: string;
  createdAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" },
  },
  { timestamps: true }
);

const TokenModel = mongoose.model<IToken>("Token", tokenSchema);

export default TokenModel;
