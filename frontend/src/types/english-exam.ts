import type { IUser } from './user'

// Định nghĩa cho các thành phần con của câu hỏi
interface IOption {
    id: string // ID duy nhất cho lựa chọn (ví dụ: "opt_a", "opt_b")
    text: string // Nội dung của lựa chọn
}

export interface ILeftItem {
    id: string // ID duy nhất cho mục bên trái
    text: string // Nội dung của mục bên trái
}

export interface IRightItem {
    id: string // ID duy nhất cho mục bên phải
    text: string // Nội dung của mục bên phải
}

interface ICorrectMatch {
    left_id: string // ID của mục bên trái đúng
    right_id: string // ID của mục bên phải đúng
}

export interface IScrambledSentence {
    id: string // ID duy nhất cho câu bị xáo trộn
    text: string // Nội dung của câu bị xáo trộn
}

// Định nghĩa chung cho một câu hỏi (Union Type để bao quát tất cả các loại)
// Các thuộc tính chung cho mọi loại câu hỏi
interface IBaseQuestion {
    question_id: string // ID duy nhất cho câu hỏi
    question_type: QuestionType // Loại câu hỏi (enum hoặc union string literal)
    skill_focus: SkillType // Kỹ năng tập trung (enum hoặc union string literal)
    question_text: string // Nội dung chính của câu hỏi
    explanation: string // Giải thích đáp án
    score_points: number // Điểm số của câu hỏi này
}

// Định nghĩa cho từng loại câu hỏi cụ thể, mở rộng từ IBaseQuestion
export interface IMultipleChoiceQuestion extends IBaseQuestion {
    question_type: 'multiple_choice'
    options: IOption[]
    correct_answer_id: string // ID của đáp án đúng trong options
}

export interface IFillInTheBlankQuestion extends IBaseQuestion {
    question_type: 'fill_in_the_blank'
    correct_answer_text: string // Đáp án chính xác
    blank_position?: [number, number] // Vị trí để chèn input (tùy chọn)
}

export interface IMatchingQuestion extends IBaseQuestion {
    question_type: 'matching'
    left_items: ILeftItem[]
    right_items: IRightItem[]
    correct_matches: ICorrectMatch[]
}

export interface IRearrangeSentencesQuestion extends IBaseQuestion {
    question_type: 'rearrange_sentences'
    scrambled_sentences: IScrambledSentence[]
    correct_order_ids: string[] // Mảng các ID theo thứ tự đúng
}

export interface IRewriteSentenceQuestion extends IBaseQuestion {
    question_type: 'rewrite_sentence'
    correct_answer_text: string // Đáp án đúng sau khi viết lại
}

export interface IImageDescriptionQuestion extends IBaseQuestion {
    question_type: 'image_description'
    image_url: string // URL của hình ảnh
    correct_answer_keywords: string[] // Gợi ý từ khóa để chấm điểm câu trả lời mở
}

export interface IListeningComprehensionQuestion extends IBaseQuestion {
    question_type: 'listening_comprehension'
    audio_text: string // Nội dung văn bản để chuyển đổi thành âm thanh
    options?: IOption[] // Tùy chọn: có thể là câu hỏi trắc nghiệm sau khi nghe
    correct_answer_id?: string // ID của đáp án đúng nếu là trắc nghiệm
    correct_answer_text?: string // Đáp án đúng nếu là câu hỏi mở
}

export interface IReadingComprehensionQuestion extends IBaseQuestion {
    question_type: 'reading_comprehension'
    passage: string // Đoạn văn bản để đọc hiểu
    options: IOption[] // Câu hỏi trắc nghiệm liên quan đến đoạn văn
    correct_answer_id: string // ID của đáp án đúng
}

// Union Type cho Question, cho phép một biến Question có thể là bất kỳ loại câu hỏi nào trên
export type Question =
    | IMultipleChoiceQuestion
    | IFillInTheBlankQuestion
    | IMatchingQuestion
    | IRearrangeSentencesQuestion
    | IRewriteSentenceQuestion
    | IImageDescriptionQuestion
    | IListeningComprehensionQuestion
    | IReadingComprehensionQuestion

// Enum/Union Literal Types cho các trường cố định
type QuestionType = 'multiple_choice' | 'fill_in_the_blank' | 'matching' | 'rearrange_sentences' | 'rewrite_sentence' | 'image_description' | 'listening_comprehension' | 'reading_comprehension'

type SkillType = 'vocabulary' | 'grammar' | 'reading' | 'listening' | 'writing' // Thêm Writing nếu bạn có các câu hỏi liên quan đến kỹ năng viết

type DifficultyLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'

// Interface chính cho cấu trúc bài kiểm tra đầy đủ
export interface IEnglishExam {
    _id?: string // ID duy nhất của bài kiểm tra
    title: string
    user_id?: IUser
    description: string
    difficulty: DifficultyLevel
    skills: SkillType[]
    timeLimit: number
    questions: Question[] // Mảng các câu hỏi, sử dụng union type Question
    is_published?: boolean // Trạng thái xuất bản
    created_at?: Date
    updated_at?: Date
}
