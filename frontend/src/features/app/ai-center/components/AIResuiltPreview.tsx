import { useState, useEffect, useMemo, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Edit, Trash2, Plus, CheckCircle, Bot, Save, AlertCircle } from 'lucide-react'
// import { GoogleGenerativeAI } from '@google/generative-ai'
// import { optimizedPromptEditQuestions } from '@/lib/optimizedPrompt'
// import { toast } from 'sonner'
import { renderHightlightedContent } from './renderCode'

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

interface AIResultPreviewProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    quiz: QuizQuestion
    setOpenAddMoreInfo: (open: boolean) => void
    setGeneratedQuiz: any
}

export function AIResultPreview({ open, onOpenChange, quiz, setOpenAddMoreInfo, setGeneratedQuiz }: AIResultPreviewProps) {
    const [quizData, setQuizData] = useState<QuizQuestion>(quiz)
    const [filterQuizData, setFilterQuizData] = useState<QuizQuestion>(quiz)
    const [editingQuestion, setEditingQuestion] = useState<Quiz | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    // const [loading, setLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState<'all' | 'valid' | 'invalid'>('all')
    const [newQuestion, setNewQuestion] = useState<Quiz>({
        id: '',
        type: 'multiple-choice',
        question: '',
        answers: ['', '', '', ''],
        correct: '',
        points: 1,
    })

    // ✅ Helper function để apply filter
    const applyFilter = useCallback((data: QuizQuestion, filter: 'all' | 'valid' | 'invalid'): QuizQuestion => {
        if (filter === 'all') {
            return data
        } else if (filter === 'valid') {
            return {
                ...data,
                questions: data.questions.filter((q) => q.question && q.correct != '-1'),
            }
        } else if (filter === 'invalid') {
            return {
                ...data,
                questions: data.questions.filter((q) => !q.question || q.correct == '-1'),
            }
        }
        return data
    }, [])

    const handleEditQuestion = useCallback((question: Quiz) => {
        setNewQuestion(question)
        setEditingQuestion(question)
        setIsEditDialogOpen(true)
    }, [])

    const handleAddQuestion = useCallback(() => {
        setNewQuestion({
            id: Date.now().toString(),
            type: 'multiple-choice',
            question: '',
            answers: ['', '', '', ''],
            correct: '-1',
            points: 1,
        })
        setEditingQuestion(null)
        setIsEditDialogOpen(true)
    }, [])

    // ✅ Sửa lại handleSaveQuestion
    const handleSaveQuestion = useCallback(() => {
        if (!newQuestion.question.trim()) return

        // Update quizData
        const updatedQuestions = editingQuestion ? quizData.questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q)) : [...quizData.questions, newQuestion]

        const newQuizData = {
            ...quizData,
            questions: updatedQuestions,
        }

        setQuizData(newQuizData)
        setFilterQuizData(applyFilter(newQuizData, activeFilter))

        setIsEditDialogOpen(false)
        setEditingQuestion(null)
    }, [newQuestion, editingQuestion, quizData, applyFilter, activeFilter])

    const handleDeleteQuestion = useCallback(
        (questionId: string) => {
            const updatedQuestions = quizData.questions.filter((q) => q.id !== questionId)
            const newQuizData = {
                ...quizData,
                questions: updatedQuestions,
            }

            setQuizData(newQuizData)
            setFilterQuizData(applyFilter(newQuizData, activeFilter))
        },
        [quizData, applyFilter, activeFilter]
    )

    const handleQuestionTypeChange = useCallback((type: Quiz['type']) => {
        setNewQuestion((prev) => {
            const updated = { ...prev, type, correct: '' }

            if (type === 'multiple-choice') {
                updated.answers = ['', '', '', '']
            } else if (type === 'true-false') {
                updated.answers = ['Đúng', 'Sai']
            } else {
                updated.answers = undefined
            }

            return updated
        })
    }, [])

    const handleOptionChange = useCallback((index: number, value: string) => {
        setNewQuestion((prev) => ({
            ...prev,
            answers: prev.answers?.map((opt, i) => (i === index ? value : opt)),
        }))
    }, [])

    const handleChangeAnswers = useCallback((value: string) => {
        setNewQuestion((prev) => ({
            ...prev,
            correct: value,
        }))
    }, [])

    // ✅ Sửa lại handleFilterChange
    const handleFilterChange = useCallback((filter: 'all' | 'valid' | 'invalid') => {
        setActiveFilter(filter)
    }, [])

    // const handleQuestionTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setNewQuestion((prev) => ({ ...prev, question: e.target.value }))
    // }, [])

    // ✅ Sử dụng useMemo để tính toán errors dựa trên quizData
    const totalErrors = useMemo(() => {
        return quizData.questions.filter((q) => !q.question || q.answers?.length === 0 || q.correct == '-1').length
    }, [quizData.questions])

    const validQuestionsCount = useMemo(() => {
        return quizData.questions.filter((q) => q.question && q.correct != '-1').length
    }, [quizData.questions])

    // ✅ Update filterQuizData khi quizData thay đổi
    useEffect(() => {
        setFilterQuizData(applyFilter(quizData, activeFilter))
    }, [quizData, activeFilter, applyFilter])

    // const getQuestionTypeLabel = (type: string) => {
    //     switch (type) {
    //         case "multiple-choice":
    //             return "Trắc nghiệm";
    //         case "true-false":
    //             return "Đúng/Sai";
    //         case "short-answer":
    //             return "Tự luận ngắn";
    //         default:
    //             return type;
    //     }
    // };

    const handleRemoveAllErrors = useCallback(() => {
        const updatedQuestions = quizData.questions.filter((q) => q.correct != '-1')
        const newQuizData = {
            ...quizData,
            questions: updatedQuestions,
        }

        setQuizData(newQuizData)
        setFilterQuizData(applyFilter(newQuizData, activeFilter))
    }, [quizData, applyFilter, activeFilter])

    // const clearPatterns = useMemo(() => {
    //     return (questions: Quiz[]) => {
    //         const patternsToRemove = [
    //             /^Câu\s*\d+[:\.]?\s*/, // Câu 1:, Câu 2., Câu 3
    //             /^câu\s*\d+[:\.]?\s*/, // câu 1:, câu 2., câu 3
    //             /^\d+[:\.]?\s*/, // 1:, 2., 3
    //         ]

    //         const cleanedQuestions = questions.map((quest: Quiz) => {
    //             let cleanedQuestion = quest.question

    //             // Áp dụng từng pattern để loại bỏ
    //             patternsToRemove.forEach((pattern) => {
    //                 cleanedQuestion = cleanedQuestion.replace(pattern, '')
    //             })

    //             return {
    //                 ...quest,
    //                 question: cleanedQuestion.trim(),
    //             }
    //         })

    //         return cleanedQuestions
    //     }
    // }, [])
    // const genAI = useMemo(() => new GoogleGenerativeAI(import.meta.env.VITE_API_KEY_AI || ''), [])
    // const handleEditByAI = useCallback(async () => {
    //     try {
    //         setLoading(true)
    //         const questions = filterQuizData.questions
    //         if (questions.length === 0) {
    //             toast.info('Không có câu hỏi nào để chỉnh sửa.', { position: 'top-center' })
    //             return
    //         }
    //         if (questions.length > 20) {
    //             toast.info('Chỉ có thể chỉnh sửa tối đa 20 câu hỏi một lần.', { position: 'top-center' })
    //             return
    //         }

    //         // Loại bỏ các pattern thường gặp ở đầu câu hỏi
    //         const cleanedQuestions = clearPatterns(questions)

    //         const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    //         const prompt = optimizedPromptEditQuestions(cleanedQuestions)
    //         const result = await model.generateContent(prompt)

    //         const responseText = result?.response
    //             .text()
    //             .replace(/^```json\s*/, '')
    //             .replace(/^```html\s*/, '')
    //             .replace(/```\s*$/, '')

    //         const aiEditedQuestions = JSON.parse(responseText || '')

    //         // ✅ Thay thế thay vì thêm mới
    //         // Tạo Map để tra cứu nhanh các câu hỏi đã được AI chỉnh sửa
    //         const editedQuestionsMap = new Map()
    //         aiEditedQuestions.forEach((q: any) => {
    //             editedQuestionsMap.set(q.id, {
    //                 ...q,
    //                 correct: String(q.correct), // Đảm bảo correct là string
    //             })
    //         })

    //         // Cập nhật quizData bằng cách thay thế những câu đã được AI chỉnh sửa
    //         const updatedQuestions = quizData.questions.map((originalQuestion) => {
    //             const editedQuestion = editedQuestionsMap.get(originalQuestion.id)
    //             return editedQuestion || originalQuestion // Sử dụng câu đã chỉnh sửa nếu có, nếu không giữ nguyên
    //         })

    //         const newQuizData = {
    //             ...quizData,
    //             questions: updatedQuestions,
    //         }

    //         setQuizData(newQuizData)
    //         setFilterQuizData(applyFilter(newQuizData, activeFilter))
    //         toast.success('Đã chỉnh sửa câu hỏi thành công!', { position: 'top-center' })
    //     } catch (error: any) {
    //         console.error('Error during AI editing:', error)
    //         toast.error('Đã xảy ra lỗi khi chỉnh sửa câu hỏi bằng AI.', { description: error.message, position: 'top-center' })
    //     } finally {
    //         setLoading(false)
    //     }
    // }, [filterQuizData, clearPatterns, quizData, applyFilter, activeFilter, genAI])
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="p-3 md:p-6 min-h-[80vh] w-full md:max-w-7xl overflow-x-scroll ">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Bot className="h-5 w-5 text-purple-500" />
                                <span>Kết quả Quiz được tạo bởi AI</span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between  gap-2 ">
                            <div className="flex items-center   gap-2   ">
                                <Button variant={activeFilter === 'all' ? 'secondary' : 'outline'} size="sm" onClick={() => handleFilterChange('all')} className="h-11">
                                    <span>Tất cả</span>
                                    <Badge variant="secondary" className="ml-1">
                                        {quizData.questions.length}
                                    </Badge>
                                </Button>
                                <Button
                                    variant={activeFilter === 'valid' ? 'secondary' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilterChange('valid')}
                                    className={`h-11  ${activeFilter === 'valid' ? 'text-green-50 bg-green-600' : 'text-green-700 '} border-green-400`}
                                >
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Hợp lệ</span>
                                    <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700">
                                        {validQuestionsCount}
                                    </Badge>
                                </Button>
                                <Button
                                    variant={activeFilter === 'invalid' ? 'destructive' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilterChange('invalid')}
                                    className={`h-11  ${activeFilter === 'invalid' ? 'text-red-50 ' : 'text-red-700 border-red-400'}`}
                                >
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Cần sửa</span>
                                    <Badge variant="secondary" className="ml-1 bg-red-100 text-red-700">
                                        {totalErrors}
                                    </Badge>
                                </Button>
                                <Button
                                    onClick={handleAddQuestion}
                                    className="h-11 flex md:hidden items-center space-x-2 text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Thêm câu hỏi</span>
                                </Button>
                                {activeFilter === 'invalid' && totalErrors > 0 && (
                                    <>
                                        <Button
                                            className="text-red-700 border-red-200 hover:bg-red-50 h-11 dark:text-red-200 dark:border-red-700 dark:hover:bg-red-700/50 dark:bg-red-800/50"
                                            onClick={handleRemoveAllErrors}
                                        >
                                            <Trash2 /> Xóa hết những câu lỗi
                                        </Button>
                                        {/* <Button
                                            className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white h-10"
                                            onClick={handleEditByAI}
                                            disabled={loading || filterQuizData.questions.length >= 20}>
                                            <Sparkle className={`${loading ? "animate-spin" : ""}`} /> {filterQuizData.questions.length >= 20 ? "Số câu chỉnh sửa đã vượt 20 câu" : "Chỉnh sửa bằng AI"}
                                        </Button> */}
                                    </>
                                )}
                            </div>
                            <Button
                                onClick={handleAddQuestion}
                                className="hidden md:flex items-center space-x-2 text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Thêm câu hỏi</span>
                            </Button>
                        </div>

                        {/* List */}
                        {/* Alert for invalid questions */}
                        {totalErrors > 0 && activeFilter !== 'invalid' && (
                            <p className="text-sm border border-amber-200 bg-amber-50 dark:bg-amber-900/50 dark:border-amber-700 flex items-center p-3 rounded-md gap-3">
                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-200" />
                                <div className="ext-amber-800 dark:text-amber-200">
                                    <strong>Chú ý!</strong> Có {totalErrors} câu hỏi cần được kiểm tra và sửa lại trước khi xuất bản.
                                </div>
                            </p>
                        )}
                        <div className={`space-y-4 ${totalErrors > 0 && activeFilter !== 'invalid' ? 'max-h-[300px]' : 'max-h-[350px]'} md:max-h-[500px]  overflow-auto`}>
                            {filterQuizData &&
                                filterQuizData.questions.map((question, index) => (
                                    <Card
                                        key={question.id}
                                        className={`border-l-4 ${
                                            Number(question.correct) == -1
                                                ? 'border-l-red-700 dark:border-l-red-400 bg-red-200/10 dark:bg-red-500/10'
                                                : 'border-l-green-700 dark:border-l-green-400 bg-green-200/10 dark:bg-green-500/10'
                                        }  hover:shadow-lg transition-shadow duration-200`}
                                    >
                                        <CardHeader className="pb-3 p-2 md:p-6 ">
                                            <div className="flex  flex-col-reverse gap-3 md:gap-0 md:flex-row items-start justify-between ">
                                                <div className="flex-1">
                                                    {activeFilter === 'invalid' ? (
                                                        <div className="flex items-center gap-2 ">
                                                            <CardTitle className="text-base font-medium ">{renderHightlightedContent(question.question)}</CardTitle>
                                                            <Badge className="text-white gap-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 animate-bounce">
                                                                <AlertCircle size={14} />
                                                                Cần sửa
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <CardTitle className="text-base font-medium ">
                                                            Câu {index + 1}: {renderHightlightedContent(question.question)}
                                                        </CardTitle>
                                                    )}

                                                    <div className="flex items-center space-x-2 mt-2">
                                                        {/* <Badge variant="secondary">{getQuestionTypeLabel(question.type)}</Badge> */}
                                                        <Badge variant="secondary">Trắc nghiệm</Badge>
                                                        <Badge variant="outline">1 điểm</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {question.answers && (
                                            <CardContent className="pt-0 p-2 md:p-6 ">
                                                <div className="space-y-1">
                                                    {question.answers.map((option, optIndex) => (
                                                        <div
                                                            key={optIndex}
                                                            className={`p-2 rounded text-sm ${
                                                                String(optIndex) == question.correct
                                                                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700'
                                                                    : 'bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                                                            }`}
                                                        >
                                                            {activeFilter === 'valid' ? (
                                                                <span className="font-medium">
                                                                    {String.fromCharCode(65 + optIndex)}. {renderHightlightedContent(option)}
                                                                </span>
                                                            ) : (
                                                                <span className="font-medium">{renderHightlightedContent(option)}</span>
                                                            )}
                                                            {/* {String.fromCharCode(65 + optIndex)}. {renderContentWithLaTeX(option)} */}
                                                            {option === question.correct && <span className="ml-2 text-xs font-medium">(Đáp án đúng)</span>}
                                                        </div>
                                                    ))}
                                                    {Number(question.correct) == -1 && (
                                                        <p className="border border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-700 p-3  text-sm">
                                                            <div className="flex gap-2 items-center text-red-600  dark:text-red-400">
                                                                <AlertCircle className="h-4 w-4 " />
                                                                <p className="font-medium">Vấn đề cần khắc phục</p>
                                                            </div>
                                                            <div className="text-red-800 dark:text-red-200">
                                                                {question.answers?.some((answer) => answer === '') && <p>• Chưa nhập câu trả lời</p>}
                                                                <p>• Chưa chọn đáp án đúng</p>
                                                            </div>
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            {quizData.questions.length === 0 && (
                                <div className=" h-[340px] md:h-[500px]  flex items-center justify-center">
                                    <p className="text-center text-sm">Không có từ nào...</p>
                                </div>
                            )}
                            {quizData.questions.length > 0 && totalErrors === 0 && activeFilter === 'invalid' && (
                                <div className=" h-[340px] md:h-[500px]  flex items-center justify-center">
                                    <p className="text-center text-sm">Đã sửa hết lỗi...</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-row-reverse md:flex-row justify-end gap-5 pt-4 border-t">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Đóng
                            </Button>

                            <Button
                                className="text-white bg-linear-to-r from-purple-500 to-pink-500"
                                disabled={totalErrors > 0}
                                onClick={() => {
                                    setOpenAddMoreInfo(true)
                                    setGeneratedQuiz(quizData)
                                }}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {totalErrors > 0 ? `Sửa hết ${totalErrors} lỗi trước khi lưu` : 'Lưu và xuất bản Quiz'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Question Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>{editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="question-text">Câu hỏi</Label>
                            <Textarea
                                id="question-text"
                                placeholder="Nhập câu hỏi..."
                                value={newQuestion.question}
                                onChange={(e) => setNewQuestion((prev) => ({ ...prev, question: e.target.value }))}
                                className="mt-1 h-40"
                            />
                        </div>

                        <div className="hidden">
                            <Label htmlFor="question-type">Loại câu hỏi</Label>
                            <Select value={newQuestion.type} defaultValue="multiple-choice" disabled onValueChange={handleQuestionTypeChange}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="multiple-choice">Trắc nghiệm</SelectItem>
                                    <SelectItem value="true-false">Đúng/Sai</SelectItem>
                                    <SelectItem value="short-answer">Tự luận ngắn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Các lựa chọn</Label>
                            <div className="space-y-2 mt-2 h-[150px] overflow-y-auto">
                                <RadioGroup defaultValue={newQuestion.correct} value={newQuestion.correct} onValueChange={(value) => handleChangeAnswers(value)}>
                                    {newQuestion &&
                                        newQuestion.answers?.map((option, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Input
                                                    placeholder={`Lựa chọn ${index + 1}`}
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    className={String(index) == newQuestion.correct ? 'border-green-500 bg-green-50 dark:bg-green-800/50 dark:text-green-200' : ''}
                                                />
                                                <div className="flex items-center space-x-2">
                                                    <Label htmlFor={`option-${index}`} className="flex items-center space-x-1">
                                                        {String(index) == newQuestion.correct ? (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                <RadioGroupItem defaultValue={String(index)} value={String(index)} id={`option-${index}`} className="hidden" />
                                                            </>
                                                        ) : (
                                                            <RadioGroupItem value={String(index)} id={`option-${index}`} />
                                                        )}
                                                    </Label>
                                                </div>
                                            </div>
                                        ))}
                                </RadioGroup>
                            </div>
                        </div>
                        {newQuestion.type === 'true-false' && (
                            <div>
                                <Label>Đáp án đúng</Label>
                                <RadioGroup value={newQuestion.correct} onValueChange={(value) => setNewQuestion((prev) => ({ ...prev, correct: value }))} className="mt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Đúng" id="true" />
                                        <Label htmlFor="true">Đúng</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Sai" id="false" />
                                        <Label htmlFor="false">Sai</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}

                        {newQuestion.type === 'short-answer' && (
                            <div>
                                <Label htmlFor="text-answer">Đáp án mẫu</Label>
                                <Textarea
                                    id="text-answer"
                                    placeholder="Nhập đáp án mẫu..."
                                    value={newQuestion.correct}
                                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, correct: e.target.value }))}
                                    className="mt-1"
                                />
                            </div>
                        )}

                        <div className="hidden">
                            <Label htmlFor="points">Điểm số</Label>
                            <Input
                                id="points"
                                type="number"
                                disabled
                                min="1"
                                defaultValue={1}
                                value={newQuestion.points}
                                onChange={(e) => setNewQuestion((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 1 }))}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSaveQuestion} className="text-white">
                            {editingQuestion ? 'Cập nhật' : 'Thêm câu hỏi'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
