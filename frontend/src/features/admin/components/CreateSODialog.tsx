import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import soService from '@/services/soService'
import etcService from '@/services/etcService'
import toast from 'react-hot-toast'
import ToastLogErrror from '@/components/etc/ToastLogErrror'

interface Answer {
    label: string
    text: string
}

interface Question {
    question: string
    answers: Answer[]
    correctAnswer: string
}

interface CreateSODialogProps {
    onSuccess: () => void
}

export default function CreateSODialog({ onSuccess }: CreateSODialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploadingFile, setUploadingFile] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([
        {
            question: '',
            answers: [
                { label: 'A', text: '' },
                { label: 'B', text: '' },
                { label: 'C', text: '' },
                { label: 'D', text: '' },
            ],
            correctAnswer: 'A',
        },
    ])
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        type: 'txt',
        link: '',
        file_size: 0,
        fileName: '',
    })

    const isTextType = formData.type === 'txt'

    const hasValidQuestions = useMemo(() => {
        if (!isTextType) return true
        const cleaned = questions.filter((q) => q.question.trim() || q.answers.some((a) => a.text.trim()))
        if (cleaned.length === 0) return false
        return cleaned.every((q) => q.question.trim().length > 0 && q.answers.every((a) => a.text.trim().length > 0) && q.correctAnswer)
    }, [isTextType, questions])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        const allowedExtensions = ['pdf', 'docx', 'xlsx']
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
            toast.error('Chỉ chấp nhận file PDF, DOCX, XLSX')
            return
        }

        if (file.size > 50 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 50MB')
            return
        }

        try {
            setUploadingFile(true)
            const formDataUpload = new FormData()
            formDataUpload.append('file', file)
            
            const res = await etcService.uploadFile(formDataUpload)
            if (res.url) {
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
                setFormData((prev) => ({
                    ...prev,
                    link: res.url,
                    file_size: parseFloat(fileSizeMB),
                    fileName: file.name,
                    type: fileExtension || prev.type,
                }))
                toast.success('Upload file thành công')
            }
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setUploadingFile(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title) {
            toast.error('Vui lòng nhập tiêu đề')
            return
        }

        if (isTextType && !hasValidQuestions) {
            toast.error('Vui lòng nhập đầy đủ câu hỏi, tất cả đáp án và chọn đáp án đúng')
            return
        }

        if (!isTextType) {
            if (!formData.link.trim()) {
                toast.error('Vui lòng upload file hoặc nhập link file')
                return
            }
            if (formData.file_size < 0) {
                toast.error('Kích thước file không hợp lệ')
                return
            }
        }

        try {
            setLoading(true)
            const payload: any = {
                title: formData.title,
                content: formData.content,
                image: formData.image,
                type: formData.type,
            }

            if (isTextType) {
                // Convert to old format: { question, answer }
                // answer format: "A. text|B. text|C. text|D. text|correct:A"
                payload.quest = questions.map((q) => ({
                    question: q.question,
                    answer: q.answers.map((a) => `${a.label}. ${a.text}`).join('|') + `|correct:${q.correctAnswer}`,
                }))
            } else {
                payload.link = formData.link
                payload.file_size = formData.file_size
            }

            const res = await soService.createSO(payload)
            if (res.ok) {
                toast.success(res.message || 'Tạo đề cương thành công')
                setOpen(false)
                setFormData({
                    title: '',
                    content: '',
                    image: '',
                    type: 'txt',
                    link: '',
                    file_size: 0,
                    fileName: '',
                })
                setQuestions([
                    {
                        question: '',
                        answers: [
                            { label: 'A', text: '' },
                            { label: 'B', text: '' },
                            { label: 'C', text: '' },
                            { label: 'D', text: '' },
                        ],
                        correctAnswer: 'A',
                    },
                ])
                onSuccess()
            }
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm đề cương
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo đề cương mới</DialogTitle>
                    <DialogDescription>Điền thông tin để tạo đề cương mới trong hệ thống</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                Tiêu đề <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Nhập tiêu đề đề cương..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="grid gap-2">
                            <Label htmlFor="type">Loại đề cương</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => {
                                    setFormData({ ...formData, type: value })
                                    if (value !== 'txt') {
                                        setQuestions([
                                            {
                                                question: '',
                                                answers: [
                                                    { label: 'A', text: '' },
                                                    { label: 'B', text: '' },
                                                    { label: 'C', text: '' },
                                                    { label: 'D', text: '' },
                                                ],
                                                correctAnswer: 'A',
                                            },
                                        ])
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="txt">Text (TXT)</SelectItem>
                                    <SelectItem value="docx">Document (DOCX)</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Content */}
                        <div className="grid gap-2">
                            <Label htmlFor="content">Nội dung</Label>
                            <Textarea
                                id="content"
                                placeholder="Nhập mô tả hoặc nội dung đề cương..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={4}
                            />
                        </div>

                        {/* Image URL */}
                        <div className="grid gap-2">
                            <Label htmlFor="image">Hình ảnh (URL)</Label>
                            <Input id="image" placeholder="https://example.com/image.jpg" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                            {formData.image && (
                                <div className="mt-2">
                                    <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            )}
                        </div>

                        {/* Questions (for txt) */}
                        {isTextType && (
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label>Danh sách câu hỏi</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setQuestions((prev) => [
                                                ...prev,
                                                {
                                                    question: '',
                                                    answers: [
                                                        { label: 'A', text: '' },
                                                        { label: 'B', text: '' },
                                                        { label: 'C', text: '' },
                                                        { label: 'D', text: '' },
                                                    ],
                                                    correctAnswer: 'A',
                                                },
                                            ])
                                        }
                                        disabled={loading}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm câu
                                    </Button>
                                </div>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {questions.map((q, idx) => (
                                        <div key={idx} className="rounded-lg border p-4 grid gap-3 bg-gray-50 dark:bg-gray-900">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Câu {idx + 1}</p>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== idx))}
                                                    disabled={loading || questions.length === 1}
                                                    title="Xóa câu"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor={`q-${idx}`} className="font-medium">
                                                    Câu hỏi <span className="text-red-500">*</span>
                                                </Label>
                                                <Textarea
                                                    id={`q-${idx}`}
                                                    placeholder="Nhập câu hỏi..."
                                                    value={q.question}
                                                    onChange={(e) =>
                                                        setQuestions((prev) => prev.map((item, i) => (i === idx ? { ...item, question: e.target.value } : item)))
                                                    }
                                                    rows={2}
                                                    className="resize-none"
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label className="font-medium">
                                                    Các đáp án <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="space-y-2">
                                                    {q.answers.map((answer, aIdx) => (
                                                        <div key={aIdx} className="flex items-start gap-2">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-sm min-w-[24px]">{answer.label}.</span>
                                                                    <Input
                                                                        placeholder={`Nhập đáp án ${answer.label}...`}
                                                                        value={answer.text}
                                                                        onChange={(e) =>
                                                                            setQuestions((prev) =>
                                                                                prev.map((item, i) =>
                                                                                    i === idx
                                                                                        ? {
                                                                                              ...item,
                                                                                              answers: item.answers.map((a, j) => (j === aIdx ? { ...a, text: e.target.value } : a)),
                                                                                          }
                                                                                        : item
                                                                                )
                                                                            )
                                                                        }
                                                                        className="flex-1"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid gap-2 pt-2 border-t">
                                                <Label className="font-medium">
                                                    Đáp án đúng <span className="text-red-500">*</span>
                                                </Label>
                                                <RadioGroup
                                                    value={q.correctAnswer}
                                                    onValueChange={(value) =>
                                                        setQuestions((prev) => prev.map((item, i) => (i === idx ? { ...item, correctAnswer: value } : item)))
                                                    }
                                                >
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {q.answers.map((answer) => (
                                                            <div key={answer.label} className="flex items-center space-x-2">
                                                                <RadioGroupItem value={answer.label} id={`correct-${idx}-${answer.label}`} />
                                                                <Label htmlFor={`correct-${idx}-${answer.label}`} className="cursor-pointer font-semibold">
                                                                    {answer.label}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {!hasValidQuestions && <p className="text-sm text-red-500">Vui lòng nhập đầy đủ câu hỏi, tất cả đáp án và chọn đáp án đúng.</p>}
                            </div>
                        )}

                        {/* Link (for non-text types) */}
                        {!isTextType && (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Upload file từ máy</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="file"
                                            accept=".pdf,.docx,.xlsx"
                                            onChange={handleFileUpload}
                                            disabled={uploadingFile || loading}
                                            className="cursor-pointer"
                                        />
                                        <Button type="button" variant="outline" disabled={uploadingFile} className="whitespace-nowrap">
                                            <Upload className="mr-2 h-4 w-4" />
                                            {uploadingFile ? 'Đang tải...' : 'Upload'}
                                        </Button>
                                    </div>
                                    {formData.fileName && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                            <span>✓ {formData.fileName}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        link: '',
                                                        fileName: '',
                                                        file_size: 0,
                                                    }))
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">Chấp nhận: PDF, DOCX, XLSX (tối đa 50MB)</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="link">Nhập link file trực tiếp</Label>
                                    <Input
                                        id="link"
                                        placeholder="https://example.com/file.pdf"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value, fileName: '' })}
                                        disabled={uploadingFile || loading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* File Size */}
                        {!isTextType && (
                            <div className="grid gap-2">
                                <Label htmlFor="file_size">Kích thước file (MB)</Label>
                                <Input
                                    id="file_size"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0"
                                    value={formData.file_size}
                                    onChange={(e) => setFormData({ ...formData, file_size: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                            {loading ? 'Đang tạo...' : 'Tạo đề cương'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
