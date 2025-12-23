import { useMemo, useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Eye, Save, File, FileText, MousePointerClick, ImageIcon, LetterText } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { toast } from 'sonner'
import { optimizedPromptQuiz, optimizedPromptQuizTextOption } from '@/lib/optimizedPrompt'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocation, useNavigate } from 'react-router-dom'
import type { IGeneratedQuiz, QuizAIInterface, QuizAIText } from '@/types/create-ai'
import DialogAddMoreInfoQuiz from '../../components/DialogAddMoreInfoQuiz'
import { AIResultPreview } from '../../components/AIResuiltPreview'
import QuizAIInterfaceOption from '../../components/QuizAIInterfaceOption'
import QuizAITextOption from '../../components/QuizAITextOption'

export function QuizAIPage() {
    const [dataQuizInterface, setDataQuizInterface] = useState<QuizAIInterface>({ topic: '', description: '', questionCount: [10], difficulty: 'medium' })
    const [dataQuizText, setDataQuizText] = useState<QuizAIText>({ content: '', questionCount: [50] })
    const [activeTab, setActiveTab] = useState('gui1')
    const [openAddMoreInfo, setOpenAddMoreInfo] = useState(false)

    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedQuiz, setGeneratedQuiz] = useState<IGeneratedQuiz | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    // const [openGame, setOpenGame] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    // ✅ Refs để track trạng thái
    const isPageActiveRef = useRef(true)
    const isGeneratingRef = useRef(false)

    const genAI = useMemo(() => new GoogleGenerativeAI(import.meta.env.VITE_API_KEY_AI || ''), [])

    // ✅ Cập nhật refs khi state thay đổi
    useEffect(() => {
        isGeneratingRef.current = isGenerating
    }, [isGenerating])

    // useEffect(() => {
    //     currentTopicRef.current = topic
    //     currentDifficultyRef.current = difficulty
    // }, [topic, difficulty])

    // ✅ Cleanup khi component unmount hoặc user rời trang
    useEffect(() => {
        isPageActiveRef.current = true

        // Cleanup function khi component unmount
        return () => {
            isPageActiveRef.current = false
        }
    }, [])

    // ✅ Detect khi user navigate ra khỏi trang
    useEffect(() => {
        const handleRouteChange = () => {
            isPageActiveRef.current = false
        }

        // Listen cho route changes
        window.addEventListener('beforeunload', handleRouteChange)

        return () => {
            window.removeEventListener('beforeunload', handleRouteChange)
            handleRouteChange()
        }
    }, [])

    // ✅ Function để auto-save vào draft
    const autoSaveToDraft = (quiz: IGeneratedQuiz) => {
        const draftStorage = localStorage.getItem('draftQuiz')
        const draft = {
            ...quiz,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'ai',
            status: 'draft',
            difficulty: dataQuizInterface.difficulty,
            autoSaved: true, // ✅ Flag để biết là auto-saved
        }

        if (draftStorage) {
            const existingDrafts = JSON.parse(draftStorage)
            const isDuplicate = existingDrafts.some((d: any) => d.title === draft.title)
            if (isDuplicate) {
                toast.error('Quiz nháp đã tồn tại')
                return
            }
            localStorage.setItem('draftQuiz', JSON.stringify([...existingDrafts, draft]))
        } else {
            localStorage.setItem('draftQuiz', JSON.stringify([draft]))
            // ✅ Toast thông báo auto-save
            toast.info('Quiz đã được tự động lưu vào nháp', {
                description: `Do bạn đã rời khỏi trang tạo quiz với chủ đề "${dataQuizInterface.topic}"`,
                position: 'top-center',
                duration: 15000,
                action: {
                    label: 'Xem nháp',
                    onClick: () => navigate('/quiz/themcauhoi/drafts'),
                },
            })
        }
    }

    const handleGenerate = async (data: any, type: string) => {
        try {
            setGeneratedQuiz(null)
            setIsGenerating(true)
            // setOpenGame(true)
            let prompt = ''
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
            if (type === 'interface') {
                prompt = optimizedPromptQuiz(data.topic, data.description, data.questionCount[0], data.difficulty)
            } else if (type === 'text') {
                prompt = optimizedPromptQuizTextOption(data.content, data.questionCount[0])
            }
            const result = await model.generateContent(prompt)

            const responseText = result?.response
                .text()
                .replace(/^```json\s*/, '')
                .replace(/^```html\s*/, '')
                .replace(/```\s*$/, '')

            const jsonOutput = JSON.parse(responseText || '')
            setIsGenerating(false)

            // ✅ Kiểm tra xem user còn ở trang này không
            if (!isPageActiveRef.current) {
                // User đã rời trang -> auto-save vào draft
                autoSaveToDraft(jsonOutput)
                return
            }

            // ✅ User vẫn ở trang -> hiển thị như bình thường
            setGeneratedQuiz(jsonOutput)
            toast.success('Quiz đã được tạo thành công!', {
                position: 'top-center',
                duration: 5000,
                action: {
                    label: 'Xem trước',
                    onClick: () => setShowPreview(true),
                },
            })
        } catch (error: any) {
            console.error('Error generating quiz:', error)
            if (isPageActiveRef.current) {
                toast.error('Đã xảy ra lỗi khi tạo quiz.', {
                    description: error,
                    position: 'top-center',
                    duration: 5000,
                })
            }
        } finally {
            setIsGenerating(false)
        }
    }

    // ✅ Function lưu thủ công vào draft (giữ nguyên)
    const handleAddToDraft = () => {
        const draftStorage = localStorage.getItem('draftQuiz')
        const draft = {
            ...generatedQuiz,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'ai',
            status: 'draft',
            difficulty: dataQuizInterface.difficulty || 'easy',
            autoSaved: false, // ✅ User save thủ công
        }

        if (draftStorage) {
            const existingDrafts = JSON.parse(draftStorage)
            const isDuplicate = existingDrafts.some((d: any) => d.title === draft.title)
            if (isDuplicate) {
                toast.error('Quiz nháp đã tồn tại')
                return
            } else {
                localStorage.setItem('draftQuiz', JSON.stringify([...existingDrafts, draft]))
                toast.success('Quiz đã được lưu vào nháp', {
                    description: 'Bạn có thể xem lại trong phần Draft',
                    duration: 5000,
                    action: {
                        label: 'Xem nháp',
                        onClick: () => navigate('/ai-center/drafts'),
                    },
                })
            }
        } else {
            localStorage.setItem('draftQuiz', JSON.stringify([draft]))
            toast.success('Quiz đã được lưu vào nháp', {
                description: 'Bạn có thể xem lại trong phần Draft',
                duration: 5000,
                action: {
                    label: 'Xem nháp',
                    onClick: () => navigate('/ai-center/drafts'),
                },
            })
        }
    }

    // ✅ Thêm effect để detect route change (alternative approach)
    useEffect(() => {
        return () => {
            // Khi component unmount và đang generate
            if (isGeneratingRef.current) {
                isPageActiveRef.current = false
            }
        }
    }, [location.pathname])

    return (
        <div className="px-6  mx-auto space-y-6">
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                    <SidebarTrigger />
                    <h1 className="text-3xl font-bold">Tạo Quiz bằng AI</h1>
                </div>
                <p className="text-muted-foreground">Mô tả chủ đề và để AI tạo quiz hoàn chỉnh cho bạn</p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                <TabsList className="grid grid-cols-3   h-12">
                    <TabsTrigger value="gui1" className="flex items-center gap-2 h-10">
                        <MousePointerClick className="w-4 h-4" />
                        Giao diện
                    </TabsTrigger>

                    <TabsTrigger value="text" className="flex items-center gap-2 h-10">
                        <LetterText className="w-4 h-4" />
                        Văn bản
                    </TabsTrigger>
                    <TabsTrigger value="file" className="items-center gap-2 h-10 hidden md:flex">
                        <FileText className="w-4 h-4" />
                        Tệp tin (chưa hỗ trợ)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="gui1" className="space-y-6">
                    <QuizAIInterfaceOption
                        generatedQuiz={generatedQuiz}
                        dataQuizInterface={dataQuizInterface}
                        setDataQuizInterface={setDataQuizInterface}
                        handleGenerate={handleGenerate}
                        isGenerating={isGenerating}
                    />
                </TabsContent>
                <TabsContent value="gui2" className="space-y-6">
                    {/* <QuizAIInterface2 generatedQuiz={generatedQuiz} dataQuizInterface={dataQuizInterface} setDataQuizInterface={setDataQuizInterface} handleGenerate={handleGenerate} isGenerating={isGenerating} /> */}
                </TabsContent>
                <TabsContent value="text" className="space-y-6">
                    <QuizAITextOption dataQuizText={dataQuizText} setDataQuizText={setDataQuizText} generatedQuiz={generatedQuiz} handleGenerate={handleGenerate} isGenerating={isGenerating} />
                </TabsContent>

                <TabsContent value="file" className="space-y-6">
                    <Card className=" ">
                        <CardHeader>
                            <CardTitle className="text-slate-600 dark:text-white flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Tạo câu hỏi từ file
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed dark:border-slate-600 rounded-lg p-8 text-center">
                                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="dark:text-slate-300 text-slate-600 mb-2">Kéo thả file vào đây hoặc</p>
                                <Button variant="outline" className="dark:border-slate-600 dark:text-slate-300 text-slate-600 bg-transparent">
                                    Chọn file
                                </Button>
                                <p className="text-slate-500 text-sm mt-2">Hỗ trợ: DOCX, PDF, TXT, XLXS (tối đa 10MB)</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {generatedQuiz && (
                <div className="space-y-4">
                    <div className="flex justify-center gap-3 flex-col md:flex-row">
                        <Button size="lg" variant="outline" onClick={() => handleAddToDraft()}>
                            <File className="mr-2 h-4 w-4" />
                            Lưu vào nháp
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => setShowPreview(true)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem trước kết quả
                        </Button>
                        <DialogAddMoreInfoQuiz generatedQuiz={generatedQuiz} openAddMoreInfo={openAddMoreInfo} setOpenAddMoreInfo={setOpenAddMoreInfo}>
                            <Button size="lg" className="w-full md:w-auto text-white bg-linear-to-r from-blue-500 to-cyan-500">
                                <Save className="mr-2 h-4 w-4" />
                                Lưu và xuất bản
                            </Button>
                        </DialogAddMoreInfoQuiz>
                    </div>
                </div>
            )}
            {generatedQuiz && <AIResultPreview open={showPreview} onOpenChange={setShowPreview} quiz={generatedQuiz} setGeneratedQuiz={setGeneratedQuiz} setOpenAddMoreInfo={setOpenAddMoreInfo} />}
        </div>
    )
}
