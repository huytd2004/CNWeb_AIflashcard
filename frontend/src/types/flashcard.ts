import type { IUser } from './user'

export interface IListFlashcard {
    _id: string
    userId: IUser
    title: string
    language: 'chinese' | 'english' | 'french' | 'germany' | 'japan' | 'korea' | 'vietnamese'
    desc: string
    public: boolean
    isSuccess: boolean
    isHiddenTranscription: boolean
    flashcards: Flashcard[]
    accuracyPercentage: number
    countCardsDueToday: number
    created_at: Date
    last_practice_date: Date
    progress: IProgress
}

export interface Flashcard {
    _id: string
    userId: string
    title: string
    define: string
    language: string
    type_of_word: string
    transcription: string
    level: string
    example: Example[]
    note: string
    nextReviewDate: Date
    interval: number
    repetitions: number
    progress: { learnedTimes: number; percentage: number }
    efactor: number
    status: string
    history: any[]
    created_at: Date
}

export interface IEditFlashcard {
    _id: string
    title: string
    language: string
    desc: string
    public: boolean
}

export interface Example {
    en: string
    vi: string
    _id: string
    trans?: string
}

export interface IProgress {
    percentage: number
    rememberedCards: number
    totalCards: number
}

export interface IWordCount {
    learned: number
    remembered: number
    total: number
    reviewing: number
}
