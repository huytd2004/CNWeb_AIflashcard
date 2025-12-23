import type { IUser } from './user'

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

export interface IChatCommunity {
    room: {
        type: string
        default: string
        unique: boolean
        index: boolean
    }
    messages: {
        type: string
        ref: string
    }[]
}

export interface IChatCommunityMessage {
    _id: string
    userId: IUser
    message: string
    image: string
    isEdit: boolean
    replyTo: IReplyTo
    unsend: boolean
    reactions: any[]
    timestamp: Date
    __v: number
}

export interface IReplyTo {
    _id: string
    userId: IUser
    message: string
    image: string
    unsend: boolean
}
