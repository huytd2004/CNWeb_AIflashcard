import type { Key } from 'react'
import type { IAchievement, IUser } from './user'

export interface IHistory {
    _id: string
    user_id: IUser
    quiz_id: QuizId
    score: number
    total_questions: number
    time: number
    userAnswers: Key[]
    date: Date
}

interface QuizId {
    _id: string
    title: string
    subject: string
}
export interface IPagination {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
}
export interface APIResponse<T> {
    ok: boolean
    status: string
    statusCode: number
    message: string
    data: T
    timestamp: string
}

export interface Voice {
    id: string
    name: string
    gender: string
    code: string
    language: string
    country: string
    description: string
    premium: boolean
    popular: boolean
    avatar: string
    sample: string
}

export interface IChat {
    _id: string
    participants: {
        userId: IUser
    }[]
    messages: IMessage[]
    last_message: string
    last_message_date: Date
    is_read: boolean
}

export interface IMessage {
    userId: IUser
    message: string
    image?: string
    isEdit: boolean
    replyTo?: IMessage
    unsend: boolean
    reactions: {
        userId: IUser
        emoji: string
    }[]
}

export interface IGamification {
    _id: string
    user_id: IUser
    xp: number
    level: number
    dailyStreak: {
        current: number
        lastActivityDate: Date
    }
    dailyProgress: IDailyProgress
    achievements: IUnlockedAchievement[]
}
export interface IUnlockedAchievement {
    achievement: IAchievement
    unlockedAt: Date
}

export interface IDailyProgress {
    date: Date
    tasks: DailyTask[]
}

export interface DailyTask {
    count: number
    taskId: string
}

export interface ILevel {
    _id: string
    level: number
    name: string
    xpRequired: number
    levelIcon: string
}

export interface IDailyTask {
    _id: string
    taskId: string
    name: string
    description: string
    icon: string
    xpPerAction: number
    dailyLimitCount: number
    unlockLevel: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface TASKS {
    REVIEW_CARD: REVIEWCARD
    ADD_WORD: REVIEWCARD
    CREATE_QUIZ: REVIEWCARD
    DO_QUIZ: REVIEWCARD
    RATE_QUIZ: REVIEWCARD
}

export interface REVIEWCARD {
    _id: string
    taskId: string
    name: string
    description: string
    xpPerAction: number
    dailyLimitCount: number
    unlockLevel: number
    icon: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface IPodiumUser {
    dailyStreak: DailyStreak
    _id: string
    user_id: IUser
    xp: number
    level: number
    rank: number
}

interface DailyStreak {
    current: number
    lastActivityDate?: string
}

export interface IFeedback {
    _id: string
    user_id: IUser
    title: string
    comment: string
    category: string
    rating: number
    likes: number
    createdAt: Date
    updatedAt: Date
}

export interface IActivity {
    _id: string
    userId: IUser
    action: string
    targetType: string
    targetId: string
    timestamp: Date
}

export interface IQuiz {
    _id: string
    slug: string
    title: string
    uid: IUser
    subject: string
    content: string
    img: string
    noa: number
    view: number
    difficulty: string
    date: Date
    status: boolean
    questions: IQuestion
    comment: IComment[]
}

export interface IComment {
    user_id: IUser
    quiz_id?: string
    rating: number
    review: string
    helpful: number
    _id: string
    created_at: Date
}

export interface IQuestion {
    _id: string
    data_quiz: IDataQuiz[]
}

export interface IDataQuiz {
    id: string
    question: string
    answers: []
    correct: string
}

export interface ISummary {
    weeklyReviewedWordsCount: number
    wordAccuracy: {
        accuracyPercentage: number
        correctReviews: number
        totalReviews: number
    }
    words: {
        learnedWords: []
        rememberedWords: []
        reviewingWords: []
    }
}

export interface ISelectedWord {
    title: string
    type: string
    define: string
    words: IWords[]
}

export interface IWords {
    title: string
    define: string
    nextReviewDate: Date
}
