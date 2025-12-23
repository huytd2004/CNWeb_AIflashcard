import React, { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Save, Sparkle } from 'lucide-react'
import { toast } from 'sonner'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { optimizedPromptGenerateTitle } from '@/lib/optimizedPrompt'
import { useNavigate } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Loading from '@/components/ui/loading'
import quizService from '@/services/quizService'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
interface QuizQuestion {
    title: string
    subject: string
    content: string
    questions: Quiz[]
}

interface Quiz {
    id: string
    type: 'multiple-choice' | 'true-false' | 'short-answer'
    question: string
    answers?: string[]
    correct: string
    points: number
}

interface Props {
    children: React.ReactNode
    openAddMoreInfo: boolean
    setOpenAddMoreInfo: (open: boolean) => void
    generatedQuiz?: QuizQuestion
    isEdit?: boolean
    params?: any
    setShowPreview?: any
    reloadData?: () => void
}

export default function DialogAddMoreInfoQuiz({ children, isEdit, params, setShowPreview, generatedQuiz, openAddMoreInfo, setOpenAddMoreInfo, reloadData }: Props) {
    const defaultGeneratedQuiz = {
        title: '',
        subject: '',
        content: '',
    }
    const [tempQuiz, setTempQuiz] = useState(defaultGeneratedQuiz)

    const [loading, setLoading] = useState(false)
    const [loadingTitle, setLoadingTitle] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Nếu generatedQuiz có giá trị, cập nhật tempQuiz
        if (generatedQuiz) {
            setTempQuiz({
                title: generatedQuiz.title || '',
                subject: generatedQuiz.subject || '',
                content: generatedQuiz.content || '',
            })
        } else {
            // Nếu không có generatedQuiz, đặt tempQuiz về giá trị mặc định
            setTempQuiz(defaultGeneratedQuiz)
        }
    }, [generatedQuiz])
    const handleSetValueTempQuiz = (field: keyof typeof tempQuiz, value: string) => {
        setTempQuiz((prev) => ({
            ...prev,
            [field]: value,
        }))
    }
    const handleSubmit = async (e: any) => {
        try {
            setLoading(true)
            e.preventDefault()
            // nếu nó không bắt đầu là http hoặc https thì upload hình lên cloudinary
            const newQuiz = {
                title: tempQuiz.title,
                subject: tempQuiz.subject,
                content: tempQuiz.content,
                questions: generatedQuiz?.questions,
            }
            if (isEdit) {
                const req = await quizService.updateContentQuiz(params?.slug, newQuiz)
                if (req.ok) {
                    toast.success('Đã cập nhật bài quiz', {
                        position: 'top-center',
                        id: 'upload-image',
                        duration: 3000,
                    })
                    setOpenAddMoreInfo(false)
                    setShowPreview(false)
                    if (reloadData) await reloadData()
                }
            } else {
                const req = await quizService.createQuiz(newQuiz)
                if (req.ok) {
                    toast.success('Đã lưu và xuất bản bài quiz', {
                        position: 'top-center',
                        id: 'upload-image',
                        duration: 3000,
                    })
                    setOpenAddMoreInfo(false)
                    navigate(`/quiz/detail/${req?.quiz?.slug}`)
                }
            }
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }

    const genAI = useMemo(() => new GoogleGenerativeAI(import.meta.env.VITE_API_KEY_AI || ''), [])
    const handleGenerateTitle = async () => {
        if (loadingTitle) return // Prevent multiple clicks
        setLoadingTitle(true)
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
            const shuffledQuestions = generatedQuiz?.questions ? [...generatedQuiz.questions].sort(() => Math.random() - 0.5) : []
            const sliceQuiz = shuffledQuestions.slice(0, 10)
            const prompt = optimizedPromptGenerateTitle(sliceQuiz)
            const result = await model.generateContent(prompt)

            const responseText = result?.response
                .text()
                // ✅ Chỉ xóa wrapper markdown, giữ lại code blocks bên trong content
                .replace(/^```json\s*/, '') // Xóa ```json ở đầu
                .replace(/^```html\s*/, '') // Xóa ```html ở đầu
                .replace(/```\s*$/, '') // Xóa ``` ở cuối
            const jsonOutput = JSON.parse(responseText || '')
            setTempQuiz({
                title: jsonOutput.title,
                subject: jsonOutput.subject,
                content: jsonOutput.content,
            })
        } catch (error: any) {
            toast.error('Đã có lỗi xảy ra khi tạo tiêu đề', { description: error, duration: 5000, position: 'top-center' })
        } finally {
            setLoadingTitle(false)
        }
    }
    return (
        <Dialog open={openAddMoreInfo} onOpenChange={setOpenAddMoreInfo}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="p-3 md:p-6">
                <div>
                    <DialogHeader>
                        <DialogTitle>Nhập thêm thông tin bài quiz </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 my-5 max-h-[550px] overflow-y-scroll">
                        <div className="">
                            <Label htmlFor="name-1">Tên bài quiz</Label>
                            <div className="flex items-center justify-between gap-2 md:gap-5 mt-2">
                                <Input id="name-1" name="name" placeholder="Nhập tên bài quiz" value={tempQuiz.title} onChange={(e) => handleSetValueTempQuiz('title', e.target.value)} required />
                                <Button
                                    className="bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 "
                                    disabled={loadingTitle}
                                    onClick={handleGenerateTitle}
                                >
                                    {loadingTitle ? <Loading /> : <Sparkle className="md:mr-2 h-4 w-4" />}

                                    <span className="hidden md:inline">Tạo tiêu đề</span>
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Nội dung</Label>
                            <Textarea
                                className="h-24"
                                id="username-1"
                                name="username"
                                placeholder="Nhập nội dung"
                                value={tempQuiz.content}
                                onChange={(e) => handleSetValueTempQuiz('content', e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="subject">Môn học</Label>
                            <Input id="subject" name="subject" placeholder="Nhập môn học" value={tempQuiz.subject} onChange={(e) => handleSetValueTempQuiz('subject', e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2 flex-row">
                        <DialogClose asChild className="flex-1">
                            <Button variant="outline" type="button" size="lg">
                                Đóng
                            </Button>
                        </DialogClose>
                        <Button size="lg" className="flex-1 text-white bg-linear-to-r from-blue-500 to-cyan-500" onClick={handleSubmit} disabled={loading}>
                            {loading ? <Loading className="text-white" /> : <Save className="mr-2 h-4 w-4" />}
                            {isEdit ? 'Cập nhật' : 'Lưu và xuất bản'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
