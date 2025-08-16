import { Router } from "express";
import {
  analyzeText,
  rephraseText,
  checkGrammar,
  checkSpelling,
} from "../controllers/text.controller";

const router = Router();

router.post("/analyze", analyzeText);
router.post("/rephrase", rephraseText);
router.post("/grammar-check", checkGrammar);
router.post("/spell-check", checkSpelling);

export default router;
