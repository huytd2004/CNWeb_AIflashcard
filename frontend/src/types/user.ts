export interface IUser {
    _id: string
    displayName: string
    email: string
    verify: boolean
    role: string
    status: boolean
    profilePicture: string
    created_at: Date
    expire_otp: string
    otp: number
    provider: string
    refresh_token: string
    gamification: {
        _id: string
        xp: number
        level: number
        dailyStreak: { current: number }
        achievements: IUnlockedAchievement[]
    }
}

export interface IUnlockedAchievement {
    achievement: IAchievement
    unlockedAt: Date
}

export interface IAchievement {
    _id: string
    achievementId: string
    name: string
    description: string
    xpReward: number
    icon: string
}
