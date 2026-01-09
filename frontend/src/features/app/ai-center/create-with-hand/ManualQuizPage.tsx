import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Plus, Trash2, Save, Eye, ArrowLeft, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import quizService from '@/services/quizService'
import Loading from '@/components/ui/loading'

interface Question {
    id: number
    question: string
    answers: string[]
    correct: number
}

interface QuizData {
    title: string
    content: string
    subject: string
    img: string
}

export default function ManualQuizPage() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [quizData, setQuizData] = useState<QuizData>({
        title: '',
        content: '',
        subject: '',
        img: ''
    })
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, question: '', answers: ['', '', '', ''], correct: -1 }
    ])

    const handleQuizDataChange = (field: keyof QuizData, value: string) => {
        setQuizData(prev => ({ ...prev, [field]: value }))
    }

    const addQuestion = () => {
        const newId = Math.max(...questions.map(q => q.id), 0) + 1
        setQuestions(prev => [...prev, { id: newId, question: '', answers: ['', '', '', ''], correct: -1 }])
    }

    const removeQuestion = (id: number) => {
        if (questions.length <= 1) {
            toast.error('Quiz phải có ít nhất 1 câu hỏi')
            return
        }
        setQuestions(prev => prev.filter(q => q.id !== id))
    }

    const updateQuestion = (id: number, field: 'question' | 'correct', value: string | number) => {
        setQuestions(prev => prev.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ))
    }

    const updateAnswer = (questionId: number, answerIndex: number, value: string) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === questionId) {
                const newAnswers = [...q.answers]
                newAnswers[answerIndex] = value
                return { ...q, answers: newAnswers }
            }
            return q
        }))
    }

    const validateQuiz = (): boolean => {
        if (!quizData.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề quiz')
            return false
        }
        if (!quizData.content.trim()) {
            toast.error('Vui lòng nhập mô tả quiz')
            return false
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i]
            if (!q.question.trim()) {
                toast.error(`Câu hỏi ${i + 1} đang bị trống`)
                return false
            }
            if (q.answers.some(a => !a.trim())) {
                toast.error(`Câu ${i + 1}: Vui lòng điền đầy đủ 4 đáp án`)
                return false
            }
            if (q.correct === -1) {
                toast.error(`Câu ${i + 1}: Vui lòng chọn đáp án đúng`)
                return false
            }
        }
        return true
    }

    const handleSubmit = async () => {
        if (!validateQuiz()) return

        try {
            setIsSubmitting(true)
            const payload = {
                title: quizData.title,
                content: quizData.content,
                subject: quizData.subject || 'general',
                img: quizData.img || undefined,
                questions: questions.map((q, index) => ({
                    id: index + 1,
                    question: q.question,
                    answers: q.answers,
                    correct: String(q.correct)
                }))
            }

            const response = await quizService.createQuiz(payload)

            if (response.ok) {
                toast.success('Tạo quiz thành công!', {
                    description: 'Quiz của bạn đã được lưu',
                    action: {
                        label: 'Xem quiz',
                        onClick: () => navigate(`/quiz/detail/${response.quiz.slug}`)
                    }
                })
                navigate('/quiz')
            } else {
                toast.error(response.message || 'Có lỗi xảy ra')
            }
        } catch (error: any) {
            console.error('Error creating quiz:', error)
            toast.error('Không thể tạo quiz', {
                description: error?.response?.data?.message || error.message
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveDraft = () => {
        const draft = {
            ...quizData,
            questions,
            createdAt: new Date().toISOString(),
            status: 'draft'
        }

        const existingDrafts = JSON.parse(localStorage.getItem('draftQuiz') || '[]')
        localStorage.setItem('draftQuiz', JSON.stringify([...existingDrafts, draft]))

        toast.success('Đã lưu vào nháp', {
            action: {
                label: 'Xem nháp',
                onClick: () => navigate('/ai-center/drafts')
            }
        })
    }

    return (
        <div className="px-6 mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <SidebarTrigger />
                    <h1 className="text-3xl font-bold">Tạo Quiz Thủ Công</h1>
                </div>
                <p className="text-muted-foreground">Tạo quiz với các câu hỏi do bạn tự nhập</p>
            </div>

            {/* Back Button */}
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Quay lại
            </Button>

            {/* Quiz Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thông tin Quiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tiêu đề Quiz <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                placeholder="VD: Kiểm tra kiến thức JavaScript"
                                value={quizData.title}
                                onChange={(e) => handleQuizDataChange('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Môn học / Chủ đề</Label>
                            <Input
                                id="subject"
                                placeholder="VD: Lập trình, Toán học..."
                                value={quizData.subject}
                                onChange={(e) => handleQuizDataChange('subject', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Mô tả Quiz <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="content"
                            placeholder="Mô tả ngắn gọn về nội dung quiz..."
                            value={quizData.content}
                            onChange={(e) => handleQuizDataChange('content', e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="img">Link ảnh bìa (không bắt buộc)</Label>
                        <Input
                            id="img"
                            placeholder="https://example.com/image.jpg"
                            value={quizData.img}
                            onChange={(e) => handleQuizDataChange('img', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Questions Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Danh sách câu hỏi ({questions.length})</h2>
                    <Button onClick={addQuestion} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Thêm câu hỏi
                    </Button>
                </div>

                {questions.map((question, qIndex) => (
                    <Card key={question.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="w-5 h-5 text-gray-400" />
                                    <CardTitle className="text-base">Câu hỏi {qIndex + 1}</CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeQuestion(question.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nội dung câu hỏi <span className="text-red-500">*</span></Label>
                                <Textarea
                                    placeholder="Nhập câu hỏi..."
                                    value={question.question}
                                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Các đáp án (chọn đáp án đúng) <span className="text-red-500">*</span></Label>
                                <RadioGroup
                                    value={question.correct === -1 ? undefined : String(question.correct)}
                                    onValueChange={(value) => updateQuestion(question.id, 'correct', parseInt(value))}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {question.answers.map((answer, aIndex) => (
                                            <div key={aIndex} className="flex items-center gap-2">
                                                <RadioGroupItem value={String(aIndex)} id={`q${question.id}-a${aIndex}`} />
                                                <Label
                                                    htmlFor={`q${question.id}-a${aIndex}`}
                                                    className="font-semibold text-blue-600 min-w-5"
                                                >
                                                    {String.fromCharCode(65 + aIndex)}.
                                                </Label>
                                                <Input
                                                    placeholder={`Đáp án ${String.fromCharCode(65 + aIndex)}`}
                                                    value={answer}
                                                    onChange={(e) => updateAnswer(question.id, aIndex, e.target.value)}
                                                    className={question.correct === aIndex ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                                {question.correct !== -1 && (
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        ✓ Đáp án đúng: {String.fromCharCode(65 + question.correct)}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Add More Button */}
                <Button variant="outline" onClick={addQuestion} className="w-full gap-2 border-dashed">
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi mới
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 justify-center sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                    <Save className="w-4 h-4" />
                    Lưu nháp
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                >
                    {isSubmitting ? <Loading /> : <Eye className="w-4 h-4" />}
                    {isSubmitting ? 'Đang tạo...' : 'Tạo và xuất bản'}
                </Button>
            </div>
        </div>
    )
}
