import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle, XCircle, Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Loading from '@/components/ui/loading'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math' // Plugin để parse cú pháp toán học
import rehypeKatex from 'rehype-katex' // Plugin để render toán học bằng KaTeX
import 'katex/dist/katex.min.css' // Import CSS của KaTeX
import { useLocation, useNavigate } from 'react-router-dom'
import type { IDataQuiz, IHistory } from '@/types/etc'
import { renderContentWithLaTeX, renderHightlightedContent } from '../ai-center/components/renderCode'
import etcService from '@/services/etcService'
import DataEmptyNoti from '@/components/etc/DataEmptyNoti'
import LoadingScreen from '@/components/etc/LoadingScreen'
import aiService from '@/services/aiService'

export default function HistoryDetailPage() {
    const navigate = useNavigate()
    const [history, setHistory] = useState<IHistory | null>(null)
    const [question, setQuestion] = useState<IDataQuiz[] | null>(null)
    const [loadingQuestionIndex, setLoadingQuestionIndex] = useState<number | null>(null)
    const [showExplanation, setShowExplanation] = useState<number | null>(null)
    const [explain, setExplain] = useState<string | null>(null)
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true)
            const id = location.pathname.split('/').pop() || ''
            const res = await etcService.getHistoryDetail(id)
            if (res.ok) {
                setHistory(res.history)
                setQuestion(res.question)
            }
            setLoading(false)
        }
        fetchAPI()
    }, [location.pathname])

    const handleExplainAnswer = useCallback(
        async (questionItem: IDataQuiz, questionIndex: number): Promise<void> => {
            try {
                setLoadingQuestionIndex(questionIndex)

                const response = await aiService.explainAnswer({
                    question: questionItem.question,
                    answers: questionItem.answers,
                    correct: questionItem.correct
                })

                setExplain(response?.data)
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi không xác định'
                toast.error(`Không thể lấy giải thích`, {
                    description: errorMessage,
                    position: 'top-center',
                    duration: 5000,
                })
                setShowExplanation(null)
            } finally {
                setLoadingQuestionIndex(null)
            }
        },
        []
    )
    if (loading) return <LoadingScreen />
    if (!history || !question) {
        return <DataEmptyNoti title="Không tìm thấy lịch sử hoặc câu hỏi tương ứng." message="Hãy thử lại sau hoặc liên hệ hỗ trợ nếu bạn nghĩ đây là lỗi." />
    }
    const toggleExplanation = (questionId: number) => {
        setExplain(null)
        setShowExplanation(showExplanation === questionId ? null : questionId)
        if (showExplanation === questionId) {
            setExplain(null)
            return
        }
        handleExplainAnswer(question[questionId - 1], questionId)
    }

    return (
        <div className="my-8 w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-gray-500 dark:text-white/80">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại trang lịch sử
                </Button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Chi tiết từng câu hỏi</h1>
            </div>

            <div className="space-y-6">
                {question &&
                    question.map((question: any) => (
                        <Card key={question.id} className="">
                            <CardHeader className="">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">
                                        Câu {question.id}: {renderHightlightedContent(question.question)}
                                    </CardTitle>
                                    <Badge
                                        variant={history.userAnswers[question.id] != null ? (history.userAnswers[question.id] == question.correct ? 'default' : 'destructive') : 'outline'}
                                        className="text-white ml-4"
                                    >
                                        {history.userAnswers[question.id] != null ? (history.userAnswers[question.id] == question.correct ? 'Đúng' : 'Sai') : 'Chưa trả lời'}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {question.answers.map((option: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border-2 transition-colors flex items-center ${
                                                index === Number(question.correct)
                                                    ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-800/50 dark:text-green-200 dark:border-green-700'
                                                    : index === Number(history.userAnswers[question.id]) && index !== Number(question.correct)
                                                    ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-800/50 dark:text-red-200 dark:border-red-700'
                                                    : 'border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-800/50'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold ml-2 mr-3">{String.fromCharCode(65 + Number(index))}</span>
                                                <span>{renderContentWithLaTeX(option)}</span>
                                                {Number(history.userAnswers[question.id]) === index && index === Number(question.correct) && (
                                                    <CheckCircle className="h-4 w-4 text-green-600 ml-auto dark:text-green-200" />
                                                )}
                                                {Number(history.userAnswers[question.id]) === index && index !== Number(question.correct) && (
                                                    <XCircle className="h-4 w-4 text-red-600 ml-auto dark:text-red-200" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-start flex-col gap-2">
                                    <div className="relative group overflow-hidden" onClick={() => toggleExplanation(question.id)}>
                                        <Button variant="outline" size="sm" className="bg-linear-to-r from-blue-500 to-purple-500 text-white hover:text-white">
                                            {loadingQuestionIndex === question.id ? (
                                                <Loading className="border-x-white" />
                                            ) : (
                                                <Brain className="h-4 w-4 mr-2 transition-all duration-500 rotate-0 group-hover:rotate-180" />
                                            )}

                                            {showExplanation === question.id && explain ? 'Ẩn giải thích' : 'Giải thích bằng AI'}
                                        </Button>
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
                                    </div>

                                    {showExplanation === question.id && explain && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/50 dark:border-blue-700 text-blue-800 dark:text-blue-200">
                                            <ReactMarkdown rehypePlugins={[rehypeKatex]} remarkPlugins={[remarkMath]}>
                                                {explain}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    )
}
