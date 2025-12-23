/* eslint-disable no-useless-escape */
// optimiz prompt flascardcard single
export function optimizedPromptFCSingle(word: string, language: string) {
    return `
        Bạn là một chuyên gia ngôn ngữ có khả năng tạo flashcard chất lượng cao. Hãy tạo flashcard cho từ "${word}" với ngôn ngữ ${language}.

        Yêu cầu:
        1. Phải cung cấp thông tin chính xác và đầy đủ
        2. Ví dụ phải thực tế và dễ hiểu
        3. Ghi chú phải hữu ích cho việc ghi nhớ
        4. Định dạng JSON phải chính xác

        Trả về kết quả theo cấu trúc JSON sau và KHÔNG kèm theo bất kỳ giải thích nào:

        {
        "title": "", // Từ gốc bằng tiếng ${language} (không ghi phiên âm)
        "define": "", // Định nghĩa bằng tiếng Việt, ngắn gọn và dễ hiểu
        "type_of_word": "", // Loại từ (danh từ, động từ, tính từ, etc.)
        "transcription": "", // Phiên âm chuẩn theo từng ngôn ngữ
        "level: "", // Cấp độ từ vựng (ví dụ: A1, B2, C1)
        "example": [
            {
            "en": "", // Câu ví dụ bằng ${language}
            "trans": "",// phiên âm theo ví dụ
            "vi": ""  // Dịch nghĩa tiếng Việt
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
            },
            {
            "en": "",
            "trans": "",
            "vi": ""
            }
        ],
        "note": "" // Tips ghi nhớ, cách dùng đặc biệt, hoặc các lưu ý quan trọng bằng tiếng Việt. Các dấu nháy đôi "" thay bằng dấu ngoặc () để tránh lỗi JSON
        }
        `
}
// optimiz prompt flascardcard more
export function optimizedPromptFCMore(prompt: string, language: string) {
    return `
        Bạn là một chuyên gia ngôn ngữ có khả năng tạo flashcard chất lượng cao. Hãy tạo flashcard cho danh sách từ "${prompt}" cách nhau bằng dấu , với ngôn ngữ ${language}.
        
        Yêu cầu:
        1. Phải cung cấp thông tin chính xác và đầy đủ
        2. Ghi chú phải hữu ích cho việc ghi nhớ
        3. Định dạng JSON phải chính xác
        
        Trả về kết quả theo cấu trúc mảng JSON sau và KHÔNG kèm theo bất kỳ giải thích nào:
        
        [{
        "title": "", // Từ gốc bằng tiếng ${language} (không ghi phiên âm)
        "define": "", // Định nghĩa bằng tiếng Việt, ngắn gọn và dễ hiểu
        "type_of_word": "", // Loại từ (danh từ, động từ, tính từ, etc.)
        "transcription": "", // Phiên âm chuẩn theo từng ngôn ngữ
        "level: "", // Cấp độ từ vựng (ví dụ: A1, B2, C1)
        "example": [
            {
            "en": "", // Câu ví dụ bằng ${language}, thêm phiên âm 
            "trans": "",// phiên âm theo ví dụ
            "vi": "" // Dịch nghĩa tiếng Việt
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
        "note": "" // Tips ghi nhớ, cách dùng đặc biệt, hoặc các lưu ý quan trọng bằng tiếng Việt. Các dấu nháy đôi "" thay bằng dấu ngoặc () để tránh lỗi JSON
        }]
        `
}

export function optimizedPromptQuiz(topic: string, description: string, questionCount: number, difficulty: string) {
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
            Chỉ trả về JSON thuần túy, không có markdown wrapper, không có giải thích gì thêm.`
}

export function optimizedPromptQuizTextOption(content: string, questionCount: number) {
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
            Chỉ trả về JSON thuần túy, không có markdown wrapper, không có giải thích gì thêm.`
}

export const optimizedPromptGenerateTitle = (data: any) => {
    return `Bạn là một chuyên gia trong việc tạo tiêu đề hấp dẫn cho các bài quiz. Hãy đọc và dự đoán tiêu đề, nội dung, và môn học của bài quiz. Trả về một object định dạng JSON như cú pháp ở dưới, không có giải thích gì thêm.
    {
        "title": "", // Tiêu đề bài quiz
        "content": "", // Mô tả nội dung chi tiết
        "subject": "" // Môn học ngắn gọn
    }
    Dưới đây là thông tin chi tiết, bạn hãy dự đoán tiêu đề, nội dung và môn học của bài quiz:
${data.map((q: any) => `- Câu hỏi: ${q.question}\n  - Đáp án: ${q.answers.join(', ')}\n`).join('\n')}`
}

export const optimizedPromptEditQuestions = (questions: any[]) => {
    return `Bạn là một chuyên gia trong việc chỉnh sửa và tạo đáp án từ câu hỏi quiz. Dưới đây là danh sách các câu hỏi và đáp án của chúng. Hãy chỉnh sửa các câu hỏi này để chúng trở nên rõ ràng, chính xác và hấp dẫn hơn. Trả về định dạng JSON như cú pháp ở dưới, không có giải thích gì thêm.
   
    Dưới đây là thông tin chi tiết về các câu hỏi:
    [
    ${questions
        .map(
            (q: any) => `{
        "id": "${q.id}",
        "question": "${q.question}",
        "answers": ${JSON.stringify(q.answers)}, // tạo đáp án và đáp án không cần có a, b, c, d ở đầu 
        "correct": "${q.correct}"
    }`
        )
        .join(',\n    ')}
    ]`
}

export const optimizedPromptEnglishExam = (data: any) => {
    return `You are an AI assistant specialized in generating English language test questions.
Your task is to create a set of questions based on the provided content, difficulty level, and specific skills.
The output MUST be a JSON object strictly following the provided schema, with no additional text or formatting outside of the JSON.

--- JSON Schema ---

    [{
      \"question_id\": \"string\",
      \"question_type\": \"string\", // e.g., \"multiple_choice\", \"fill_in_the_blank\", \"matching\", \"rearrange_sentences\", \"rewrite_sentence\", \"image_description\", \"listening_comprehension\", \"reading_comprehension\"
      \"skill_focus\": \"string\", // e.g., \"vocabulary\", \"grammar\"
      \"question_text\": \"string\",
      \"options\": [{\"id\": \"string\", \"text\": \"string\"}], // For 4 multiple_choice, optional
      \"correct_answer_id\": \"string\", // For multiple_choice, optional
      \"correct_answer_text\": \"string\", // For fill_in_the_blank, rewrite_sentence, listening_comprehension (if open), optional
      \"left_items\": [{\"id\": \"string\", \"text\": \"string\"}], // For matching, optional
      \"right_items\": [{\"id\": \"string\", \"text\": \"string\"}], // For matching, optional
      \"correct_matches\": [{\"left_id\": \"string\", \"right_id\": \"string\"}], // For matching, optional
      \"scrambled_sentences\": [{\"id\": \"string\", \"text\": \"string\"}], // For rearrange_sentences, optional
      \"correct_order_ids\": [\"string\"], // For rearrange_sentences, optional
      \"passage\": \"string\", // For reading_comprehension, optional
      \"audio_text\": \"string\", // For listening_comprehension, optional
      \"correct_answer_keywords\": [\"string\"], // For image_description, optional
}]


--- Task Details ---
Generate a test with the following specifications:
Difficulty Level: ${data.difficulty}
Target Skills: ${data.skills.join(', ')}
Content/Topic: ${data.content}
Number of Questions: ${data.questionCount}
Question Types and Distribution: ${data.questionTypes.join(', ')}

Ensure all generated questions are relevant to the content/topic and adhere to the specified difficulty and skill focus. For listening_comprehension, please generate a suitable audio_text that fits the topic and difficulty.`
}
