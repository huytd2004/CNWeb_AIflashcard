import { useCallback, useEffect, useState } from 'react'
import { Shield, Trash2, Eye, Calendar, User } from 'lucide-react'
import type { ISO } from '@/types/so'
import soService from '@/services/soService'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import CreateSODialog from '@/features/admin/components/CreateSODialog'

export default function AdminSOPage() {
    const [loading, setLoading] = useState(false)
    const [SOList, setSOList] = useState<ISO[]>([])
    const navigate = useNavigate()

    const fetchSOAdmin = useCallback(async () => {
        try {
            setLoading(true)
            const res = await soService.getSOAdmin()
            if (res.ok) {
                setSOList(res.findText)
            }
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSOAdmin()
    }, [fetchSOAdmin])

    const handleDelete = async (id: string) => {
        try {
            await soService.deleteSOAdmin(id)
            toast.success('Xóa thành công')
            fetchSOAdmin()
        } catch (error) {
            ToastLogErrror(error)
        }
    }

    const handleViewDetail = (slug: string) => {
        navigate(`/decuong/${slug}`)
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-red-500/80 to-orange-500/80 rounded-lg text-white">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Đề cương</h1>
                            <p className="text-gray-500 dark:text-gray-400">Quản lý tất cả đề cương trong hệ thống</p>
                        </div>
                    </div>
                    <CreateSODialog onSuccess={fetchSOAdmin} />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số đề cương</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{SOList.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đề cương dạng Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{SOList.filter((so) => so.type === 'txt').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{SOList.reduce((acc, so) => acc + so.view, 0)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đề cương</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Tiêu đề</TableHead>
                                        <TableHead>Người tạo</TableHead>
                                        <TableHead>Loại</TableHead>
                                        <TableHead>Số câu</TableHead>
                                        <TableHead>Lượt xem</TableHead>
                                        <TableHead>Ngày tạo</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {SOList.map((so) => (
                                        <TableRow key={so._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {so.image && <img src={so.image} alt={so.title} className="w-10 h-10 rounded object-cover" />}
                                                    <span className="line-clamp-2">{so.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    <span>{so.user_id?.displayName || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={so.type === 'txt' ? 'default' : 'secondary'}>{so.type.toUpperCase()}</Badge>
                                            </TableCell>
                                            <TableCell>{so.lenght || 0}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {so.view}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(so.date)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleViewDetail(so.slug)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc chắn muốn xóa đề cương "{so.title}"? Hành động này không thể hoàn tác.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(so._id)}>Xóa</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!loading && SOList.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <Shield className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">Chưa có đề cương nào</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
