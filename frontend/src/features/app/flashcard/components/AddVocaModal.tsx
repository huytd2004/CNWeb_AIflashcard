import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, MessageCircle, Lightbulb, Plus, Trash2, Type, Languages } from 'lucide-react'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import flashcardService from '@/services/flashcardService'
import { optimizedPromptFCSingle } from '@/lib/optimizedPrompt'
import Loading from '@/components/ui/loading'

interface AddVocabularyModalProps {
    children: React.ReactNode
    listFlashcard?: any
    filteredFlashcards: any
    setFilteredFlashcards: any
    setListFlashcard: any
}

interface VocabularyData {
    title: string
    transcription: string
    define: string
    language: string
    type_of_word: string
    examples: Array<{
        en: string
        trans: string
        vi: string
    }>
    note: string
}

export default function AddVocaModal({ children, listFlashcard, setListFlashcard, filteredFlashcards, setFilteredFlashcards }: AddVocabularyModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const defaultData: VocabularyData = {
        title: '',
        transcription: '',
        define: '',
        language: listFlashcard?.language || '',
        type_of_word: '',
        examples: [{ en: '', trans: '', vi: '' }],
        note: '',
    }
    const [formData, setFormData] = useState<VocabularyData>(defaultData)

    const [isGenerating, setIsGenerating] = useState(false)

    const handleAddExample = () => {
        setFormData((prev) => ({
            ...prev,
            examples: [...prev.examples, { en: '', trans: '', vi: '' }],
        }))
    }

    const handleRemoveExample = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            examples: prev.examples.filter((_, i) => i !== index),
        }))
    }

    const handleExampleChange = (index: number, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            examples: prev.examples.map((example, i) => (i === index ? { ...example, [field]: value } : example)),
        }))
    }

    const handleAIGenerate = async (e: any) => {
        e.preventDefault()
        try {
            const optimizedPrompt = optimizedPromptFCSingle(formData.title, listFlashcard?.language)
            setIsGenerating(true)
            const req = await flashcardService.createFlashcardWithAI({
                prompt: optimizedPrompt,
                list_flashcard_id: listFlashcard._id,
                language: listFlashcard?.language || '',
            })

            if (req.ok) {
                toast.success('Tạo flashcard thành công từ AI')

                setFilteredFlashcards([req?.flashcard, ...filteredFlashcards])
                setListFlashcard((prev: any) => ({
                    ...prev,
                    flashcards: [req?.flashcard, ...prev.flashcards],
                }))
                setOpen(false)
                // Reset form data with AI generated content
                setFormData(defaultData)
                // 4. Revalidate cache
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau', {
                description: error instanceof Error ? error.message : 'Lỗi không xác định',
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const req = await flashcardService.createFlashcard({ ...formData, list_flashcard_id: listFlashcard._id })

            if (req.ok) {
                toast.success('Tạo flashcard thành công')
                setOpen(false)
                setListFlashcard((prev: any) => ({
                    ...prev,
                    flashcards: [req?.flashcard, ...prev.flashcards],
                }))
                setFilteredFlashcards([req?.flashcard, ...filteredFlashcards])
                setFormData(defaultData)
            }
        } catch (error) {
            console.error('Error adding vocabulary:', error)
            toast.error('Đã có lỗi xảy ra khi thêm từ vựng', {
                description: error instanceof Error ? error.message : 'Lỗi không xác định',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleAIGenerate(e)
        }
    }

    const isFormValid = formData.title.trim() && formData.define.trim()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-hidden p-3 md:p-6">
                <DialogHeader className="pb-2 md:pb-4">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">Thêm từ vựng mới</DialogTitle>
                    <DialogDescription>
                        <p>Bạn có thể ghi tiếng việt vào và bấm tạo bằng AI, AI sẽ tự động chuyển từ thành tiếng bạn muốn</p>
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[60vh] pr-2">
                    <div className="space-y-6">
                        {/* AI create */}
                        <Card className="border-blue-100 bg-blue-50/30 dark:bg-slate-800/50 dark:border-white/10">
                            <CardHeader className="">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    Nhập từ bằng AI
                                    <Badge variant="destructive" className="text-xs">
                                        Bắt buộc
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="">
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                            autoFocus
                                            autoComplete="off"
                                            onKeyDown={handleEnterKey}
                                            placeholder="Nhập từ hoặc câu bằng tiếng việt..."
                                            className="flex-1 h-12 py-3"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAIGenerate}
                                            disabled={isGenerating}
                                            className="dark:text-white gap-2 bg-linear-to-br from-blue-700/60 to-purple-700/80 h-12"
                                        >
                                            {isGenerating ? <Loading className="text-white" /> : <Sparkles className="w-4 h-4" />}

                                            {isGenerating ? 'Đang tạo...' : 'Tạo bằng AI'}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">*Nhập xong bấm vào nút tạo bằng AI hoặc bấm Enter</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Nhập thủ công</AccordionTrigger>
                                <AccordionContent className="space-y-5">
                                    <Card className="border-blue-100 bg-blue-50/30 dark:bg-slate-800/50 dark:border-white/10">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                Từ vựng chính
                                                <Badge variant="destructive" className="text-xs">
                                                    Bắt buộc
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title" className="text-sm font-medium">
                                                    Từ
                                                </Label>
                                                <Input
                                                    id="title"
                                                    value={formData.title}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            title: e.target.value,
                                                        }))
                                                    }
                                                    autoFocus
                                                    autoComplete="off"
                                                    onKeyDown={handleEnterKey}
                                                    placeholder="Nhập từ hoặc câu bằng tiếng việt..."
                                                    className="flex-1"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="transcription" className="text-sm font-medium flex items-center gap-1">
                                                        <Languages className="w-3 h-3" />
                                                        Phiên âm (transcription)
                                                    </Label>
                                                    <Input
                                                        id="transcription"
                                                        value={formData.transcription}
                                                        onChange={(e) => setFormData((prev) => ({ ...prev, transcription: e.target.value }))}
                                                        placeholder="Nhập phiên âm..."
                                                        className="flex-1 font-mono"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="type_of_word" className="text-sm font-medium">
                                                        Loại từ
                                                    </Label>
                                                    <Select value={formData.type_of_word} onValueChange={(value) => setFormData((prev) => ({ ...prev, type_of_word: value }))}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn loại từ..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Từ">Từ</SelectItem>
                                                            <SelectItem value="Câu">Câu</SelectItem>
                                                            <SelectItem value="Cụm từ">Cụm từ</SelectItem>
                                                            <SelectItem value="Thành ngữ">Thành ngữ</SelectItem>
                                                            <SelectItem value="Câu hỏi">Câu hỏi</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    {/* Examples Section */}
                                    <Card className="border-green-100 bg-green-50/30 dark:border-white/10 dark:bg-slate-800/50">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4 text-green-600" />
                                                Ví dụ
                                                <Badge variant="secondary" className="text-xs">
                                                    Tùy chọn
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {formData.examples.map((example, index) => (
                                                <div key={index} className="space-y-3 p-3 border border-gray-200 rounded-lg bg-white dark:bg-slate-700 dark:border-gray-600">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Ví dụ {index + 1}</span>
                                                        {formData.examples.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveExample(index)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Input
                                                            value={example.en}
                                                            onChange={(e) => handleExampleChange(index, 'en', e.target.value)}
                                                            placeholder="Câu ví dụ của ngôn ngữ bạn đang học"
                                                        />
                                                        <Input
                                                            value={example.trans}
                                                            onChange={(e) => handleExampleChange(index, 'trans', e.target.value)}
                                                            placeholder="Phiên âm..."
                                                            className="font-mono text-sm"
                                                        />
                                                        <Input value={example.vi} onChange={(e) => handleExampleChange(index, 'vi', e.target.value)} placeholder="Dịch nghĩa..." />
                                                    </div>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleAddExample}
                                                className="w-full gap-2 border-dashed border-green-300 text-green-700 dark:text-green-300 hover:bg-green-50 dark:bg-green-800/50 hover:opacity-85"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Thêm ví dụ
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* note Section */}
                                    <Card className="border-amber-100 bg-amber-50/30 dark:border-white/10 dark:bg-slate-800/50">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4 text-amber-600" />
                                                Ghi chú
                                                <Badge variant="secondary" className="text-xs">
                                                    Tùy chọn
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Textarea
                                                value={formData.note}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        note: e.target.value,
                                                    }))
                                                }
                                                placeholder="Thêm ghi chú, mẹo nhớ, hoặc thông tin bổ sung..."
                                                rows={3}
                                                className="resize-none"
                                            />
                                        </CardContent>
                                    </Card>
                                    <div className="flex items-center justify-end gap-2 mt-4">
                                        <Button onClick={handleSubmit} disabled={!isFormValid || loading} className="gap-2 flex-1 text-white">
                                            {loading ? <Loading /> : <Plus className="w-4 h-4" />}
                                            Thêm từ vựng
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
