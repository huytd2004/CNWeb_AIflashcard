import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, User, Calendar, CheckCircle, Circle, AlertCircle, RefreshCcw, ChevronLeft, Play } from 'lucide-react'

import { toast } from 'sonner'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { IDataQuiz, IQuiz } from '@/types/etc'
import etcService from '@/services/etcService'
import handleCompareDate from '@/lib/handleCompareDate'
import { renderContentWithLaTeX, renderHightlightedContent } from '../../ai-center/components/renderCode'
import { useAuth } from '@/contexts/AuthContext'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import quizService from '@/services/quizService'
import LoadingScreen from '@/components/etc/LoadingScreen'

export default function QuizExamPage() {
    const [quizData, setquizData] = useState<IQuiz | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [timeLimit, setTimeLimit] = useState(30) // Convert to seconds default 30 minutes
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60) // Convert to seconds default 30 minutes
    const [isQuizStarted, setIsQuizStarted] = useState(false)
    const [isQuizCompleted, setIsQuizCompleted] = useState(false)
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const { user } = useAuth()
    const navigate = useNavigate()
    // Timer effect
    useEffect(() => {
        const fetchquizData = async () => {
            try {
                setLoading(true)
                const res = await quizService.getQuizBySlug(location.pathname.split('/').pop() || '')
                setquizData(res.quiz)
            } catch (error) {
                ToastLogErrror(error)
            } finally {
                setLoading(false)
            }
        }
        fetchquizData()
    }, [location.pathname])

    useEffect(() => {
        if (isQuizStarted && !isQuizCompleted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsQuizCompleted(true)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [isQuizStarted, isQuizCompleted, timeLeft])
    if (loading) return LoadingScreen()
    if (quizData === null) {
        return <div className="">Không có bài quiz này...</div>
    }
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleAnswerSelect = (questionId: string, answerId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [Number(questionId)]: answerId,
        }))
    }

    const getQuestionStatus = (questionIndex: number) => {
        const questionId = Number(quizData.questions.data_quiz[questionIndex].id)
        if (answers[questionId]) return 'answered'
        if (questionIndex === currentQuestion) return 'current'
        return 'unanswered'
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'answered':
                return 'bg-green-500 dark:bg-green-600 hover:bg-green-600 text-white'
            case 'current':
                return 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 text-white'
            default:
                return 'bg-gray-200 dark:bg-gray-300 hover:bg-gray-300 text-gray-700'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'answered':
                return <CheckCircle className="w-4 h-4" />
            case 'current':
                return <AlertCircle className="w-4 h-4" />
            default:
                return <Circle className="w-4 h-4" />
        }
    }

    const calculateScore = () => {
        let correct = 0
        quizData.questions.data_quiz.forEach((question: IDataQuiz) => {
            if (answers[Number(question.id)] == question.correct) {
                correct++
            }
        })
        return correct
    }

    const handleSubmitQuiz = async () => {
        setIsQuizCompleted(true)
        setLoading(true)

        const historyData = {
            quiz_id: quizData._id,
            score: calculateScore(),
            total_questions: quizData.questions.data_quiz.length,
            time: timeLimit * 60 - timeLeft,
            userAnswers: answers,
        }
        try {
            const req = await etcService.createHistory(historyData)

            if (req.ok) {
                toast.success(req?.message)
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi nộp bài quiz', {
                description: error instanceof Error ? error.message : 'Lỗi không xác định',
                duration: 10000,
            })
        } finally {
            setLoading(false)
        }
    }

    const progress = ((currentQuestion + 1) / quizData?.questions?.data_quiz?.length) * 100

    if (!isQuizStarted) {
        return (
            <div className="px-3 md:px-0 min-h-screen flex items-center justify-center">
                <Card className="w-full md:max-w-3xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{quizData.title}</CardTitle>
                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-gray-600 dark:text-gray-300 mb-6">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{quizData.uid?.displayName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {quizData?.date && <span>{handleCompareDate(quizData?.date)}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{timeLimit} phút</span>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg mb-6 dark:bg-blue-800/50">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Thông tin bài quiz:</h3>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                <li>
                                    • Số câu hỏi: <span className="font-medium">{quizData.questions?.data_quiz.length}</span>
                                </li>
                                <li>
                                    • Thời gian làm bài: <span className="font-medium">{timeLimit}</span> phút (có thể chỉnh)
                                </li>
                                <li>• Loại: Trắc nghiệm nhiều lựa chọn</li>
                            </ul>
                        </div>
                    </CardHeader>
                    <CardContent className="text-center w-full flex items-center justify-center flex-col gap-3">
                        <p className="text-left text-sm">Lựa thời gian</p>
                        <Select defaultValue="30" onValueChange={(value) => setTimeLimit(Number(value))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn thời gian" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Chọn thời gian phù hợp</SelectLabel>
                                    <SelectItem value="5">5 phút</SelectItem>
                                    <SelectItem value="10">10 phút</SelectItem>
                                    <SelectItem value="15">15 phút</SelectItem>
                                    <SelectItem value="20">20 phút</SelectItem>
                                    <SelectItem value="30">30 phút</SelectItem>
                                    <SelectItem value="45">45 phút</SelectItem>
                                    <SelectItem value="60">60 phút</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-5">
                            <Button variant={'outline'} className="mb-5 h-12" onClick={() => navigate(-1)}>
                                <ChevronLeft /> Quay về
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsQuizStarted(true)
                                    setTimeLeft(timeLimit * 60)
                                }}
                                size="lg"
                                className="h-12 text-lg font-semibold text-white w-full"
                            >
                                <Play /> Bắt đầu làm bài
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isQuizCompleted) {
        const score = calculateScore()
        const percentage = Math.round((score / quizData.questions?.data_quiz?.length) * 100)

        return (
            <div className="my-8 w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
                <Card className="shadow-xl dark:border-white/10 dark:bg-slate-900/50">
                    <CardHeader className="text-center pb-8">
                        <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-600/50 dark:border-white/10">
                            <h3 className="text-3xl font-bold text-gray-800 mb-4 dark:text-white/80">Kết quả bài quiz</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    Câu đúng: <span className="font-semibold text-green-600 dark:text-green-400 text-xl">{score}</span>
                                </div>
                                <div>
                                    Câu sai: <span className="font-semibold text-red-600 dark:text-red-400 text-xl">{quizData.questions?.data_quiz?.length - score}</span>
                                </div>
                                <div>
                                    Thời gian còn lại: <span className="font-semibold text-xl">{formatTime(timeLeft)}</span>
                                </div>
                                <div>
                                    Tỷ lệ đúng: <span className="font-semibold text-blue-600 dark:text-blue-400 text-xl">{percentage}%</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="">
                        <div className=" flex flex-col md:flex-row md:items-center gap-3 md:gap-10 justify-center">
                            <Button
                                onClick={() => {
                                    setCurrentQuestion(0)
                                    setAnswers({})
                                    setTimeLeft(timeLimit * 60)
                                    setIsQuizStarted(false)
                                    setIsQuizCompleted(false)
                                }}
                                size="lg"
                                variant="outline"
                                className="h-12 text-lg font-semibold dark:text-white"
                            >
                                <RefreshCcw />
                                Làm lại
                            </Button>
                        </div>
                        <div className="">
                            <div className="space-y-6 mt-6">
                                {quizData.questions.data_quiz.map((question: IDataQuiz, questionIndex: number) => (
                                    <Card key={question.id} className="border border-transparent dark:border-white/10 shadow-md p-2">
                                        <CardHeader className="p-2">
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg">
                                                    Câu {questionIndex + 1}: {renderHightlightedContent(question.question)}
                                                </CardTitle>
                                                <Badge
                                                    variant={answers[Number(question.id)] != null ? (answers[Number(question.id)] == question.correct ? 'default' : 'destructive') : 'outline'}
                                                    className="text-white ml-4"
                                                >
                                                    {answers[Number(question.id)] != null ? (answers[Number(question.id)] == question.correct ? 'Đúng' : 'Sai') : 'Chưa trả lời'}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4 p-2" id={`question-${questionIndex + 1}`}>
                                            <div className="grid grid-cols-1 gap-3">
                                                {question.answers.map((option: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className={`p-3 rounded-lg border-2 transition-colors flex items-center ${
                                                            index === Number(question.correct)
                                                                ? 'border-green-500 bg-green-50 text-green-800 dark:bg-green-800/50 dark:text-green-200 dark:border-green-700'
                                                                : index === Number(answers[Number(question.id)]) && index !== Number(question.correct)
                                                                ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-800/50 dark:text-red-200 dark:border-red-700'
                                                                : 'border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-800/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-semibold ml-2 mr-3">{String.fromCharCode(65 + Number(index))}</span>
                                                            <span>{renderContentWithLaTeX(option)}</span>
                                                            {Number(answers[Number(question.id)]) === index && index === Number(question.correct) && (
                                                                <CheckCircle className="h-4 w-4 text-green-600 ml-auto dark:text-green-200" />
                                                            )}
                                                            {Number(answers[Number(question.id)]) === index && index !== Number(question.correct) && (
                                                                <AlertCircle className="h-4 w-4 text-red-600 ml-auto dark:text-red-200" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Question Navigation Sidebar */}
                <div className="lg:col-span-1 ">
                    <Card className="shadow-lg sticky top-4 dark:bg-slate-800/50 dark:border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold pt-5">Danh sách câu hỏi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-12 lg:grid-cols-4 grid-cols-6  gap-2 max-h-[250px] w-[200px] overflow-scroll">
                                {quizData?.questions &&
                                    quizData?.questions.data_quiz.map((question: IDataQuiz, index) => {
                                        const isAnswered = answers[Number(question.id)] != null
                                        const isCorrect = isAnswered && answers[Number(question.id)] == question.correct
                                        const isIncorrect = isAnswered && answers[Number(question.id)] != question.correct

                                        let buttonClass = 'h-10 w-10 p-0 '
                                        if (isCorrect) {
                                            buttonClass += 'bg-green-500 dark:bg-green-600 hover:bg-green-600 text-white'
                                        } else if (isIncorrect) {
                                            buttonClass += 'bg-red-500 dark:bg-red-600 hover:bg-red-600 text-white'
                                        } else {
                                            buttonClass += 'bg-gray-200 dark:bg-gray-300 hover:bg-gray-300 text-gray-700'
                                        }

                                        return (
                                            <Link to={`#question-${index}`} key={index}>
                                                <Button variant="outline" size="sm" className={buttonClass}>
                                                    {index + 1}
                                                </Button>
                                            </Link>
                                        )
                                    })}
                            </div>

                            <div className="mt-6 space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></div>
                                    <span>Câu đúng</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded"></div>
                                    <span>Câu sai</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-300 rounded"></div>
                                    <span>Chưa trả lời</span>
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    setCurrentQuestion(0)
                                    setAnswers({})
                                    setTimeLeft(timeLimit * 60)
                                    setIsQuizStarted(false)
                                    setIsQuizCompleted(false)
                                }}
                                size="lg"
                                variant="outline"
                                className="font-semibold dark:text-white text-center mt-4 w-full"
                            >
                                <RefreshCcw />
                                Làm lại
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const currentQ = quizData.questions.data_quiz[currentQuestion]
    return (
        <div className="my-5 w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
            {/* Header */}
            <Button variant={'outline'} className="mb-5" onClick={() => navigate(-1)}>
                <ChevronLeft /> Quay về
            </Button>
            <div className="bg-white dark:bg-slate-800/50 shadow-sm border rounded-xl dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{quizData.title}</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tác giả: {quizData.uid?.displayName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className={`px-3 py-1 ${timeLeft <= 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(timeLeft)}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1">
                                {currentQuestion + 1}/{quizData.questions?.data_quiz?.length}
                            </Badge>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            <div className=" py-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Main Question Area */}
                    <div className="lg:col-span-3">
                        <Card className="shadow-lg dark:bg-slate-800/50 dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                                    Câu {currentQuestion + 1}: {renderHightlightedContent(currentQ?.question)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {currentQ?.answers.map((option: any, index: number) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAnswerSelect(currentQ.id, index.toString())}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                answers[Number(currentQ.id)] === index.toString()
                                                    ? 'border-blue-500 bg-blue-50 dark:border-blue-300 dark:bg-blue-800'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                                        answers[Number(currentQ.id)] === index.toString()
                                                            ? 'bg-blue-500 dark:bg-blue-200 dark:text-blue-800 text-white'
                                                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-800 leading-relaxed dark:text-gray-300">{renderContentWithLaTeX(option)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between mt-8">
                                    <Button variant="outline" onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>
                                        Câu trước
                                    </Button>

                                    {currentQuestion === quizData.questions.data_quiz.length - 1 ? (
                                        <Button onClick={() => handleSubmitQuiz()} className="bg-green-600 hover:bg-green-700 dark:text-white">
                                            Hoàn thành
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setCurrentQuestion(Math.min(quizData.questions.data_quiz.length - 1, currentQuestion + 1))}
                                            className="dark:text-white"
                                            disabled={currentQuestion === quizData.questions.data_quiz.length - 1}
                                        >
                                            Câu tiếp theo
                                        </Button>
                                    )}
                                </div>
                                {!user && <p className="mt-3 text-xs text-red-700 dark:text-red-200">*Lưu ý: bạn chưa đăng nhập nên không thể lưu bài làm trên server của chúng tôi</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Question Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-lg sticky top-4 dark:bg-slate-800/50 dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Danh sách câu hỏi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-12 lg:grid-cols-4 xl:grid-cols-5 grid-cols-6  gap-2 max-h-[250px] overflow-scroll">
                                    {quizData?.questions &&
                                        quizData?.questions.data_quiz.map((_, index) => {
                                            const status = getQuestionStatus(index)
                                            return (
                                                <Button key={index} variant="outline" size="sm" onClick={() => setCurrentQuestion(index)} className={`h-10 w-10 p-0 ${getStatusColor(status)}`}>
                                                    <span className="sr-only">{getStatusIcon(status)}</span>
                                                    {index + 1}
                                                </Button>
                                            )
                                        })}
                                </div>

                                <div className="mt-6 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></div>
                                        <span>Đã trả lời</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded"></div>
                                        <span>Câu hiện tại</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-300 rounded"></div>
                                        <span>Chưa trả lời</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        <div>
                                            Đã trả lời: <span className="font-semibold">{Object.keys(answers).length}</span>
                                        </div>
                                        <div>
                                            Còn lại: <span className="font-semibold">{quizData.questions?.data_quiz?.length - Object.keys(answers).length}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
