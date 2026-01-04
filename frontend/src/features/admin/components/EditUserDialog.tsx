import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit } from 'lucide-react'
import toolService, { type IToolUser } from '@/services/toolService'
import toast from 'react-hot-toast'
import ToastLogErrror from '@/components/etc/ToastLogErrror'

interface EditUserDialogProps {
    user: IToolUser
    onSuccess: () => void
}

export default function EditUserDialog({ user, onSuccess }: EditUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: user.username,
        password: '',
        status: user.status,
        count_login: user.count_login,
        failed_login_attempts: user.failed_login_attempts,
        note: user.note || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.username) {
            toast.error('Username không được để trống')
            return
        }

        if (formData.password && formData.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }

        try {
            setLoading(true)
            const updateData: any = {
                username: formData.username,
                status: formData.status,
                count_login: formData.count_login,
                failed_login_attempts: formData.failed_login_attempts,
                note: formData.note,
            }

            // Only include password if it's not empty
            if (formData.password) {
                updateData.password = formData.password
            }

            await toolService.updateUser(user._id, updateData)
            toast.success('Cập nhật người dùng thành công')
            setOpen(false)
            onSuccess()
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
                    <DialogDescription>Cập nhật thông tin tài khoản người dùng</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-username">
                                Username <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Nhập username"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">
                                Password mới
                                <span className="text-sm text-gray-500 ml-2">(Để trống nếu không đổi)</span>
                            </Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Nhập password mới (tối thiểu 6 ký tự)"
                                minLength={6}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-status">Trạng thái</Label>
                            <Select
                                value={formData.status ? 'true' : 'false'}
                                onValueChange={(value) => setFormData({ ...formData, status: value === 'true' })}
                            >
                                <SelectTrigger id="edit-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Hoạt động</SelectItem>
                                    <SelectItem value="false">Bị khóa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-count">Số lần đăng nhập còn lại</Label>
                            <Input
                                id="edit-count"
                                type="number"
                                min="0"
                                value={formData.count_login}
                                onChange={(e) => setFormData({ ...formData, count_login: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-failed">Số lần đăng nhập thất bại</Label>
                            <Input
                                id="edit-failed"
                                type="number"
                                min="0"
                                max="5"
                                value={formData.failed_login_attempts}
                                onChange={(e) => setFormData({ ...formData, failed_login_attempts: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-sm text-gray-500">Tài khoản sẽ bị khóa khi đạt 5 lần thất bại</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-note">Ghi chú</Label>
                            <Textarea
                                id="edit-note"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                placeholder="Nhập ghi chú (tùy chọn)"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
