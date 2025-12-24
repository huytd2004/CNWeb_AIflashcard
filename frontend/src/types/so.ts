import type { IUser } from './user'

export interface ISO {
    _id: string
    user_id: IUser
    slug: string
    title: string
    content: string
    link: string
    image: string
    date: Date
    lenght: number
    view: number
    type: string
    subject: string
    quest: IQuestionSO
}

interface IQuestionSO {
    _id: number
    data_so: IDataSO[]
}

interface IDataSO {
    _id: string
    question: string
    answer: string
}
