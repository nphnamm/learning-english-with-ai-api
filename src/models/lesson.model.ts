import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILesson extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema<ILesson> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ILesson>("Lesson", LessonSchema);
