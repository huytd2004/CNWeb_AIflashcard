export interface IGeneratedQuiz {
    title: string
    subject: string
    content: string
    questions: Quiz[]
}

export interface Quiz {
    id: string
    type: "multiple-choice" | "true-false" | "short-answer"
    question: string
    answers?: string[]
    correct: string
    points: number
}

export interface QuizAIInterface {
    topic: string
    description: string
    questionCount: number[]
    difficulty: "easy" | "medium" | "hard"
}

export interface QuizAIText {
    content: string
    questionCount: number[]
}
