import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, Calendar, Clock, Target } from 'lucide-react'
import { toast } from 'sonner'
import etcService from '@/services/etcService'
import { useNavigate } from 'react-router-dom'
import type { IHistory } from '@/types/etc'
import { useAuth } from '@/contexts/AuthContext'
import handleCompareDate from '@/lib/handleCompareDate'
import LoadingScreen from '@/components/etc/LoadingScreen'

export default function HistoryPage() {
    const [historyData, setHistoryData] = useState<IHistory[]>()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuth()
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            const res = await etcService.getHistoryUser()
            setHistoryData(res?.history)
            setLoading(false)
        }
        fetchHistory()
    }, [user])

    useEffect(() => {
        if (user === null) {
            toast.error('Vui lòng đăng nhập để xem lịch sử quiz', {
                description: 'Bạn cần đăng nhập để truy cập vào lịch sử quiz của mình.',
                action: {
                    label: 'Đăng nhập',
                    onClick: () => {
                        navigate('/login')
                    },
                },
            })
        }
    }, [user])
    if (loading) return LoadingScreen()
    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100
        if (percentage >= 80) return 'text-green-600 bg-green-50 dark:text-green-200 dark:bg-green-700/50'
        if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-200 dark:bg-yellow-700/50'
        return 'text-red-600 bg-red-50 dark:text-red-200 dark:bg-red-700/50'
    }

    const getScorePercentage = (score: number, total: number) => {
        if (total === 0) return 0 // Avoid division by zero
        if (score === 0) return 0 // If score is zero, return 0%
        return Math.round((score / total) * 100)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return (
        <div className="my-8 w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
            <div className="">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white/80">Lịch Sử Quiz</h1>
                    <p className="text-gray-600 dark:text-gray-400">Xem lại các bài quiz bạn đã hoàn thành</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {historyData &&
                        historyData.map((quiz) => (
                            <Card key={quiz._id} className="hover:shadow-lg transition-all duration-300 border shadow-md border-transparent dark:border-white/10 dark:bg-slate-800/50">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white/80 line-clamp-2">{quiz.quiz_id.title}</CardTitle>
                                        <Badge variant="secondary" className="ml-2 shrink-0">
                                            {quiz.quiz_id.subject}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Target className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium">Điểm số</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(quiz.score, quiz.total_questions)}`}>
                                            {quiz.score}/{quiz.total_questions} ({getScorePercentage(quiz.score, quiz.total_questions)}%)
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{formatTime(quiz.time)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            {quiz.date && <span>{handleCompareDate(quiz.date)}</span>}
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 bg-primary hover:bg-primary/80 dark:text-white" onClick={() => navigate(`/history/${quiz._id}`)}>
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Xem Chi Tiết
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>
        </div>
    )
}
