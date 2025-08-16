// src/services/lesson.service.ts
import Lesson, { ILesson } from "../models/lesson.model";
import Comment from "../models/comment.model";
import { Types } from "mongoose";

export const createLesson = async (data: {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
}) => {
  const lesson = new Lesson({
    title: data.title,
    content: data.content,
    author: new Types.ObjectId(data.authorId),
    imageUrl: data.imageUrl,
  });
  return lesson.save();
};

export const getLessons = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const lessons = await Lesson.find()
    .populate("author", "username email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
  return lessons;
};

export const getLessonById = async (id: string) => {
  const lesson = await Lesson.findById(id).populate("author", "username");
  if (!lesson) throw new Error("Lesson not found");
  const comments = await Comment.find({ lessonId: lesson._id }).populate(
    "userId",
    "username"
  );
  return { lesson, comments };
};

export const updateLesson = async (
  id: string,
  userId: string,
  payload: Partial<ILesson>
) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw new Error("Not found");
  if (lesson.author.toString() !== userId) throw new Error("Forbidden");
  Object.assign(lesson, payload);
  return lesson.save();
};

export const deleteLesson = async (id: string, userId: string) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw new Error("Not found");
  if (lesson.author.toString() !== userId) throw new Error("Forbidden");
  await Comment.deleteMany({ lessonId: lesson._id });
  return lesson.deleteOne();
};
