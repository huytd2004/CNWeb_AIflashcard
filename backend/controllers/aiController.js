const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY_AI);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Helper function to clean AI response
const cleanAIResponse = (text) => {
  return text
    .replace(/^```json\s*/, "")
    .replace(/^```html\s*/, "")
    .replace(/```\s*$/, "");
};

// ==================== PROMPT FUNCTIONS ====================

const optimizedPromptQuiz = (topic, description, questionCount, difficulty) => {
  return `Tôi cần một đối tượng JSON chứa ${questionCount} câu hỏi về chủ đề **${topic}**, tập trung vào **${description}**.
    
            **Yêu cầu chi tiết:**
            * **Số lượng câu hỏi:** Chính xác ${questionCount} câu.
            * **Độ khó:** ${difficulty}.
            * **Loại câu hỏi:** Tất cả câu hỏi phải là trắc nghiệm (multiple-choice).
                * Mỗi câu hỏi có **4 lựa chọn** ("answers").
                * Chỉ **một lựa chọn duy nhất** là đáp án đúng ("correct").

            **Cấu trúc JSON mong muốn:**
            {
                "title": "Tiêu đề bài quiz",
                "content": "Mô tả nội dung chi tiết",
                "subject": "Môn học",
                "questions": [{
                    "id": 1,
                    "question": "Nội dung câu hỏi",
                    "answers": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                    "correct": "0"
                }]
            }
            
            **Định dạng công thức toán học/vật lý:**
            * Đối với công thức, đơn vị, ký hiệu khoa học: sử dụng LaTeX chuẩn
            * Ví dụ inline math: Năng lượng là $E = mc^2$ 
            * Ví dụ đơn vị: $252 \\text{ kJ}$, $9.8 \\text{ m/s}^2$
            * Ví dụ phân số: $\\frac{1}{2}mv^2$
            * QUAN TRỌNG: Trong JSON, escape ký tự backslash bằng cách viết \\\\ thay vì \\

            **Lưu ý về escape characters:**
            * Trong JSON string, ký tự \\ phải được viết thành \\\\
            * Ví dụ: "252 \\\\text{ kJ}" sẽ render thành 252 \\text{ kJ}
            * Ví dụ: "$E = mc^2$" không cần escape
            * Ví dụ: "$\\\\frac{a}{b}$" sẽ render thành $\\frac{a}{b}$

            **Đầu ra:**
            Chỉ trả về JSON thuần túy, không có markdown wrapper, không có giải thích gì thêm.`;
};

const optimizedPromptQuizTextOption = (content, questionCount) => {
  return `Tôi cần một đối tượng JSON chứa tối đa ${questionCount} câu hỏi từ văn bản "${content}".
    
            **Yêu cầu chi tiết:**
            * **Số lượng câu hỏi tối đa khi tạo:** Chính xác ${questionCount} câu.
            * **Loại câu hỏi:** Tất cả câu hỏi phải là trắc nghiệm (multiple-choice).
                * Mỗi câu hỏi có **4 lựa chọn** ("answers").
                * Chỉ **một lựa chọn duy nhất** là đáp án đúng ("correct").

            **Cấu trúc JSON mong muốn:**
            {
                "title": "Tiêu đề bài quiz",
                "content": "Mô tả nội dung chi tiết",
                "subject": "Môn học",
                "questions": [{
                    "id": 1,
                    "question": "Nội dung câu hỏi",
                    "answers": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                    "correct": "0"
                }]
            }
            
            **Định dạng công thức toán học/vật lý:**
            * Đối với công thức, đơn vị, ký hiệu khoa học: sử dụng LaTeX chuẩn
            * QUAN TRỌNG: Trong JSON, escape ký tự backslash bằng cách viết \\\\ thay vì \\

            **Đầu ra:**
            Chỉ trả về JSON thuần túy, không có markdown wrapper, không có giải thích gì thêm.`;
};

const optimizedPromptGenerateTitle = (data) => {
  return `Bạn là một chuyên gia trong việc tạo tiêu đề hấp dẫn cho các bài quiz. Hãy đọc và dự đoán tiêu đề, nội dung, và môn học của bài quiz. Trả về một object định dạng JSON như cú pháp ở dưới, không có giải thích gì thêm.
    {
        "title": "", // Tiêu đề bài quiz
        "content": "", // Mô tả nội dung chi tiết
        "subject": "" // Môn học ngắn gọn
    }
    Dưới đây là thông tin chi tiết, bạn hãy dự đoán tiêu đề, nội dung và môn học của bài quiz:
${data
  .map((q) => `- Câu hỏi: ${q.question}\n  - Đáp án: ${q.answers.join(", ")}\n`)
  .join("\n")}`;
};

const optimizedPromptEnglishExam = (data) => {
  return `You are an AI assistant specialized in generating English language test questions.
Your task is to create a set of questions based on the provided content, difficulty level, and specific skills.
The output MUST be a JSON object strictly following the provided schema, with no additional text or formatting outside of the JSON.

--- JSON Schema ---

    [{
      "question_id": "string",
      "question_type": "string",
      "skill_focus": "string",
      "question_text": "string",
      "options": [{"id": "string", "text": "string"}],
      "correct_answer_id": "string",
      "correct_answer_text": "string",
      "left_items": [{"id": "string", "text": "string"}],
      "right_items": [{"id": "string", "text": "string"}],
      "correct_matches": [{"left_id": "string", "right_id": "string"}],
      "scrambled_sentences": [{"id": "string", "text": "string"}],
      "correct_order_ids": ["string"],
      "passage": "string",
      "audio_text": "string",
      "correct_answer_keywords": ["string"]
}]


--- Task Details ---
Generate a test with the following specifications:
Difficulty Level: ${data.difficulty}
Target Skills: ${data.skills.join(", ")}
Content/Topic: ${data.content}
Number of Questions: ${data.questionCount}
Question Types and Distribution: ${data.questionTypes.join(", ")}

Ensure all generated questions are relevant to the content/topic and adhere to the specified difficulty and skill focus.`;
};

const optimizedPromptFCMore = (prompt, language) => {
  return `
        Bạn là một chuyên gia ngôn ngữ có khả năng tạo flashcard chất lượng cao. Hãy tạo flashcard cho danh sách từ "${prompt}" cách nhau bằng dấu , với ngôn ngữ ${language}.
        
        Yêu cầu:
        1. Phải cung cấp thông tin chính xác và đầy đủ
        2. Ghi chú phải hữu ích cho việc ghi nhớ
        3. Định dạng JSON phải chính xác
        
        Trả về kết quả theo cấu trúc mảng JSON sau và KHÔNG kèm theo bất kỳ giải thích nào:
        
        [{
        "title": "",
        "define": "",
        "type_of_word": "",
        "transcription": "",
        "level": "",
        "example": [
            {
            "en": "",
            "trans": "",
            "vi": ""
            },
            {
            "en": "",
            "trans": "",
            "vi": ""
            },
            {
            "en": "",
            "trans": "",
            "vi": ""
            }
        ],
        "note": ""
        }]
        `;
};

const optimizedPromptExplainAnswer = (questionItem) => {
  return `
            Giải thích câu trả lời.
            Yêu cầu: ngắn gọn xúc tích dễ hiểu, đúng vào trọng tâm, không lòng vòng.
            Không cần nói tóm lại, không cần nói lại câu hỏi và sự kì vọng ở cuối câu.
            
            Câu hỏi: ${questionItem.question}
            A: ${questionItem.answers[0]}
            B: ${questionItem.answers[1]}
            C: ${questionItem.answers[2]}
            D: ${questionItem.answers[3]}
            Đáp án đúng: ${questionItem.answers[Number(questionItem.correct)]}
        `;
};

// ==================== CONTROLLER FUNCTIONS ====================

// Generate Quiz from interface input
exports.generateQuizInterface = async (req, res) => {
  try {
    const { topic, description, questionCount, difficulty } = req.body;

    if (!topic) {
      return res.status(400).json({ ok: false, message: "Topic is required" });
    }

    const prompt = optimizedPromptQuiz(
      topic,
      description || "",
      questionCount || 10,
      difficulty || "medium"
    );
    const result = await model.generateContent(prompt);
    const responseText = cleanAIResponse(result.response.text());
    const jsonOutput = JSON.parse(responseText);

    return res.status(200).json({ ok: true, data: jsonOutput });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Lỗi khi tạo quiz", error: error.message });
  }
};

// Generate Quiz from text input
exports.generateQuizText = async (req, res) => {
  try {
    const { content, questionCount } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ ok: false, message: "Content is required" });
    }

    const prompt = optimizedPromptQuizTextOption(content, questionCount || 50);
    const result = await model.generateContent(prompt);
    const responseText = cleanAIResponse(result.response.text());
    const jsonOutput = JSON.parse(responseText);

    return res.status(200).json({ ok: true, data: jsonOutput });
  } catch (error) {
    console.error("Error generating quiz from text:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Lỗi khi tạo quiz", error: error.message });
  }
};

// Generate title for quiz
exports.generateQuizTitle = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ ok: false, message: "Questions array is required" });
    }

    const prompt = optimizedPromptGenerateTitle(questions);
    const result = await model.generateContent(prompt);
    const responseText = cleanAIResponse(result.response.text());
    const jsonOutput = JSON.parse(responseText);

    return res.status(200).json({ ok: true, data: jsonOutput });
  } catch (error) {
    console.error("Error generating quiz title:", error);
    return res.status(500).json({
      ok: false,
      message: "Lỗi khi tạo tiêu đề",
      error: error.message,
    });
  }
};

// Generate English Exam
exports.generateEnglishExam = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      difficulty,
      skills,
      questionTypes,
      questionCount,
      timeLimit,
    } = req.body;

    if (!content || !difficulty || !skills) {
      return res.status(400).json({
        ok: false,
        message: "Content, difficulty, and skills are required",
      });
    }

    const prompt = optimizedPromptEnglishExam({
      title,
      description,
      content,
      difficulty,
      skills,
      questionTypes: questionTypes || [],
      questionCount: questionCount || 20,
      timeLimit: timeLimit || 30,
    });
    const result = await model.generateContent(prompt);
    const responseText = cleanAIResponse(result.response.text());
    const jsonOutput = JSON.parse(responseText);

    return res.status(200).json({ ok: true, data: jsonOutput });
  } catch (error) {
    console.error("Error generating English exam:", error);
    return res.status(500).json({
      ok: false,
      message: "Lỗi khi tạo đề thi",
      error: error.message,
    });
  }
};

// Generate Flashcards with AI
exports.generateFlashcards = async (req, res) => {
  try {
    const { vocabulary, language } = req.body;

    if (!vocabulary || !language) {
      return res
        .status(400)
        .json({ ok: false, message: "Vocabulary and language are required" });
    }

    const prompt = optimizedPromptFCMore(vocabulary, language);
    const result = await model.generateContent(prompt);
    const responseText = cleanAIResponse(result.response.text());
    const jsonOutput = JSON.parse(responseText);

    return res.status(200).json({ ok: true, data: jsonOutput });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return res.status(500).json({
      ok: false,
      message: "Lỗi khi tạo flashcard",
      error: error.message,
    });
  }
};

// Explain answer with AI
exports.explainAnswer = async (req, res) => {
  try {
    const { question, answers, correct } = req.body;

    if (!question || !answers || correct === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Question, answers, and correct are required",
      });
    }

    const prompt = optimizedPromptExplainAnswer({ question, answers, correct });
    const result = await model.generateContent(prompt);
    const responseText = result.response
      .text()
      .replace(/```html/g, "")
      .replace(/```/g, "");

    return res.status(200).json({ ok: true, data: responseText });
  } catch (error) {
    console.error("Error explaining answer:", error);
    return res.status(500).json({
      ok: false,
      message: "Lỗi khi giải thích câu trả lời",
      error: error.message,
    });
  }
};
