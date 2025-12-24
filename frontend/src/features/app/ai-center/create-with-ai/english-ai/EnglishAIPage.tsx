import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FileText, ImageIcon, Settings, Sparkles, Eye, CircleQuestionMark } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Loading from '@/components/ui/loading'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { optimizedPromptEnglishExam } from '@/lib/optimizedPrompt'
import { toast } from 'sonner'
import { MultiSelect } from '@/components/ui/multi-select'
import { contentSuggestions, difficultyLevels, questionCounts, questionsTemplate, questionTimeLimits, questionTypes, skillTypes } from '../../components/configEnglish'
import type { IEnglishExam, Question } from '@/types/english-exam'
import { ExamInterface } from './components/ExamInterface'

export default function EnglishAIPage() {
    const [activeTab, setActiveTab] = useState('gui')
    const [openResult, setOpenResult] = useState(false)
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        content: '',
        difficulty: '',
        skills: [''],
        questionTypes: [''],
        questionCount: 20,
        timeLimit: 30,
    })

    const [generatedQuestions, setGeneratedQuestions] = useState<IEnglishExam | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [jsonOutput, setJsonOutput] = useState<Question[]>([])
    const genAI = useMemo(() => new GoogleGenerativeAI(import.meta.env.VITE_API_KEY_AI || ''), [])
    const SetDataEnglishExam = (newJsonOutput?: any) => {
        const newExamData: IEnglishExam = {
            title: quizData.title,
            description: quizData.description,
            difficulty: quizData.difficulty as any,
            skills: quizData.skills as any,
            timeLimit: quizData.timeLimit,
            questions: newJsonOutput || jsonOutput,
        }
        setGeneratedQuestions(newExamData)
    }
    const handleGenerateQuestionsWithAI = async () => {
        try {
            setGeneratedQuestions(null)
            setIsGenerating(true)

            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
            const prompt = optimizedPromptEnglishExam(quizData)
            const result = await model.generateContent(prompt)

            const responseText = result?.response
                .text()
                .replace(/^```json\s*/, '')
                .replace(/^```html\s*/, '')
                .replace(/```\s*$/, '')

            const newJsonOutput = JSON.parse(responseText || '')
            setJsonOutput(newJsonOutput)
            setIsGenerating(false)
            SetDataEnglishExam(newJsonOutput)

            toast.success('Tạo đề thi tiếng anh thành công!', {
                position: 'top-center',
                duration: 5000,
                action: {
                    label: 'Xem trước',
                    onClick: () => setOpenResult(true),
                },
            })
        } catch (error) {
            console.error('Error generating quiz:', error)

            toast.error('Đã xảy ra lỗi khi tạo quiz.', {
                description: error instanceof Error ? error.message : 'Lỗi không xác định',
                position: 'top-center',
                duration: 5000,
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSeeTemplateQuestionType = () => {
        setOpenResult(true)
        setGeneratedQuestions(questionsTemplate as IEnglishExam)
    }

    return (
        <div className="px-6">
            <div className="text-center space-y-2 relative mb-5">
                <SidebarTrigger className="absolute top-0 left-0" />
                <h1 className="text-3xl font-bold">Tạo đề thi tiếng anh</h1>
                <p className="text-muted-foreground">Mô tả chủ đề và để AI tạo đề thi hoàn chỉnh cho bạn</p>
            </div>
            <div className="flex-1  overflow-auto">
                <div className="">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                        <TabsList className="grid grid-cols-3  h-12">
                            <TabsTrigger value="gui" className="flex items-center gap-2 h-10">
                                <FileText className="w-4 h-4" />
                                Giao diện
                            </TabsTrigger>
                            <TabsTrigger value="text" className="flex items-center gap-2 h-10">
                                <FileText className="w-4 h-4" />
                                Văn bản
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2 h-10">
                                <Settings className="w-4 h-4" />
                                Cài đặt
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="gui" className="space-y-6">
                            <Card className=" ">
                                <CardHeader>
                                    <CardTitle className=" dark:text-white text-slate-700 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Nhập nội dung
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="dark:text-slate-300 text-slate-600">
                                            Tiêu đề
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="Nhập tiêu đề..."
                                            value={quizData.title}
                                            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                            className="dark:bg-slate-600/50 dark:border-slate-600 text-slate-600 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="dark:text-slate-300 text-slate-600">
                                            Mô tả
                                        </Label>
                                        <Input
                                            id="description"
                                            placeholder="Mô tả ngắn..."
                                            value={quizData.description}
                                            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                                            className="dark:bg-slate-600/50 dark:border-slate-600 text-slate-600 dark:text-white"
                                        />
                                    </div>

                                    <div className="flex gap-5 md:flex-row flex-col">
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="content" className="dark:text-slate-300 text-slate-600">
                                                Nội dung của bài thi
                                            </Label>
                                            <Textarea
                                                id="content"
                                                placeholder="Nhập đoạn văn bản hoặc chủ đề mà bạn muốn tạo câu hỏi, có thể thêm phạm vi, yêu cầu đặc biệt..."
                                                value={quizData.content}
                                                onChange={(e) => setQuizData({ ...quizData, content: e.target.value })}
                                                className="dark:bg-slate-600/50 dark:border-slate-600 text-slate-600 dark:text-white min-h-[200px]"
                                            />
                                        </div>
                                        <div className="mt-3 w-full md:w-[300px]">
                                            <p className="text-sm ">Gợi ý nội dung</p>
                                            <div className="flex flex-wrap gap-3 mt-1">
                                                {contentSuggestions.map((suggest, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="cursor-pointer hover:dark:bg-slate-600/50 hover:bg-slate-200 text-slate-500 dark:text-slate-300"
                                                        onClick={() => setQuizData({ ...quizData, content: suggest.description })}
                                                    >
                                                        {suggest.title}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-slate-600">Cấp độ khó</Label>
                                            <Select value={quizData.difficulty} onValueChange={(value) => setQuizData({ ...quizData, difficulty: value })}>
                                                <SelectTrigger className="dark:bg-slate-600/50 dark:border-slate-600 text-slate-600 dark:text-white w-full h-10">
                                                    <SelectValue placeholder="Chọn cấp độ" />
                                                </SelectTrigger>
                                                <SelectContent className="">
                                                    {difficultyLevels.map((level) => (
                                                        <SelectItem key={level.value} value={level.value} className="dark:text-slate-300 text-slate-600">
                                                            {level.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="dark:text-slate-300 text-slate-600">Kỹ năng tập trung</Label>
                                            <MultiSelect
                                                options={skillTypes}
                                                onValueChange={(value) => setQuizData({ ...quizData, skills: value })}
                                                className="dark:bg-slate-600/50 dark:border-slate-600 text-slate-600 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300 text-slate-600 mb-3 block">Loại câu hỏi</Label>
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <MultiSelect
                                                options={questionTypes}
                                                onValueChange={(value) => setQuizData({ ...quizData, questionTypes: value })}
                                                className="flex-1 dark:bg-slate-600/50 dark:dark:border-slate-600 text-slate-600 dark:text-white"
                                            />
                                            <Button variant="secondary" className=" h-10" onClick={handleSeeTemplateQuestionType}>
                                                <CircleQuestionMark /> Xem các câu hỏi được hỗ trợ
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="questionCount" className="dark:text-slate-300 text-slate-600 ">
                                                Số câu hỏi
                                            </Label>
                                            <Select value={String(quizData.questionCount)} onValueChange={(value) => setQuizData({ ...quizData, questionCount: Number(value) })}>
                                                <SelectTrigger className="w-full dark:bg-slate-600/50 dark:border-slate-600 text-slate-600 dark:text-white h-10">
                                                    <SelectValue placeholder="Chọn số câu hỏi" />
                                                </SelectTrigger>
                                                <SelectContent className=" ">
                                                    {questionCounts.map((level) => (
                                                        <SelectItem key={level.value} value={level.value} className="dark:text-slate-300 text-slate-600">
                                                            {level.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="timeLimit" className="dark:text-slate-300 text-slate-600">
                                                Thời gian làm bài (phút)
                                            </Label>
                                            <Select value={String(quizData.timeLimit)} onValueChange={(value) => setQuizData({ ...quizData, timeLimit: Number(value) })}>
                                                <SelectTrigger className="w-full dark:bg-slate-600/50 dark:border-slate-600 text-slate-600 dark:text-white h-10">
                                                    <SelectValue placeholder="Chọn thời gian" />
                                                </SelectTrigger>
                                                <SelectContent className=" ">
                                                    {questionTimeLimits.map((level) => (
                                                        <SelectItem key={level.value} value={level.value} className="dark:text-slate-300 text-slate-600">
                                                            {level.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className={`flex flex-col md:flex-row gap-3 ${generatedQuestions && generatedQuestions?.title !== 'test-ai-english' ? 'md:flex-row-reverse' : ''}`}>
                                        {generatedQuestions && (
                                            <Button
                                                className={`h-12  ${
                                                    generatedQuestions && generatedQuestions?.title !== 'test-ai-english'
                                                        ? 'flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                                        : ''
                                                }`}
                                                variant="outline"
                                                onClick={() => {
                                                    setOpenResult(true)
                                                    SetDataEnglishExam()
                                                }}
                                            >
                                                <Eye />
                                                Xem trước
                                            </Button>
                                        )}

                                        <Button
                                            onClick={handleGenerateQuestionsWithAI}
                                            disabled={true}
                                            // disabled={!quizData.content || !quizData.difficulty || quizData.questionTypes.length === 0 || isGenerating}
                                            variant="outline"
                                            className={`  ${
                                                generatedQuestions && generatedQuestions?.title !== 'test-ai-english'
                                                    ? ''
                                                    : 'flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                            }  h-12 text-white `}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loading />
                                                    Đang tạo câu hỏi...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    {/* Tạo câu hỏi bằng AI */} Tính năng đang được phát triển còn hạn chế
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            {generatedQuestions && <ExamInterface examData={generatedQuestions} open={openResult} setOpen={setOpenResult} />}
                        </TabsContent>

                        <TabsContent value="text" className="space-y-6">
                            <Card className=" ">
                                <CardHeader>
                                    <CardTitle className="text-slate-600 dark:text-white flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5" />
                                        Tạo câu hỏi từ hình ảnh
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed dark:border-slate-600 rounded-lg p-8 text-center">
                                        <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="dark:text-slate-300 text-slate-600 mb-2">Kéo thả hình ảnh vào đây hoặc</p>
                                        <Button variant="outline" className="dark:border-slate-600 dark:text-slate-300 text-slate-600 bg-transparent">
                                            Chọn hình ảnh
                                        </Button>
                                        <p className="text-slate-500 text-sm mt-2">Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-6">
                            <Card className=" ">
                                <CardHeader>
                                    <CardTitle className="text-slate-600 dark:text-white flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Cài đặt nâng cao
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="dark:text-slate-300 text-slate-600">Trộn câu hỏi</Label>
                                                <p className="text-slate-500 text-sm">Thay đổi thứ tự câu hỏi mỗi lần làm bài</p>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="dark:text-slate-300 text-slate-600">Trộn đáp án</Label>
                                                <p className="text-slate-500 text-sm">Thay đổi thứ tự các lựa chọn</p>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="dark:text-slate-300 text-slate-600">Hiển thị giải thích</Label>
                                                <p className="text-slate-500 text-sm">Hiển thị giải thích sau khi trả lời</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="dark:text-slate-300 text-slate-600">Cho phép quay lại</Label>
                                                <p className="text-slate-500 text-sm">Học sinh có thể xem lại câu trước</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
