import { useEffect, useState } from 'react'
import { BookOpen, ChevronLeft, Clock, Search, Star, Target, Zap, Download, FileText, Eye } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import soService from '@/services/soService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingGrid from '@/components/etc/LoadingGrid'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import { Badge } from '@/components/ui/badge'

export default function DeCuongDetailPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [DeCuongData, setDeCuongData] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    // const [selectedRating, setSelectedRating] = useState(0);
    // const [reviewText, setReviewText] = useState("");
    // const [showReviewForm, setShowReviewForm] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()

    // Parse format: "A. text|B. text|C. text|D. text|correct:A"
    const parseAnswer = (answerString: string) => {
        const parts = answerString.split('|')
        const options: Array<{ label: string; text: string }> = []
        let correctAnswer = ''

        parts.forEach((part) => {
            if (part.startsWith('correct:')) {
                correctAnswer = part.replace('correct:', '').trim()
            } else {
                const match = part.match(/^([A-D])\.\s*(.+)/)
                if (match) {
                    options.push({
                        label: match[1],
                        text: match[2].trim(),
                    })
                }
            }
        })

        return { options, correctAnswer }
    }

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
    
    const isFileType = DeCuongData?.type !== 'txt'
    const filteredQuestions = DeCuongData?.quest?.data_so?.filter((q: any) => q.question.toLowerCase().includes(searchQuery.toLowerCase()) || q.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return '📄'
            case 'docx':
                return '📘'
            case 'xlsx':
                return '📊'
            default:
                return '📁'
        }
    }
    
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
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-xl lg:text-3xl font-bold bg-linear-to-r from-blue-900 to-indigo-900 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                                            {DeCuongData?.title}
                                        </h1>
                                        {isFileType && (
                                            <Badge variant="secondary" className="text-lg">
                                                {getFileIcon(DeCuongData?.type)} {DeCuongData?.type?.toUpperCase()}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mt-1 dark:text-gray-500">
                                        {isFileType ? 'Tài liệu học tập' : 'Bộ đề môn học'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-6">
                                {!isFileType && (
                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-800 px-4 py-2 rounded-full">
                                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-200" />
                                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{DeCuongData?.lenght} câu hỏi</span>
                                    </div>
                                )}
                                {isFileType && (
                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-800 px-4 py-2 rounded-full">
                                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-200" />
                                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{DeCuongData?.lenght || 0} MB</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-800 px-4 py-2 rounded-full">
                                    <Clock className="w-4 h-4 text-green-600 dark:text-green-200" />
                                    <span className="text-sm font-medium text-green-800 dark:text-green-300">~2 giờ học</span>
                                </div>
                                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-800 px-4 py-2 rounded-full">
                                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-200" />
                                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">4.8/5 đánh giá</span>
                                </div>
                            </div>
                            {!isFileType && (
                                <div className="relative flex-1 max-w-md">
                                    <Input placeholder="Tìm kiếm câu hỏi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12" />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4 z-1" />
                                </div>
                            )}
                        </div>

                        {!isFileType ? (
                            <Link to={`/decuong/flashcard/${DeCuongData?.slug}`} className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    size="lg"
                                    className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Học bằng Flashcard
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    size="lg"
                                    onClick={() => window.open(DeCuongData?.link, '_blank')}
                                    className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Eye className="w-5 h-5 mr-2" />
                                    Xem tài liệu
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => {
                                        const link = document.createElement('a')
                                        link.href = DeCuongData?.link
                                        link.download = DeCuongData?.title || 'document'
                                        link.click()
                                    }}
                                    className="shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Tải xuống
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {isFileType ? (
                // File preview section
                <Card className="bg-white/20 border-white/20 dark:bg-gray-800/50 dark:border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {getFileIcon(DeCuongData?.type)}
                            <span>Xem trước tài liệu</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {DeCuongData?.type === 'pdf' ? (
                            <div className="w-full h-[800px] border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                                <iframe
                                    src={`${DeCuongData?.link}#toolbar=0`}
                                    className="w-full h-full"
                                    title="PDF Preview"
                                />
                            </div>
                        ) : (
                            <div className="text-center py-20 space-y-4">
                                <div className="text-6xl">{getFileIcon(DeCuongData?.type)}</div>
                                <h3 className="text-xl font-semibold">Không thể xem trước file {DeCuongData?.type?.toUpperCase()}</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Vui lòng tải xuống để xem nội dung
                                </p>
                                <div className="flex gap-3 justify-center pt-4">
                                    <Button
                                        onClick={() => window.open(DeCuongData?.link, '_blank')}
                                        className="bg-linear-to-r from-blue-600 to-indigo-600"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Mở trong tab mới
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const link = document.createElement('a')
                                            link.href = DeCuongData?.link
                                            link.download = DeCuongData?.title || 'document'
                                            link.click()
                                        }}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Tải xuống
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {/* Document Info */}
                        {DeCuongData?.content && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-200">Mô tả:</h4>
                                <p className="text-gray-700 dark:text-gray-300">{DeCuongData?.content}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                // Questions List for txt type
                <div className="flex items-start gap-5">
                    <div className="flex-1 space-y-4">
                        {filteredQuestions &&
                            filteredQuestions.map((question: any, index: number) => {
                                const { options, correctAnswer } = parseAnswer(question.answer)
                                return (
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
                                            <div className="space-y-2">
                                                {options.map((option) => {
                                                    const isCorrect = option.label === correctAnswer
                                                    return (
                                                        <div
                                                            key={option.label}
                                                            className={`p-3 rounded-lg border-2 transition-all ${
                                                                isCorrect
                                                                    ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-400'
                                                                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className={`font-bold min-w-[24px] ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {option.label}.
                                                                </span>
                                                                <span className={`flex-1 ${isCorrect ? 'font-semibold text-green-800 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                    {option.text}
                                                                </span>
                                                                {isCorrect && (
                                                                    <span className="ml-auto text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                                                        ✓ Đúng
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        {loading && <LoadingGrid />}
                    </div>
                    <div className="sticky top-5 hidden md:block">
                        <Card className="bg-white/20 border-white/20 dark:bg-gray-800/50 dark:border-white/10 p-4 w-[280px]">
                            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                Danh sách câu hỏi
                            </h3>
                            <div className="grid grid-cols-5 gap-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                                {filteredQuestions &&
                                    filteredQuestions.length > 0 &&
                                    filteredQuestions.map((question: any, index: number) => (
                                        <button
                                            key={question._id}
                                            onClick={() => {
                                                const element = document.getElementById(`question-${index + 1}`)
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                                }
                                            }}
                                            className="bg-gray-300 dark:bg-gray-600 flex items-center justify-center w-full aspect-square rounded-lg text-gray-800 dark:text-white font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg border border-gray-400 dark:border-gray-500 cursor-pointer"
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
