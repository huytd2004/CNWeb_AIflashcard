import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Upload } from 'lucide-react'
import soService from '@/services/soService'
import toast from 'react-hot-toast'
import ToastLogErrror from '@/components/etc/ToastLogErrror'

interface CreateSODialogProps {
    onSuccess: () => void
}

export default function CreateSODialog({ onSuccess }: CreateSODialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        type: 'txt',
        link: '',
        file_size: 0,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.title) {
            toast.error('Vui lòng nhập tiêu đề')
            return
        }

        try {
            setLoading(true)
            const res = await soService.createSO(formData)
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
                })
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
                    Add Subject Outline
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
                            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="txt">Text (TXT)</SelectItem>
                                    <SelectItem value="docx">Document (DOCX)</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="pptx">PowerPoint (PPTX)</SelectItem>
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
                            <div className="flex gap-2">
                                <Input
                                    id="image"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                                <Button type="button" variant="outline" size="icon">
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                            {formData.image && (
                                <div className="mt-2">
                                    <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            )}
                        </div>

                        {/* Link (for non-text types) */}
                        {formData.type !== 'txt' && (
                            <div className="grid gap-2">
                                <Label htmlFor="link">Link file</Label>
                                <Input
                                    id="link"
                                    placeholder="https://example.com/file.docx"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>
                        )}

                        {/* File Size */}
                        {formData.type !== 'txt' && (
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
