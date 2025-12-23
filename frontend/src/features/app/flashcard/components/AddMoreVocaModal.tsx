/* eslint-disable no-unsafe-optional-chaining */

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Sparkles, Type, Send, Eye, Volume2, X } from 'lucide-react'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import type { Flashcard } from '@/types/flashcard'
import { optimizedPromptFCMore } from '@/lib/optimizedPrompt'
import flashcardService from '@/services/flashcardService'
import Loading from '@/components/ui/loading'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface AddVocabularyModalProps {
    children: React.ReactNode
    listFlashcard?: any
    setListFlashcard: any
    filteredFlashcards: any
    setFilteredFlashcards: any
    speakWord: (word: string, id: number) => void
}

export default function AddMoreVocaModal({ children, listFlashcard, setListFlashcard, filteredFlashcards, setFilteredFlashcards, speakWord }: AddVocabularyModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openDetail, setOpenDetail] = useState(false)

    const [vocabulary, setVocabulary] = useState('')
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])

    const [isGenerating, setIsGenerating] = useState(false)
    const genAI = useMemo(() => new GoogleGenerativeAI(import.meta.env.VITE_API_KEY_AI || ''), [])
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const handleAIGenerate = async (e: any) => {
        e.preventDefault()
        setFlashcards([])
        toast.loading('Đang tạo flashcard bằng AI', {
            description: 'Quá trình này có thể mất vài giây đến vài phút tùy vào độ phức tạp của từ vựng.',
            id: 'ai-generate',
            position: 'top-center',
        })
        try {
            const optimizedPrompt = optimizedPromptFCMore(vocabulary, listFlashcard?.language)
            setIsGenerating(true)
            const result = await model.generateContent(optimizedPrompt)

            const parse = result.response
                .text()
                .replace(/```json/g, '')
                .replace(/```/g, '')

            const data = JSON.parse(parse)

            setFlashcards(data || [])
            toast.success('Tạo flashcard thành công từ AI', {
                description: 'Các từ vựng mới đã được thêm vào bộ flashcard của bạn.',
                id: 'ai-generate',
                duration: 5000,
                position: 'top-center',
            })
        } catch (error: any) {
            console.error('Error generating flashcards with AI:', error)
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau', {
                description: error.message,
                id: 'ai-generate',
                position: 'top-center',
            })
        } finally {
            setIsGenerating(false)
            toast.dismiss('ai-generate')
        }
    }

    const handleSendData = async () => {
        try {
            setLoading(true)
            toast.loading('Đang gửi dữ liệu lên server', {
                description: 'Vui lòng đợi trong giây lát...',
                id: 'ai-generate',
                position: 'top-center',
            })
            const req = await flashcardService.createManyFlashcardsWithAI({
                list_flashcard_id: listFlashcard._id,
                language: listFlashcard?.language,
                data: flashcards || '',
            })
            if (req?.ok) {
                toast.success('Gửi dữ liệu thành công', {
                    description: 'Các từ vựng mới đã được thêm vào bộ flashcard của bạn.',
                    id: 'ai-generate',
                    duration: 5000,
                    position: 'top-center',
                })
                setFilteredFlashcards([...req?.flashcards, ...filteredFlashcards])
                setListFlashcard((prev: any) => ({
                    ...prev, // Giữ nguyên các properties khác
                    flashcards: [...(req?.flashcards || []), ...(prev?.flashcards || [])], // Update array flashcards
                }))
                setOpen(false)
                setOpenDetail(false)
                // Reset form data with AI generated content
                setVocabulary('')
                setFlashcards([])
            }
        } catch (error: any) {
            console.error('Error sending data:', error)
            toast.error('Đã có lỗi xảy ra khi gửi dữ liệu', { description: error.message, id: 'ai-generate', position: 'top-center' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-4xl p-3 md:p:6">
                <DialogHeader className="pb-2 md:pb-4">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">Thêm nhiều từ vựng mới</DialogTitle>
                    <DialogDescription className="text-left">Bạn có thể ghi tiếng việt vào và bấm tạo bằng AI, AI sẽ tự động chuyển từ thành tiếng bạn muốn</DialogDescription>
                </DialogHeader>

                <div className="">
                    <div className="space-y-6">
                        {/* Main Word Section */}
                        <Card className="border-blue-100 bg-blue-50/30 dark:bg-slate-800/50 dark:border-white/10 ">
                            <CardContent className="space-y-4 p-3 md:p-6">
                                <div className="flex gap-2">
                                    <Textarea
                                        id="title"
                                        value={vocabulary}
                                        onChange={(e) => setVocabulary(e.target.value)}
                                        autoFocus
                                        autoComplete="off"
                                        maxLength={200}
                                        placeholder="VD: extraordinary, beautiful, huge, etc."
                                        className="flex-1 h-32"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAIGenerate}
                                    disabled={isGenerating}
                                    className="dark:text-white gap-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full"
                                >
                                    {isGenerating ? <Loading className="text-white" /> : <Sparkles className="w-4 h-4" />}

                                    {isGenerating ? 'Đang tạo...' : 'Tạo bằng AI'}
                                </Button>
                                <div className="flex justify-between items-center bg-gray-100 text-slate-400  dark:bg-slate-600/50 p-3 rounded-lg">
                                    <p className="text-xs ">Các từ vựng cách nhau bằng dấu phẩy</p>
                                    <span className="text-xs text-end">
                                        {vocabulary.split(',').length}/24 từ {' | Mất khoảng:' + Math.floor(vocabulary.split(' ').length * 1.4 + vocabulary.split(' ').length) + 's'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-100 text-slate-400 dark:bg-slate-600/50 p-3 rounded-lg">
                                    <p className="text-xs ">Các câu cách nhau bằng dấu chấm phẩy</p>
                                    <span className="text-xs text-right ">
                                        {vocabulary.split(';').length} câu {' | ' + vocabulary.length}/200 chữ
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-white/50">Nếu bạn không làm đúng format, AI có thể hiểu nhầm</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator className="my-4 hidden md:block" />

                <DialogFooter className="gap-2 flex flex-row">
                    {/* <Button variant="outline" onClick={() => setOpen(false)} className="hidden md:block gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600">
                        Hủy
                    </Button> */}
                    <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                        <DialogTrigger>
                            {flashcards.length > 0 && (
                                <Button variant="outline" onClick={() => setOpenDetail(true)} className="gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600">
                                    <Eye className="w-4 h-4" />
                                    Xem {flashcards.length} từ đã tạo
                                </Button>
                            )}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-hidden">
                            <DialogHeader className="pb-4">
                                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    Xem {flashcards.length} từ đã tạo
                                </DialogTitle>
                                <DialogDescription>
                                    <p>Bấm vào nút Gửi lên server để chúng tôi lưu lại những từ vựng mà bạn đã tạo nhé</p>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[350px] overflow-y-scroll pb-1">
                                {flashcards.length > 0 ? (
                                    flashcards.map((fc, index) => (
                                        <Card key={index} className="relative">
                                            <div
                                                className="absolute text-red-400 dark:text-red-300 top-2 right-2 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                                                onClick={() => setFlashcards(flashcards.filter((_, i) => i !== index))}
                                            >
                                                <X size={16} />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="flex items-center flex-wrap gap-2">
                                                    <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    {fc.title}
                                                    <Badge variant="outline" className="dark:text-white">
                                                        {fc.type_of_word}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-400" onClick={() => speakWord(fc.title, index)}>
                                                        <Volume2 className="w-4 h-4" />
                                                    </Button>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{fc.define}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-white/50">Chưa có từ vựng nào được tạo</p>
                                )}
                            </div>
                            <Separator className="my-4" />
                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    onClick={handleSendData}
                                    disabled={loading}
                                    className="dark:text-white gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    {loading ? <Loading /> : <Send className="w-4 h-4" />}

                                    {loading ? 'Đang gửi...' : 'Lưu vào server'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {flashcards.length > 0 && (
                        <Button
                            type="button"
                            onClick={handleSendData}
                            disabled={loading || flashcards.length === 0}
                            className="dark:text-white gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {loading ? <Loading /> : <Send className="w-4 h-4" />}

                            {loading ? 'Đang gửi...' : 'Lưu vào server'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
