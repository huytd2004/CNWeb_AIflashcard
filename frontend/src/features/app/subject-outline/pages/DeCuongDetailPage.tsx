import { useEffect, useState } from 'react'
import { BookOpen, ChevronLeft, Clock, Search, Star, Target, Zap } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import soService from '@/services/soService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingGrid from '@/components/etc/LoadingGrid'
import ToastLogErrror from '@/components/etc/ToastLogErrror'

export default function DeCuongDetailPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [DeCuongData, setDeCuongData] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    // const [selectedRating, setSelectedRating] = useState(0);
    // const [reviewText, setReviewText] = useState("");
    // const [showReviewForm, setShowReviewForm] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        try {
            const fetchAPI = async () => {
                setLoading(true)

                const req = await soService.getSOBySlug(location.pathname.split('/').pop() || '')
                setDeCuongData(req)
            }
            fetchAPI()
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }, [])
    console.log(DeCuongData)
    const filteredQuestions = DeCuongData?.quest?.data_so.filter((q: any) => q.question.toLowerCase().includes(searchQuery.toLowerCase()) || q.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    return (
        <div className="my-5 w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
            <Button variant={'outline'} className="mb-3" onClick={() => navigate(-1)}>
                <ChevronLeft />
                Quay về
            </Button>
            {/* Hero Section */}
            <div className="mb-5">
                <div className="bg-white/20  rounded-xl p-3 md:p-5 border border-white/20 shadow-xl backdrop-blur-md dark:bg-gray-800/50 dark:border-white/10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-xl lg:text-3xl font-bold bg-linear-to-r from-blue-900 to-indigo-900 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                                        {DeCuongData?.title}
                                    </h1>
                                    <p className="text-gray-600 mt-1 dark:text-gray-500">Bộ đề môn học</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-800 px-4 py-2 rounded-full">
                                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-200" />
                                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{DeCuongData?.lenght} câu hỏi</span>
                                </div>
                                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-800 px-4 py-2 rounded-full">
                                    <Clock className="w-4 h-4 text-green-600 dark:text-green-200" />
                                    <span className="text-sm font-medium text-green-800 dark:text-green-300">~2 giờ học</span>
                                </div>
                                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-800 px-4 py-2 rounded-full">
                                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-200" />
                                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">4.8/5 đánh giá</span>
                                </div>
                            </div>
                            <div className="relative flex-1 max-w-md">
                                <Input placeholder="Tìm kiếm câu hỏi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12" />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4 z-1" />
                            </div>
                        </div>

                        <Link to={`/decuong/flashcard/${DeCuongData?.slug}`} className="flex flex-col sm:flex-row gap-3">
                            <Button
                                size="lg"
                                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <Zap className="w-5 h-5 mr-2" />
                                Học bằng Flashcard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Questions List */}
            <div className="flex items-start gap-5">
                <div className="flex-1 space-y-4">
                    {filteredQuestions &&
                        filteredQuestions.map((question: any, index: number) => (
                            <Card
                                key={question._id}
                                id={`question-${index + 1}`}
                                className="group hover:shadow-lg transition-all duration-200 bg-white/20 border-white/20 hover:bg-white/30 dark:bg-gray-800/50 dark:border-white/10 rounded-xl"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex">
                                        <div className="flex-1 flex items-start gap-3">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white/60 leading-relaxed">{question.question}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0" id={`question-${index + 1}`}>
                                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl p-4 border border-blue-100 dark:border-white/10">
                                        <p className="text-blue-800 dark:text-blue-200 font-medium">{question.answer}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    {loading && <LoadingGrid />}
                </div>
                <div className="hidden md:grid grid-cols-2 md:grid-cols-5 gap-3">
                    {filteredQuestions &&
                        filteredQuestions.length > 0 &&
                        filteredQuestions.map((question: any, index: number) => (
                            <Link
                                key={question._id}
                                to={`#question-${index + 1}`}
                                className="bg-gray-600  flex items-center justify-center w-full h-8 rounded-md text-white font-medium hover:bg-gray-700 transition-all text-sm duration-200"
                            >
                                {index + 1}
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    )
}
