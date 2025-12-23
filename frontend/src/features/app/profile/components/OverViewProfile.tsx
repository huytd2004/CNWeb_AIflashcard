import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import handleCompareDate from '@/lib/handleCompareDate'
import type { IActivity, IGamification, ILevel } from '@/types/etc'
import { Brain, Calendar, Crown, Flame } from 'lucide-react'

export default function OverViewProfile({
    gamificationProfile,
    levels,
    activities,
    countFlashcard,
    countListFC,
}: {
    gamificationProfile: IGamification
    levels: ILevel[]
    activities: IActivity[]
    countFlashcard: number
    countListFC: number
}) {
    const currentLevel = levels[gamificationProfile.level]
    if (!levels) {
        return <div className="text-center text-red-500">Cấp độ không hợp lệ</div>
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        Hoạt động gần đây
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 h-[200px] overflow-y-auto">
                    {activities &&
                        activities.map((act, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Tạo {act.action}</span>
                                <span className="text-slate-400 ml-auto">{handleCompareDate(act.timestamp)}</span>
                            </div>
                        ))}

                    {activities && activities.length === 0 && <div className="flex items-center justify-center text-sm">Chưa có hoạt động nào...</div>}
                </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-400" />
                        Thống kê
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Ngày liên tiếp</span>
                        <div className="flex items-center gap-1 text-orange-400">
                            <Flame className="w-4 h-4" />
                            <span className="font-bold">{gamificationProfile?.dailyStreak?.current || 0}</span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span>Tổng bộ thẻ</span>
                        <span className="font-bold text-green-400">{countListFC.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tổng từ vựng</span>
                        <span className="font-bold text-green-400">{countFlashcard?.toLocaleString() || 0} từ</span>
                    </div>
                    <div className="flex justify-between">
                        <span>XP kiếm được</span>
                        <span className="font-bold text-yellow-400">{gamificationProfile.xp.toLocaleString()}XP</span>
                    </div>
                </CardContent>
            </Card>

            {/* Next Level Preview */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-400" />
                        Cấp độ tiếp theo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center  bg-linear-to-br from-indigo-400 to-indigo-600 ring-4 ring-indigo-500/50`}>
                            <img src={currentLevel.levelIcon} alt="" width={40} height={40} />
                        </div>

                        <h3 className="font-bold">Cấp {gamificationProfile.level + 1}</h3>
                        <p className="text-sm text-slate-400">{currentLevel?.name}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-400">Cần {(currentLevel.xpRequired - gamificationProfile.xp).toLocaleString()} XP</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
