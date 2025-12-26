import axiosInstance from './axiosInstance'

// Interface definitions
interface QuizInterfaceData {
    topic: string
    description?: string
    questionCount?: number
    difficulty?: string
}

interface QuizTextData {
    content: string
    questionCount?: number
}

interface EnglishExamData {
    title?: string
    description?: string
    content: string
    difficulty: string
    skills: string[]
    questionTypes?: string[]
    questionCount?: number
    timeLimit?: number
}

interface FlashcardData {
    vocabulary: string
    language: string
}

interface ExplainAnswerData {
    question: string
    answers: string[]
    correct: number | string
}

class AIService {
    // Generate Quiz from interface input
    async generateQuizInterface(data: QuizInterfaceData) {
        const response = await axiosInstance.post<any>('/ai/quiz/interface', data)
        return response.data
    }

    // Generate Quiz from text input
    async generateQuizText(data: QuizTextData) {
        const response = await axiosInstance.post<any>('/ai/quiz/text', data)
        return response.data
    }

    // Generate Quiz title
    async generateQuizTitle(questions: any[]) {
        const response = await axiosInstance.post<any>('/ai/quiz/title', { questions })
        return response.data
    }

    // Generate English Exam
    async generateEnglishExam(data: EnglishExamData) {
        const response = await axiosInstance.post<any>('/ai/english-exam', data)
        return response.data
    }

    // Generate Flashcards with AI
    async generateFlashcards(data: FlashcardData) {
        const response = await axiosInstance.post<any>('/ai/flashcards', data)
        return response.data
    }

    // Explain answer with AI
    async explainAnswer(data: ExplainAnswerData) {
        const response = await axiosInstance.post<any>('/ai/explain', data)
        return response.data
    }
}

export default new AIService()
