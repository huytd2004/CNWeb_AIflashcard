const express = require("express");
const {
  generateQuizInterface,
  generateQuizText,
  generateQuizTitle,
  generateEnglishExam,
  generateFlashcards,
  explainAnswer,
} = require("../controllers/aiController");
const { authMiddleware } = require("../middleware/authorizationMiddleWare");

const router = express.Router();

// Quiz AI routes
router.post("/quiz/interface", authMiddleware, generateQuizInterface); // Tạo quiz từ giao diện
router.post("/quiz/text", authMiddleware, generateQuizText); // Tạo quiz từ văn bản
router.post("/quiz/title", authMiddleware, generateQuizTitle); // Tạo tiêu đề quiz

// English Exam AI routes
router.post("/english-exam", authMiddleware, generateEnglishExam); // Tạo đề thi tiếng Anh

// Flashcard AI routes
router.post("/flashcards", authMiddleware, generateFlashcards); // Tạo flashcard bằng AI

// Explain answer AI routes
router.post("/explain", authMiddleware, explainAnswer); // Giải thích câu trả lời

module.exports = router;
