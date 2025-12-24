import type React from 'react'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Globe, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { languages } from '@/lib/languageOption'
import type { IEditFlashcard } from '@/types/flashcard'
import flashcardService from '@/services/flashcardService'
interface EditFlashcardModalProps {
    children: React.ReactNode
    editListFlashcard?: any
    listFlashcard: any
    setListFlashcard: any
}

export function EditListFlashcardModal({ children, editListFlashcard, listFlashcard, setListFlashcard }: EditFlashcardModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<IEditFlashcard>()
    useEffect(() => {
        setFormData({
            _id: editListFlashcard?._id || '',
            title: editListFlashcard?.title || '',
            language: editListFlashcard?.language || 'english',
            desc: editListFlashcard?.desc || '',
            public: editListFlashcard?.public || false,
        })
    }, [editListFlashcard])
    const handleSubmit = async () => {
        try {
            setLoading(true)
            const req = await flashcardService.updatedListFlashcards(editListFlashcard?._id, { ...formData })
            // const req = await POST_API("/list-flashcards/" + editListFlashcard?._id, { ...formData }, "PATCH", token)
            // const res = await req?.json()
            if (req.ok) {
                toast.success('Cập nhật thành công', { description: req.message, position: 'top-center' })
                setListFlashcard({ ...listFlashcard, title: formData?.title, language: formData?.language, desc: formData?.desc, public: formData?.public })

                setOpen(false)
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau', { description: error instanceof Error ? error.message : 'Lỗi không xác định' })
        } finally {
            setLoading(false)
        }
    }
    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            _id: prev?._id || '',
            title: prev?.title || '',
            language: prev?.language || 'english',
            desc: prev?.desc || '',
            public: prev?.public || false,
            ...prev,
            [field]: value,
        }))
    }

    const handlePublicChange = (value: string) => {
        setFormData((prev) => ({
            _id: prev?._id || '',
            title: prev?.title || '',
            language: prev?.language || 'english',
            desc: prev?.desc || '',
            ...prev,
            public: value === 'true',
        }))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">Chỉnh sửa bộ flashcard</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4 h-[350px] overflow-y-auto">
                    {/* Tên list từ */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-white/80">
                            Tên bộ flashcard <span className="text-red-500">*</span>
                        </Label>
                        <Input id="title" placeholder="Ví dụ: Từ vựng TOEIC cơ bản" value={formData?.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full" required />
                        <p className="text-xs text-gray-500 dark:text-white/50">Đặt tên mô tả rõ ràng để dễ tìm kiếm sau này</p>
                    </div>

                    {/* Ngôn ngữ */}
                    <div className="space-y-2 hidden">
                        <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-white/80">
                            Ngôn ngữ <span className="text-red-500">*</span>
                        </Label>
                        <Select disabled value={formData?.language} onValueChange={(value) => handleInputChange('language', value)} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn ngôn ngữ chính của bộ flashcard" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        <div className="flex items-center gap-2">
                                            <span>{lang.label}</span>
                                            <span className="text-gray-500 dark:text-white/50">({lang.name})</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-2">
                        <Label htmlFor="desc" className="text-sm font-medium text-gray-700 dark:text-white/80">
                            Mô tả
                        </Label>
                        <Textarea
                            id="desc"
                            placeholder="Mô tả ngắn gọn về nội dung bộ flashcard này..."
                            value={formData?.desc}
                            onChange={(e) => handleInputChange('desc', e.target.value)}
                            className="w-full min-h-[80px] resize-none"
                            maxLength={200}
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 dark:text-white/50">Mô tả giúp người khác hiểu rõ hơn về nội dung</p>
                            <span className="text-xs text-gray-400">{formData?.desc.length}/200</span>
                        </div>
                    </div>

                    {/* Quyền riêng tư */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-white/80">Quyền truy cập</Label>
                        <RadioGroup value={formData?.public.toString()} onValueChange={handlePublicChange} className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50  dark:hover:bg-white/10 cursor-pointer  transition-colors">
                                <RadioGroupItem value="true" id="public" className="mt-1" />
                                <Label htmlFor="public" className="flex-1 block">
                                    <div className="flex items-center gap-2 font-medium cursor-pointer">
                                        <Globe className="w-4 h-4 text-green-600" />
                                        Công khai
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-white/70 mt-1 cursor-pointer">Mọi người có thể tìm thấy và sử dụng bộ flashcard này</p>
                                </Label>
                            </div>

                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50  dark:hover:bg-white/10 cursor-pointer  transition-colors">
                                <RadioGroupItem value="false" id="private" className="mt-1" />
                                <Label htmlFor="private" className="flex-1 block">
                                    <div className="flex items-center gap-2 font-medium cursor-pointer">
                                        <Lock className="w-4 h-4 text-orange-600" />
                                        Riêng tư
                                    </div>
                                    <p className="text-xs  text-gray-600 dark:text-white/70 mt-1 cursor-pointer">Chỉ bạn có thể xem và sử dụng bộ flashcard này</p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Buttons */}
                </div>
                <div className="flex gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                        Hủy
                    </Button>{' '}
                    <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 dark:text-white" disabled={!formData?.title || !formData?.language || loading}>
                        {loading ? 'Đang sửa...' : 'Cập nhật flashcard'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
