import { useEffect, useState } from 'react'
import { GraduationCap, Book, Swords, BriefcaseBusiness, Crown, Flame, BicepsFlexed, Sun, Star, Target, Handshake } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { IGamification } from '@/types/etc'
import type { IAchievement } from '@/types/user'

export default function Achievement({ gamificationProfile, achievements }: { gamificationProfile: IGamification; achievements: IAchievement[] }) {
    const IconComponents: any = {
        GraduationCap: GraduationCap,
        Book: Book,
        Swords: Swords,
        BriefcaseBusiness: BriefcaseBusiness,
        Crown: Crown,
        Flame: Flame,
        BicepsFlexed: BicepsFlexed,
        Sun: Sun,
        Star: Star,
        Target: Target,
        Handshake: Handshake,
    }
    const [unlockedAchievementIds, setUnlockedAchievementIds] = useState(new Set())
    useEffect(() => {
        const unlockedIds = new Set(gamificationProfile.achievements.map((item) => item.achievement._id))
        setUnlockedAchievementIds(unlockedIds)
    }, [gamificationProfile])
    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Thành tựu</h2>
                <Badge variant="secondary" className="dark:bg-slate-700">
                    {gamificationProfile.achievements.length}/{achievements.length} đã đạt
                </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                {achievements.map((acv) => {
                    const isUnlocked = unlockedAchievementIds.has(acv._id)
                    const IconComponent = IconComponents[acv.icon]
                    return (
                        <Card
                            key={acv._id}
                            className={`dark:border-slate-700 border-2 ${
                                isUnlocked
                                    ? 'bg-linear-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-600/30 dark:border-purple-500/50'
                                    : 'dark:bg-slate-800'
                            }`}
                        >
                            <CardContent className="p-6 text-center relative">
                                <Badge className="absolute top-2 right-2  text-blue-800 bg-blue-200 dark:text-blue-200 dark:bg-blue-800/50 dark:hover:bg-blue-800 hover:bg-blue-300">
                                    {acv.xpReward.toLocaleString()}XP
                                </Badge>
                                <div
                                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-200 ${
                                        isUnlocked ? 'bg-linear-to-br from-purple-500 to-blue-600 dark:from-purple-800 dark:to-blue-900 text-blue-100' : 'text-slate-400 dark:bg-slate-700'
                                    }`}
                                >
                                    {IconComponent ? <IconComponent size={32} /> : null}
                                </div>
                                <h3 className={`font-bold mb-2 ${isUnlocked ? 'text-blue-400' : 'text-slate-700 dark:text-slate-500'}`}>{acv.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 ">{acv.description}</p>
                                {isUnlocked && <Badge className="mt-3 bg-blue-600 text-white">Đã đạt được</Badge>}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
