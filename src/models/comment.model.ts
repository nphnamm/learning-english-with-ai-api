import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  lessonId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema(
  {
    lessonId: { type: Schema.Types.ObjectId, required: true, ref: "Lesson" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
