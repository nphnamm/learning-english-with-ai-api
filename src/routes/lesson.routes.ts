import express from "express";
import * as LessonCtrl from "../controllers/lesson.controller";
import { verifyAccessTokenMiddleware } from "../middlewares/verifyToken";
import upload from "../middlewares/upload.middleware";

const router = express.Router();

router.get("/", LessonCtrl.list);
router.get("/:id", LessonCtrl.getOne);

// protected
router.post(
  "/",
  verifyAccessTokenMiddleware,
  upload.single("image"),
  LessonCtrl.create
);
router.post(
  "/:id/comments",
  verifyAccessTokenMiddleware,
  LessonCtrl.addComment
);

router.put(
  "/:id",
  verifyAccessTokenMiddleware,
  upload.single("image"),
  LessonCtrl.update
);
router.delete("/:id", verifyAccessTokenMiddleware, LessonCtrl.remove);

export default router;
