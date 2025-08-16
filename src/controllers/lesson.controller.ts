import { Request, Response } from "express";
import * as LessonService from "../services/lesson.service";
import CommentModel from "../models/comment.model";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

// create
export const create = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên hình ảnh" });
    }

    const { title, content } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const imageUrl = req.file.path;

    if (!imageUrl) {
      console.error("Cloudinary upload failed - File info:", req.file);
      return res.status(500).json({ message: "Lỗi khi tải lên hình ảnh" });
    }

    const lesson = await LessonService.createLesson({
      title,
      content,
      authorId,
      imageUrl,
    });

    return res.status(201).json({
      message: "Tạo bài học thành công",
      data: lesson,
    });
  } catch (error: any) {
    console.error("Lỗi khi tạo bài học:", error);
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Get all
export const list = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const lessons = await LessonService.getLessons(page, 20);
  res.json({ data: lessons });
};

// Get detail
export const getOne = async (req: Request, res: Response) => {
  try {
    const { lesson, comments } = await LessonService.getLessonById(
      req.params.id
    );
    res.json({ data: { lesson, comments } });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

// Update
export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body.title || !req.body.content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const payload: any = {
      title: req.body.title,
      content: req.body.content,
    };

    if (req.file) {
      const fileUrl =
        (req.file as any).path ||
        (req.file as any).secure_url ||
        (req.file as any).url ||
        null;

      if (fileUrl) {
        payload.imageUrl = fileUrl;
      } else {
        console.warn("Update: req.file không có URL:", req.file);
      }
    }

    const updated = await LessonService.updateLesson(
      req.params.id,
      userId,
      payload
    );

    res.json({
      message: "Updated lesson successfully",
      data: updated,
    });
  } catch (err: any) {
    console.error("Update error:", err);
    res.status(400).json({
      message: err.message || "Update failed",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

// Remove
export const remove = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await LessonService.deleteLesson(req.params.id, userId);
    res.json({ message: "Deleted lesson" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// comment create
export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { content } = req.body;
    const lessonId = req.params.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const comment = await CommentModel.create({ lessonId, userId, content });
    res.status(201).json({ data: comment });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
