import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, BookOpen, Eye, TrendingUp, Award } from 'lucide-react'
import {  useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Mock data - bạn sẽ thay thế bằng API thực
const mockData = [
    { name: 'T1', users: 400, views: 2400 },
    { name: 'T2', users: 300, views: 1398 },
    { name: 'T3', users: 200, views: 9800 },
    { name: 'T4', users: 278, views: 3908 },
    { name: 'T5', users: 189, views: 4800 },
    { name: 'T6', users: 239, views: 3800 },
    { name: 'T7', users: 349, views: 4300 },
]

export default function AdminDashboard() {
    const [stats] = useState({
        totalUsers: 1234,
        totalSO: 456,
        totalQuiz: 789,
        totalViews: 12345,
        totalFlashcards: 567,
        activeUsers: 234,
    })

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, Admin! 👋</h1>
                <p className="text-white/90">Đây là tổng quan về hệ thống My FlashCard</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-500" /> +20% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng đề cương</CardTitle>
                        <FileText className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSO}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-500" /> +15% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Quiz</CardTitle>
                        <BookOpen className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalQuiz}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-500" /> +12% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
                        <Eye className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-500" /> +25% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Flashcard</CardTitle>
                        <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalFlashcards}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-500" /> +18% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
                        <Users className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">Trong 24h qua</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Người dùng mới theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={mockData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lượt xem theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={mockData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="views" stroke="#f97316" fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { user: 'Nguyễn Văn A', action: 'đã tạo đề cương mới', time: '5 phút trước', type: 'so' },
                            { user: 'Trần Thị B', action: 'đã tạo quiz mới', time: '15 phút trước', type: 'quiz' },
                            { user: 'Lê Văn C', action: 'đã đăng ký tài khoản', time: '30 phút trước', type: 'user' },
                            { user: 'Phạm Thị D', action: 'đã tạo flashcard', time: '1 giờ trước', type: 'flashcard' },
                            { user: 'Hoàng Văn E', action: 'đã bình luận', time: '2 giờ trước', type: 'comment' },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
