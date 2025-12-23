import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar, Mail } from 'lucide-react'

import type { IAchievement, IUser } from '@/types/user'
import type { IListFlashcard } from '@/types/flashcard'
import { useAuth } from '@/contexts/AuthContext'
import handleCompareDate from '@/lib/handleCompareDate'
import { Progress } from '@/components/ui/progress'
import UpdateProfile from './UpdateProfile'
import OverViewProfile from './OverViewProfile'
import Achievement from './Achievement'
import LevelProfile from './LevelProfile'
import PublicFC from '../../flashcard/components/PublicFC'
import UserFC from '../../flashcard/components/UserFC'
import QuizInProfile from './QuizInProfile'
import type { IActivity, IGamification, ILevel, IQuiz } from '@/types/etc'

interface PropsProfile {
    profile: IUser
    quiz: IQuiz[]
    flashcard: IListFlashcard[]
    achievements: IAchievement[]
    gamificationProfile: IGamification
    levels: ILevel[]
    activities: IActivity[]
    countFlashcard: number
    isAnotherUser: boolean
}
export default function UserProfile({ profile, quiz, flashcard, gamificationProfile, achievements, levels, activities, countFlashcard, isAnotherUser = false }: PropsProfile) {
    const { user } = useAuth() || {
        user: null,
    }
    const [userProfile, setUserProfile] = useState<IUser | null>(null)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    useEffect(() => {
        const tempUser = user?._id === profile?._id ? user : profile
        setUserProfile(tempUser)
    }, [user, profile, setUserProfile])
    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col gap-3">
                <div className="text-gray-500 dark:text-gray-300">Không tìm thấy hồ sơ người dùng.</div>
                <Button className="text-white">Vui lòng đăng nhập lại</Button>
            </div>
        )
    }

    const getBorderColor = (level: number) => {
        if (level < 3) return 'border-lv1'
        if (level < 6) return 'border-lv2'
        if (level < 9) return 'border-lv3'
        if (level < 12) return 'border-lv4'
        if (level < 15) return 'border-lv5'
        if (level > 16) return 'border-lv6'
    }
    const currentLevel = levels[gamificationProfile?.level]
    return (
        <div className="w-full mx-auto md:max-w-7xl px-3 md:px-5 py-10">
            <Card className="mb-8 dark:border-white/10 dark:bg-slate-800/50">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className={`w-32 h-32 ${getBorderColor(gamificationProfile.level)} rounded-full flex items-center justify-center`}>
                            <Avatar className="w-28 h-28  shadow-md   ">
                                <AvatarImage src={userProfile?.profilePicture} alt={userProfile?.displayName} className="object-cover" />
                                <AvatarFallback className="text-2xl font-semibold bg-linear-to-br from-blue-500 to-purple-600 text-white">
                                    {userProfile?.displayName
                                        ? userProfile?.displayName
                                              .split(' ')
                                              .map((n) => n[0])
                                              .join('')
                                        : 'N/A'}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300 ">{userProfile?.displayName || 'N/A'}</h1>
                                {levels && gamificationProfile && gamificationProfile.level && levels[gamificationProfile.level] && (
                                    <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1">
                                        <img src={levels[gamificationProfile.level - 1].levelIcon} width={16} height={16} alt="" />
                                        Cấp {gamificationProfile.level}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-slate-400 mb-1">{levels[gamificationProfile?.level - 1]?.name}</p>

                            <div className="flex items-center justify-center md:justify-start gap-2 light:text-gray-600 dark:text-white/60">
                                <Mail className="w-4 h-4" />
                                <span>{userProfile?.email}</span>
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-2 light:text-gray-500 mb-4 dark:text-white/60">
                                <Calendar className="w-4 h-4" />
                                {userProfile?.created_at && <span>Tham gia {handleCompareDate(userProfile?.created_at)}</span>}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>{gamificationProfile?.xp.toLocaleString() || 0} XP</span>
                                    <span>{currentLevel?.xpRequired.toLocaleString() || 0} XP</span>
                                </div>
                                <Progress value={(gamificationProfile?.xp / currentLevel?.xpRequired) * 100 || 0} className="h-2" />
                                <p className="text-xs text-slate-400">
                                    Còn {(currentLevel?.xpRequired - gamificationProfile?.xp).toLocaleString() || 0} XP để lên cấp {gamificationProfile?.level + 1 || 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            {user?._id == userProfile?._id && <UpdateProfile isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} user={userProfile} />}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
                <div className="w-full">
                    <TabsList className="dark:bg-slate-800 dark:border-slate-700">
                        <TabsTrigger value="overview" className="dark:data-[state=active]:bg-slate-700">
                            Tổng quan
                        </TabsTrigger>

                        <TabsTrigger value="achievements" className="dark:data-[state=active]:bg-slate-700">
                            Thành tựu
                        </TabsTrigger>
                        <TabsTrigger value="levels" className="dark:data-[state=active]:bg-slate-700">
                            Cấp độ
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6">
                    {gamificationProfile && (
                        <OverViewProfile gamificationProfile={gamificationProfile} levels={levels} activities={activities} countFlashcard={countFlashcard} countListFC={flashcard.length || 0} />
                    )}
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                    {gamificationProfile && <Achievement gamificationProfile={gamificationProfile} achievements={achievements} />}
                </TabsContent>

                <TabsContent value="levels" className="space-y-6">
                    {gamificationProfile && <LevelProfile gamificationProfile={gamificationProfile} levels={levels} />}
                </TabsContent>
            </Tabs>
            <div className="mt-5 bg-gray-200/50 dark:bg-gray-800/50 dark:border-gray-700/60 p-3 md:p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="pl-1 flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Bộ Flashcard của {userProfile?._id === userProfile?._id ? 'bạn' : userProfile?.displayName}</h2>
                    <Badge variant="secondary" className="dark:bg-slate-700">
                        {(flashcard && flashcard?.length) || 0} flashcard
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
                    {flashcard &&
                        flashcard.map((item) => {
                            if (isAnotherUser) return <PublicFC key={item._id} item={item} />
                            return <UserFC item={item} key={item._id} />
                        })}

                    {flashcard && flashcard?.length === 0 && <div className="h-[350px] col-span-12 flex items-center justify-center text-gray-700">Không có dữ liệu...</div>}
                </div>
            </div>
            <div className="mt-5 bg-gray-200/50 dark:bg-gray-800/50 dark:border-gray-700/60 p-3 md:p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="pl-1 flex justify-between items-center mb-3">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Bộ Quiz của {userProfile?._id === userProfile?._id ? 'bạn' : userProfile?.displayName}</h2>
                    <Badge variant="secondary" className="dark:bg-slate-700">
                        {quiz?.length || 0} bộ quiz
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto">
                    {quiz && quiz.map((post, index) => <QuizInProfile key={index} post={post} />)}
                    {quiz && quiz?.length === 0 && <div className="h-[350px] col-span-12 flex items-center justify-center text-gray-500">Không có dữ liệu...</div>}
                </div>
            </div>
        </div>
    )
}
