import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, BookOpen, Chrome, Github, Save, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function IntroductExtension() {
    return (
        <div className="mt-10 bg-linear-to-r from-emerald-200/80 to-lime-200/80 dark:from-emerald-800/50 dark:to-lime-800/50 pt-5 rounded-xl shadow-md border border-gray-300 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-center flex-col gap-3  px-3">
                <Badge className="flex gap-2 items-center bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200">
                    <Chrome />
                    Extension mới
                </Badge>
                <h2 className="text-2xl text-center md:text-4xl font-bold text-gray-700 dark:text-gray-200">
                    Học từ vựng thông minh với <span className="text-emerald-600">Extension Dịch Thuật</span>
                </h2>
                <p className="text-md md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center">
                    Biến việc lướt web thành cơ hội học tập! Dịch từ vựng ngay lập tức và tự động lưu vào flashcard cá nhân.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-3 md:gap-8 px-5 mt-3">
                <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800/50 dark:text-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Dịch Tức Thì</h3>
                        <p className="text-gray-600 dark:text-gray-400">Chỉ cần bôi đen từ vựng, nghĩa tiếng Việt hiện ngay lập tức. Hỗ trợ nhiều ngôn ngữ phổ biến.</p>
                    </CardContent>
                </Card>

                <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 dark:text-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Save className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Lưu Từ Thông Minh</h3>
                        <p className="text-gray-600 dark:text-gray-400">Gặp từ hay? Một cú click là lưu ngay! Không bao giờ quên những từ vựng quan trọng nữa.</p>
                    </CardContent>
                </Card>

                <Card className="border border-transparent dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800/50 dark:text-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Flashcard Tự Động</h3>
                        <p className="text-gray-600 dark:text-gray-400">Từ vựng đã lưu tự động chuyển thành flashcard, đồng bộ với tài khoản Quizzet của bạn.</p>
                    </CardContent>
                </Card>
            </div>
            <div className="text-center">
                <div className="dark:bg-slate-800/20 mt-5 p-8 text-white">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">Sẵn sàng nâng cao trải nghiệm học từ vựng?</h3>
                    <p className="text-emerald-700 dark:text-emerald-100 mb-6 max-w-2xl mx-auto text-md">Tải extension ngay hôm nay và biến mọi trang web thành lớp học từ vựng của riêng bạn!</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="https://github.com/trongandev/translate-quizzet-extension">
                            <Button size="lg" className="bg-white dark:bg-emerald-800/50 dark:text-emerald-200 text-emerald-600 hover:scale-105 transition-transform duration-300 hover:bg-white/90">
                                <Github className="w-5 h-5 mr-2" />
                                Tải về từ Github
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-6 text-emerald-600 dark:text-emerald-100 ">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                            <span className="text-sm">Miễn phí 100%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                            <span className="text-sm">Không quảng cáo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 dark:bg-emerald-300 bg-emerald-600 rounded-full"></div>
                            <span className="text-sm">Đồng bộ tài khoản</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
