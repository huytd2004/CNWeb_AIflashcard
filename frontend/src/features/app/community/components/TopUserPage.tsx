import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, Medal, Award, Trophy, Flame, Eye, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Loading from '@/components/ui/loading'
import etcService from '@/services/etcService'
import type { IPodiumUser } from '@/types/etc'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { Link, useNavigate } from 'react-router-dom'
import AvatarCircle from '@/components/etc/AvatarCircle'

export default function TopUserPage() {
    const [podiumUsers, setPodiumUsers] = useState<IPodiumUser[]>([])
    const [currentUser, setCurrentUser] = useState<IPodiumUser | null>(null)
    const [limit] = useState(10)
    const [skip, setSkip] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const { onlineUsers } = useSocket()
    const { user } = useAuth() || {}
    // const [pagination, setPagination] = useState<IPagination>({ currentPage: 1, totalPages: 1, itemsPerPage: 10, totalItems: 0, hasNextPage: false, hasPrevPage: false })
    // const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true)
            const res = await etcService.getTopGamification({ currentPage: 1, itemsPerPage: 10, user_id: user?._id })
            if (res?.ok) {
                setPodiumUsers(res?.topUsers)
                setCurrentUser(res?.currentUser || null)

                setSkip(skip + limit)
            }
            setLoading(false)
        }
        fetchAPI()
    }, [limit, user?._id])

    const handleLoadMore = async () => {
        if (loadingMore) return
        setLoadingMore(true)
        const res = await etcService.getTopGamification({ currentPage: 1, itemsPerPage: 10, user_id: user?._id })

        if (res?.ok) {
            setPodiumUsers((prev) => [...prev, ...(res?.topUsers || [])])
            setHasMore(res?.hasMore)
            setSkip(skip + limit)
        }
        setLoadingMore(false)
    }
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-5 w-5 text-yellow-500" />
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />
            case 3:
                return <Award className="h-5 w-5 text-amber-600" />
            default:
                return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
        }
    }

    const getRankBadge = (rank: number) => {
        switch (rank) {
            case 1:
                return (
                    <Badge className="bg-linear-to-r from-yellow-500 to-yellow-700 text-white font-bold">
                        <Crown className="h-3 w-3 mr-1" />
                        Vua Quiz
                    </Badge>
                )
            case 2:
                return (
                    <Badge className="bg-linear-to-r from-gray-300 to-gray-500 text-black font-bold">
                        <Medal className="h-3 w-3 mr-1" />Á Vương
                    </Badge>
                )
            case 3:
                return (
                    <Badge className="bg-linear-to-r from-amber-500 to-amber-700 text-white font-bold">
                        <Award className="h-3 w-3 mr-1" />
                        Hạng Ba
                    </Badge>
                )
            default:
                return null
        }
    }

    const getIconLevel = (level: number) => {
        if (level <= 3) {
            return '/icon-level/crystal_lv1_1-3.svg' // Default icon for invalid levels
        }
        if (level <= 6) {
            return `/icon-level/crystal_lv2_4-6.svg` // Assuming icons are named as crystal_lv1.svg, crystal_lv2.svg, etc.
        }
        if (level <= 9) {
            return `/icon-level/crystal_lv3_7-9.svg`
        }
        if (level <= 12) {
            return `/icon-level/crystal_lv4_10-12.svg`
        }
        if (level <= 15) {
            return `/icon-level/crystal_lv5_13-15.svg`
        }
        return `/icon-level/crystal_lv6_16-18.svg`
    }

    const checkOnline = (userId: string) => {
        return onlineUsers?.find((item: any) => item?._id === userId)
    }
    const navigate = useNavigate()
    return (
        <div className="my-8 w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
            <div className="">
                <Button onClick={() => navigate(-1)} variant="secondary">
                    <ChevronLeft /> Quay về
                </Button>
                <Card className=" mt-5 ">
                    <CardHeader className="">
                        <CardTitle className=" flex items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/20 dark:bg-primary-800/50">
                                <Trophy size={20} className="text-primary-700 dark:text-primary-500" />
                            </div>
                            <div className="">
                                <p className="mb-1">Bảng Xếp Hạng TOP 10 </p>
                                <p className="text-xs dark:text-slate-400 text-slate-500">Thành tích của các thành viên xuất sắc nhất</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {podiumUsers.map((us, index) => (
                                <Link
                                    to={`/profile/${us.user_id._id}`}
                                    key={index}
                                    className={cn(
                                        'overflow-hidden flex items-center gap-2 md:gap-4 p-2 md:p-4 rounded-lg transition-all dark:hover:bg-slate-600/50',
                                        index <= 2 ? 'dark:bg-slate-600/30 border dark:border-slate-500/50' : 'bg-gray-50 dark:bg-slate-600/20',
                                        us?.user_id?._id == user?._id && 'bg-green-50 dark:bg-green-700/20'
                                    )}
                                >
                                    {/* Rank */}
                                    <div className="flex items-center justify-center w-8">{getRankIcon(index + 1)}</div>

                                    {/* Avatar with online status */}
                                    <div className="relative">
                                        <AvatarCircle user={us.user_id} />

                                        {checkOnline(us.user_id._id) && <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-slate-700 rounded-full"></div>}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex md:items-center gap-1 md:gap-2 mb-1 flex-col md:flex-row items-start">
                                            <h3 className="font-semibold   truncate">{us.user_id.displayName}</h3>
                                            <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1 text-xs">
                                                <img src={getIconLevel(us?.level || 0)} width={14} height={14} alt="" />
                                                Cấp {us?.level || 0}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm ">
                                            <span className="flex items-center gap-1 text-slate-400">
                                                <Flame size={14} className=" stroke-yellow-500" />
                                                {us.dailyStreak.current} ngày
                                            </span>
                                        </div>
                                        {/* {us.badges && us.badges.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {us.badges.slice(0, 2).map((badge, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-slate-500 text-slate-300">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )} */}
                                    </div>

                                    {/* Rank Badge */}
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="hidden md:block">{getRankBadge(index + 1)}</div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold ">{us.xp.toLocaleString()}</div>
                                            <div className="text-xs text-slate-400">XP</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            <div className="w-full text-center">
                                {!loading && (
                                    <Button variant="secondary" onClick={() => handleLoadMore()} disabled={loadingMore || !hasMore} className="w-full">
                                        {loadingMore ? <Loading /> : <Eye />}
                                        Xem thêm
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="mt-5 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        {user && currentUser && (
                            <Link
                                to={`/profile/${currentUser.user_id._id}`}
                                key={currentUser.user_id._id}
                                className={cn(
                                    'flex items-center gap-2 p-2 md:gap-4 md:p-4 mt-3 rounded-lg transition-all dark:hover:bg-slate-600/50 bg-green-50 dark:bg-green-700/20 border dark:border-slate-500/50'
                                )}
                            >
                                {/* Rank */}
                                <div className="flex items-center justify-center w-8">{getRankIcon(currentUser.rank)}</div>

                                {/* Avatar with online status */}
                                <div className="relative">
                                    <AvatarCircle user={currentUser.user_id} />

                                    {checkOnline(currentUser.user_id._id) && <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-slate-700 rounded-full"></div>}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex md:items-center gap-1 md:gap-2 mb-1 flex-col md:flex-row items-start">
                                        <h3 className="font-semibold  truncate">{currentUser.user_id.displayName}</h3>
                                        <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1 text-xs">
                                            <img src={getIconLevel(currentUser.level || 0)} width={14} height={14} alt="" />
                                            Cấp {currentUser.level || 0}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Flame size={14} className=" stroke-yellow-500" />
                                            {currentUser.dailyStreak.current} ngày
                                        </span>
                                    </div>
                                </div>

                                {/* Rank Badge */}
                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-right">
                                        <div className="text-lg font-bold ">{currentUser.xp.toLocaleString()}</div>
                                        <div className="text-xs text-slate-400">XP</div>
                                    </div>
                                </div>
                            </Link>
                        )}
                        {loading && (
                            <div className="flex items-center justify-center h-[500px]">
                                <Loading className="w-10 h-10" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
