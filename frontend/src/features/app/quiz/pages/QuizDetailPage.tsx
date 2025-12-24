import { useAuth } from '@/contexts/AuthContext'
import quizService from '@/services/quizService'
import type { IGeneratedQuiz } from '@/types/create-ai'
import type { IComment, IDataQuiz, IQuiz } from '@/types/etc'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Share2, Flag, Star, Send, ThumbsUp, MessageCircle, Users, Clock, BookOpen, Eye, Play, Trophy, ArrowBigLeft, Pencil, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import { toast } from 'sonner'
import handleCompareDate from '@/lib/handleCompareDate'
import Loading from '@/components/ui/loading'
import { renderContentWithLaTeX, renderHightlightedContent } from '../../ai-center/components/renderCode'
import DialogAddMoreInfoQuiz from '../../ai-center/components/DialogAddMoreInfoQuiz'
import type { IUser } from '@/types/user'
import etcService from '@/services/etcService'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import { AIResuiltPreviewDeCuong } from '../../subject-outline/components/AIResuiltPreviewDeCuong'
export default function QuizDetailPage() {
    const [data, setData] = useState<IQuiz>()
    const [loadingReload, setLoadingReload] = useState(false)
    const [quiz, setQuiz] = useState<IDataQuiz[]>()
    const [comment, setComment] = useState<IComment[]>([])
    const { user } = useAuth()
    const [userRating, setUserRating] = useState(5)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const [loadingReport, setLoadingReport] = useState(false)
    const [review, setReview] = useState('')
    const defaultReport = { type_of_violation: 'spam', content: '' }
    const [report, setReport] = useState(defaultReport)
    const [quizSlice, setQuizSlice] = useState<IDataQuiz[]>()
    const navigate = useNavigate()
    const [generatedQuiz, setGeneratedQuiz] = useState<IGeneratedQuiz | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [openAddMoreInfo, setOpenAddMoreInfo] = useState(false)

    // Hàm reload dữ liệu
    const reloadData = async () => {
        setLoadingReload(true)
        try {
            const res = await quizService.getQuizBySlug(location.pathname.split('/').pop() || '')
            if (res.ok) {
                setComment(res?.quiz?.comment)
                setQuiz(res?.quiz?.questions?.data_quiz)
                delete res?.quiz?.questions
                setData(res.quiz)
                toast.success('Đã cập nhật dữ liệu bài quiz', {
                    duration: 5000,
                    position: 'top-center',
                })
            }
        } catch (error) {
            console.error('Error reloading data:', error)
        } finally {
            setLoadingReload(false)
        }
    }
    useEffect(() => {
        reloadData()
    }, [location.pathname])

    useEffect(() => {
        if (quiz && quiz.length > 5) {
            setQuizSlice(quiz.slice(0, 5))
        } else {
            setQuizSlice(quiz)
        }
    }, [quiz])
    const handleSubmitComment = async () => {
        const newComment: IComment = {
            _id: Math.random().toString(36).substr(2, 9), // Generate a temporary ID
            quiz_id: data?._id,
            review,
            helpful: 0,
            rating: userRating,
            created_at: new Date(),
            user_id: user as IUser,
        }
        try {
            const res = await etcService.createCommentQuiz(newComment)

            if (res.ok) {
                if (res?.exist) {
                    setComment((item) => item.map((i) => (i._id == res?.id ? { ...i, review, created_at: new Date() } : i)))
                } else {
                    setComment([...comment, newComment])
                }
                toast.success('Bình luận đã được gửi thành công!')
                setReview('')
            }
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setUserRating(5)
            setLoading(false)
        }
    }

    const handleReport = async () => {
        try {
            setLoadingReport(true)
            const newReport = {
                type_of_violation: report.type_of_violation,
                content: report.content,
                link: `/quiz/detail/${data?.slug}`,
            }
            const res = await etcService.createReportQuiz(newReport)
            if (res.ok) {
                toast.success('Gửi báo cáo thành công')
                setIsReportModalOpen(false)
                setReport(defaultReport)
            }
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            setLoadingReport(false)
        }
    }

    const handleSeeAllQuestion = () => {
        setQuizSlice(quiz || [])
    }

    const handleOpenEditModal = () => {
        setGeneratedQuiz({
            title: data?.title || '',
            subject: data?.subject || '',
            content: data?.content || '',
            questions:
                quiz?.map((q) => ({
                    id: q.id,
                    type: 'multiple-choice',
                    question: q.question,
                    answers: q.answers,
                    correct: q.correct,
                    points: 1,
                })) || [],
        } as IGeneratedQuiz)
        setShowPreview(true)
    }

    const totalStar = comment.reduce((acc, curr) => acc + curr.rating, 0)
    const avgRating = comment.length > 0 ? (totalStar / comment.length).toFixed(1) : 0
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-40 dark:bg-slate-800 dark:border-b-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="secondary" size="sm" disabled={loadingReload} onClick={reloadData}>
                                <RotateCcw className={`h-4 w-4 mr-2 ${loadingReload && 'animate-spin'}`} />
                                Cập nhật dữ liệu
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" />
                                Chia sẻ
                            </Button>
                            <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-600 dark:text-red-400 dark:border-red-400">
                                        <Flag className="h-4 w-4 mr-2" />
                                        Báo cáo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Báo cáo vi phạm</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <p className="text-sm  dark:text-gray-400">Vui lòng chọn lý do báo cáo bài quiz này:</p>
                                        <RadioGroup value={report.type_of_violation} onValueChange={(value) => setReport({ ...report, type_of_violation: value })} className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="spam" id="spam" />
                                                <Label htmlFor="spam">Spam hoặc nội dung rác</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="inappropriate" id="inappropriate" />
                                                <Label htmlFor="inappropriate">Nội dung không phù hợp</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="copyright" id="copyright" />
                                                <Label htmlFor="copyright">Vi phạm bản quyền</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="misinformation" id="misinformation" />
                                                <Label htmlFor="misinformation">Thông tin sai lệch</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="other" id="other" />
                                                <Label htmlFor="other">Khác</Label>
                                            </div>
                                        </RadioGroup>
                                        <div className="">
                                            <Textarea
                                                placeholder="Nhập nội dung báo cáo của bạn ở đây..."
                                                className="h-32 dark:border-white/10"
                                                value={report.content}
                                                onChange={(e) => setReport({ ...report, content: e.target.value })}
                                            ></Textarea>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
                                                Hủy
                                            </Button>
                                            <Button onClick={handleReport} disabled={!report || loadingReport} className=" text-red-800 dark:text-red-200 bg-red-200 dark:bg-red-800">
                                                {loadingReport ? <Loading /> : <Send />}
                                                Gửi báo cáo
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!data || !quiz ? (
                    <div className="flex items-center justify-center h-[80vh] flex-col gap-3">
                        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy quiz.</p>
                        <Button onClick={() => navigate(-1)} className="text-white">
                            <ArrowBigLeft /> Quay về
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-8">
                            {/* Hero Section */}
                            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white dark:border-white/10 dark:from-blue-800/50 dark:via-purple-800/50 dark:to-indigo-800/50">
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">{data?.subject}</Badge>
                                            </div>
                                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{data?.title}</h1>
                                            <p className="text-xl text-white/90 mb-6">{data?.content}</p>
                                            <div className="flex flex-wrap items-center gap-6 text-white/80 mb-6">
                                                <div className="flex items-center">
                                                    <Users className="h-5 w-5 mr-2" />
                                                    <span>{data?.noa} người học</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Eye className="h-5 w-5 mr-2" />
                                                    <span>{data?.view} lượt xem</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-5 w-5 mr-2" />
                                                    <span>~{quiz && Math.floor(quiz?.length * 1.5)} phút</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 mb-6">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className={`h-5 w-5 ${star <= Number(avgRating) ? 'text-yellow-400 fill-current' : 'text-white/30'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-white/90">
                                                    {avgRating} ({data?.comment?.length} đánh giá)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                onClick={() => navigate(`/quiz/${data?.slug}`)}
                                                size="lg"
                                                className="bg-linear-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 dark:border-white/10"
                                            >
                                                <Play className="h-5 w-5 mr-2" />
                                                Bắt đầu làm quiz
                                            </Button>
                                            {user && user._id === data?.uid._id && (
                                                <Button className="text-gray-600 dark:text-gray-400" variant="outline" size="lg" onClick={handleOpenEditModal}>
                                                    <Pencil /> Chỉnh sửa
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                            </div>
                            {generatedQuiz && (
                                <AIResuiltPreviewDeCuong
                                    open={showPreview}
                                    isEdit={true}
                                    onOpenChange={setShowPreview}
                                    quiz={generatedQuiz}
                                    setOpenAddMoreInfo={setOpenAddMoreInfo}
                                    setGeneratedQuiz={setGeneratedQuiz}
                                />
                            )}
                            {generatedQuiz && (
                                <DialogAddMoreInfoQuiz
                                    isEdit={true}
                                    params={{}}
                                    setShowPreview={setShowPreview}
                                    generatedQuiz={generatedQuiz}
                                    openAddMoreInfo={openAddMoreInfo}
                                    setOpenAddMoreInfo={setOpenAddMoreInfo}
                                    reloadData={reloadData}
                                >
                                    <></>
                                </DialogAddMoreInfoQuiz>
                            )}

                            {/* Quiz Preview */}
                            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/50 dark:border-white/10 backdrop-blur-sm ">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl font-bold dark:text-white/80 text-gray-800 flex items-center">
                                            <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                                            Xem trước câu hỏi
                                        </CardTitle>
                                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200">
                                            5/{quiz?.length} câu hỏi
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">Khám phá một số câu hỏi mẫu trong bài quiz này</p>
                                </CardHeader>
                                <CardContent className="space-y-8 p-1 pr-3 md:p-6 max-h-[700px] overflow-y-scroll">
                                    {quizSlice &&
                                        quizSlice?.map((question: any, index: number) => (
                                            <div key={question.id} className="relative">
                                                <div className="flex items-start space-x-4">
                                                    <div className="hidden md:flex flex-shrink-0 w-8 h-8 bg-blue-50  dark:bg-blue-800/50  text-blue-800 dark:text-blue-200 rounded-full  items-center justify-center font-semibold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className=" dark:text-white/80 text-gray-800 mb-4 text-lg leading-relaxed">{renderHightlightedContent(question.question)}</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {question?.answers?.map((option: any, index: number) => (
                                                                <div
                                                                    key={index}
                                                                    className={`flex items-center space-x-3 p-4 border dark:border-white/10 rounded-md transition-all duration-200 cursor-pointer hover:shadow-md text-gray-600 dark:text-gray-300`}
                                                                >
                                                                    <span className={`font-bold text-sm min-w-[24px] h-6 flex items-center justify-center`}>{String.fromCharCode(65 + index)}</span>
                                                                    <span className="">{renderContentWithLaTeX(option)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    <div className="text-center py-4">
                                        <Button
                                            disabled={quizSlice?.length === quiz.length}
                                            onClick={handleSeeAllQuestion}
                                            size="lg"
                                            variant="secondary"
                                            className=" text-white font-semibold px-8 dark:border-white/10"
                                        >
                                            <Play className="h-5 w-5 mr-2" />
                                            Xem hết {quiz?.length} câu hỏi
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comments Section */}
                            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/50 dark:border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex  items-center text-2xl font-bold dark:text-white/80 text-gray-800">
                                        <MessageCircle className="h-6 w-6 mr-3 text-blue-600" />
                                        Đánh giá & Bình luận
                                        <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-200">
                                            {comment?.length} bình luận
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Add Comment */}
                                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 dark:from-blue-900/50 dark:to-indigo-900/80  dark:border-white/10">
                                        <h3 className="font-semibold dark:text-white/80 text-gray-800 mb-4">Chia sẻ trải nghiệm của bạn</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Đánh giá của bạn</Label>
                                                <div className="flex space-x-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                                                            <Star
                                                                className={`h-8 w-8 transition-colors ${star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="comment" className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">
                                                    Bình luận của bạn
                                                </Label>
                                                <Textarea
                                                    id="comment"
                                                    placeholder="Hãy chia sẻ cảm nhận của bạn về bài quiz này..."
                                                    value={review}
                                                    onChange={(e) => setReview(e.target.value)}
                                                    className="min-h-[120px]"
                                                />
                                            </div>
                                            <Button onClick={handleSubmitComment} disabled={!review.trim() || userRating === 0 || loading} size="lg" className="dark:text-white font-semibold">
                                                {loading ? <Loading /> : <Send className="h-4 w-4 mr-2" />}
                                                Gửi đánh giá
                                            </Button>
                                        </div>
                                    </div>

                                    <Separator className="my-8" />

                                    {/* Existing Comments */}
                                    <div className="space-y-6">
                                        {comment &&
                                            comment.map((comment) => (
                                                <div
                                                    key={comment._id}
                                                    className="bg-white dark:bg-slate-700/50 dark:border-white/10 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex space-x-4">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={comment.user_id.profilePicture || '/placeholder.svg'} className="object-cover" />
                                                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200 font-semibold">
                                                                {comment?.user_id?.displayName
                                                                    ? comment?.user_id?.displayName
                                                                          ?.split('')
                                                                          .map((n) => n[0])
                                                                          .join('')
                                                                    : 'N/A'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center space-x-3">
                                                                    <span className="font-semibold dark:text-white/80 text-gray-800">{comment.user_id.displayName}</span>
                                                                    <div className="flex">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Star key={star} className={`h-4 w-4 ${star <= comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">{comment.created_at && handleCompareDate(comment.created_at)}</span>
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{comment.review}</p>
                                                            <div className="flex items-center space-x-4">
                                                                <Button variant="ghost" size="sm" className={`text-gray-500 hover:text-blue-600 ${comment.helpful ? 'text-blue-600' : ''}`}>
                                                                    <ThumbsUp className={`h-4 w-4 mr-2 ${comment.helpful ? 'fill-current' : ''}`} />
                                                                    {comment.helpful > 0 ? comment.helpful : 'Hữu ích'}
                                                                </Button>
                                                                {/* <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                                                            Trả lời
                                                        </Button> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Author Info */}
                            <div className="relative h-[335px] w-full mb-4 rounded-lg overflow-hidden">
                                <img className="absolute " src={data?.img} alt=""></img>
                            </div>
                            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/50 dark:border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold dark:text-white/80 text-gray-800">Tác giả</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-4" onClick={() => navigate(`/profile/${data?.uid._id}`)}>
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={data?.uid?.profilePicture} className="object-cover" />
                                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-200 font-semibold">
                                                {data?.uid.displayName
                                                    ? data?.uid.displayName
                                                          .split(' ')
                                                          .map((n) => n[0])
                                                          .join('')
                                                    : 'N/A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold dark:text-white/80 text-gray-800">{data?.uid?.displayName}</div>
                                            <div className="text-xs text-gray-400">Tham gia {data?.uid && handleCompareDate(data?.uid?.created_at)}</div>
                                        </div>
                                    </div>
                                    {/* <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-blue-50 dark:bg-blue-800/50 p-3 rounded-lg">
                                        <div className="font-bold text-blue-600 dark:text-blue-200">25</div>
                                        <div className="text-xs ">Quiz</div>
                                    </div>
                                    <div className="bg-green-50  dark:bg-green-800/50 p-3 rounded-lg">
                                        <div className="font-bold text-green-600 dark:text-green-200">1.2k</div>
                                        <div className="text-xs ">Người theo dõi</div>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-4 hover:bg-blue-50 hidden hover:border-blue-200">
                                    Theo dõi
                                </Button> */}
                                </CardContent>
                            </Card>

                            {/* Quiz Stats */}
                            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/50 dark:border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold dark:text-white/80 text-gray-800 flex items-center">
                                        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                                        Thống kê
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Số câu hỏi:</span>
                                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:text-blue-200">{quiz?.length} câu</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Lượt xem:</span>
                                            <span className="font-semibold dark:text-white/80 text-gray-800">{data?.view}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Lượt làm:</span>
                                            <span className="font-semibold dark:text-white/80 text-gray-800">{data?.noa}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành:</span>
                                            <span className="font-semibold text-green-600">87%</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Độ khó:</span>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-200">
                                                    {data?.difficulty || 'Dễ'}
                                                </Badge>
                                            </div>
                                            {/* <Progress value={25} className="h-2" /> */}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Related Quizzes */}
                            {/* <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm dark:bg-slate-800/50 dark:border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold dark:text-white/80 text-gray-800">Quiz liên quan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { title: "JavaScript cơ bản", questions: 15, color: "from-yellow-400 to-orange-500", icon: "JS" },
                                    { title: "React Hooks", questions: 12, color: "from-blue-400 to-cyan-500", icon: "R" },
                                    { title: "Node.js Backend", questions: 18, color: "from-green-400 to-emerald-500", icon: "N" },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex space-x-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all hover:shadow-md group dark:border-white/10">
                                        <div className={`w-12 h-12 bg-linear-to-br ${item.color} rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold dark:text-white/80 text-gray-800 group-hover:text-blue-600 transition-colors">{item.title}</div>
                                            <div className="text-sm text-gray-500">{item.questions} câu hỏi</div>
                                            <div className="flex items-center mt-1">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500 ml-1">4.9</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-200">
                                    Xem thêm quiz
                                </Button>
                            </CardContent>
                        </Card> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
