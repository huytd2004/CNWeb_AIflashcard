import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, BookOpen, MessageCircle, Lightbulb, Plus, Trash2, Type, Languages, Pencil } from 'lucide-react'
import { optimizedPromptFCSingle } from '@/lib/optimizedPrompt'
import { toast } from 'sonner'
import type { Flashcard } from '@/types/flashcard'
import flashcardService from '@/services/flashcardService'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import Loading from '@/components/ui/loading'

interface AddVocabularyModalProps {
    isEditOpen: boolean
    setIsEditOpen: (value: boolean) => void
    editFlashcard?: Flashcard // Replace with actual type if available
    setEditFlashcard: (data: any) => void // Replace with actual type if available
    listFlashcard: any // Optional language for the vocabulary
    filteredFlashcards: Flashcard[] // List of flashcards to filter
    setFilteredFlashcards: (flashcards: Flashcard[]) => void // Function to update the filtered flashcards
    setListFlashcard: any
}

interface VocabularyData {
    title: string
    transcription: string
    define: string
    language: string
    type_of_word: string
    example: Array<{
        en: string
        trans: string
        vi: string
    }>
    note: string
}

export default function EditVocaModal({
    isEditOpen,
    setIsEditOpen,
    editFlashcard,
    setEditFlashcard,
    listFlashcard,
    setListFlashcard,
    filteredFlashcards,
    setFilteredFlashcards,
}: AddVocabularyModalProps) {
    const [loading, setLoading] = useState(false)
    const defaultData: VocabularyData = {
        title: '',
        transcription: '',
        define: '',
        language: '',
        type_of_word: 'Từ',
        example: [
            {
                en: '',
                trans: '',
                vi: '',
            },
        ],
        note: '',
    }

    const [formData, setFormData] = useState<VocabularyData>(defaultData)

    // Update formData when editFlashcard changes
    useEffect(() => {
        if (editFlashcard) {
            setFormData({
                title: editFlashcard?.title || '',
                transcription: editFlashcard?.transcription || '',
                define: editFlashcard?.define || '',
                language: listFlashcard?.language || '',
                type_of_word: editFlashcard?.type_of_word || 'Từ',
                example:
                    editFlashcard?.example?.map((ex) => ({
                        en: ex.en || '',
                        trans: ex.trans || '',
                        vi: ex.vi || '',
                    })) || [],
                note: editFlashcard?.note || '',
            })
        }
    }, [editFlashcard, listFlashcard?.language])

    const [isGenerating, setIsGenerating] = useState(false)

    const handleAddExample = () => {
        setFormData((prev) => ({
            ...prev,
            example: [...prev.example, { en: '', trans: '', vi: '' }],
        }))
    }

    const handleRemoveExample = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            example: prev.example.filter((_, i) => i !== index),
        }))
    }

    const handleExampleChange = (index: number, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            example: prev.example.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
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
                setListFlashcard((prev: any) => ({ ...prev, flashcards: [req?.flashcard, ...prev.flashcards] }))
                setEditFlashcard(null)
                setIsEditOpen(false)
                setFormData(defaultData)
            }
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const req = await flashcardService.updatedFlashcard(editFlashcard?._id || '', formData)
            if (req.ok) {
                toast.success('Chỉnh sửa flashcard thành công')
                setIsEditOpen(false)
                setFilteredFlashcards([req?.flashcard, ...filteredFlashcards])
                setFormData(defaultData)
            }
        } catch (error: any) {
            console.error('Error adding vocabulary:', error)
            ToastLogErrror(error)
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
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[92vh]">
                <DialogHeader className="pb-2 md:pb-4">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">Cập nhật từ vựng</DialogTitle>
                    <DialogDescription>
                        <p>Bạn có thể ghi tiếng việt vào và bấm tạo bằng AI, AI sẽ tự động chuyển từ thành tiếng bạn muốn</p>
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[50vh] md:max-h-[60vh]">
                    <div className="space-y-6">
                        {/* Main Word Section */}
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
                                    <div className="flex gap-2">
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                            autoFocus
                                            autoComplete="off"
                                            onKeyDown={handleEnterKey}
                                            placeholder="Nhập từ hoặc câu bằng tiếng việt..."
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAIGenerate}
                                            disabled={isGenerating}
                                            className="dark:text-white gap-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                        >
                                            {isGenerating ? <Loading className="text-white" /> : <Sparkles className="w-4 h-4" />}

                                            {isGenerating ? 'Đang tạo...' : 'Tạo lại bằng AI'}
                                        </Button>
                                    </div>
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

                                <div className="space-y-2">
                                    <Label htmlFor="define" className="text-sm font-medium flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        Nghĩa tiếng Việt
                                        <Badge variant="destructive" className="text-xs">
                                            Bắt buộc
                                        </Badge>
                                    </Label>
                                    <Textarea
                                        id="define"
                                        value={formData.define}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, define: e.target.value }))}
                                        placeholder="Nhập nghĩa tiếng Việt..."
                                        rows={2}
                                        className="resize-none"
                                    />
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
                                {formData.example.map((ex, index) => (
                                    <div key={index} className="space-y-3 p-3 border border-gray-200 rounded-lg bg-white dark:bg-slate-700 dark:border-gray-600">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Ví dụ {index + 1}</span>
                                            {formData.example.length > 1 && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveExample(index)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Input value={ex.en} onChange={(e) => handleExampleChange(index, 'en', e.target.value)} placeholder="Câu ví dụ của ngôn ngữ bạn đang học" />
                                            <Input value={ex.trans} onChange={(e) => handleExampleChange(index, 'trans', e.target.value)} placeholder="Phiên âm..." className="font-mono text-sm" />
                                            <Input value={ex.vi} onChange={(e) => handleExampleChange(index, 'vi', e.target.value)} placeholder="Dịch nghĩa..." />
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
                                    onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                                    placeholder="Thêm ghi chú, mẹo nhớ, hoặc thông tin bổ sung..."
                                    rows={3}
                                    className="resize-none"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <DialogFooter className="gap-2 flex flex-row">
                    <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1 gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={!isFormValid || loading} className="flex-1 gap-2 bg-primary hover:bg-primary/80 text-white">
                        {loading ? <Loading /> : <Pencil className="w-4 h-4" />}
                        Cập nhật từ vựng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
