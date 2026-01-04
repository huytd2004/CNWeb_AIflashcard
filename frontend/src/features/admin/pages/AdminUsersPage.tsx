import { useCallback, useEffect, useState } from 'react'
import { Trash2, Search, ChevronLeft, ChevronRight, Edit, UserPlus, Lock, Unlock, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react'
import toolService, { type IToolUser } from '@/services/toolService'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import CreateUserDialog from '@/features/admin/components/CreateUserDialog'
import EditUserDialog from '@/features/admin/components/EditUserDialog'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function AdminUsersPage() {
    const [loading, setLoading] = useState(false)
    const [userList, setUserList] = useState<IToolUser[]>([])
    const [filteredUsers, setFilteredUsers] = useState<IToolUser[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const res = await toolService.getUsers()
            setUserList(res)
            setFilteredUsers(res)
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    // Filter users based on search
    useEffect(() => {
        if (!search.trim()) {
            setFilteredUsers(userList)
            setPage(1)
            return
        }

        const filtered = userList.filter((user) => 
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.note?.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredUsers(filtered)
        setPage(1)
    }, [search, userList])

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const currentUsers = filteredUsers.slice(startIndex, endIndex)

    const handleDelete = async (id: string) => {
        try {
            await toolService.deleteUser(id)
            toast.success('Xóa người dùng thành công')
            fetchUsers()
        } catch (error) {
            ToastLogErrror(error)
        }
    }

    const handleToggleStatus = async (user: IToolUser) => {
        try {
            await toolService.updateUser(user._id, { status: !user.status })
            toast.success(user.status ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản')
            fetchUsers()
        } catch (error) {
            ToastLogErrror(error)
        }
    }

    const handleResetLoginAttempts = async (user: IToolUser) => {
        try {
            await toolService.updateUser(user._id, { failed_login_attempts: 0, status: true })
            toast.success('Đã reset số lần đăng nhập thất bại')
            fetchUsers()
        } catch (error) {
            ToastLogErrror(error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản Lý Người Dùng Tool</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý tài khoản người dùng sử dụng tool</p>
                </div>
                <CreateUserDialog onSuccess={fetchUsers} />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng Người Dùng</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userList.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang Hoạt Động</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {userList.filter(u => u.status).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bị Khóa</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {userList.filter(u => !u.status).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hết Lượt Dùng</CardTitle>
                        <Lock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {userList.filter(u => u.count_login <= 0).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm theo username hoặc ghi chú..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : currentUsers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            {search ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Số lần dùng</TableHead>
                                            <TableHead>Đăng nhập sai</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Hoạt động gần nhất</TableHead>
                                            <TableHead>Ghi chú</TableHead>
                                            <TableHead className="text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentUsers.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell className="font-medium">{user.username}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.status ? 'default' : 'destructive'}>
                                                        {user.status ? 'Hoạt động' : 'Bị khóa'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.count_login > 0 ? 'default' : 'destructive'}>
                                                        {user.count_login}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={user.failed_login_attempts >= 5 ? 'destructive' : user.failed_login_attempts > 0 ? 'outline' : 'default'}
                                                    >
                                                        {user.failed_login_attempts}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                    {user.active_date ? (
                                                        formatDistanceToNow(new Date(user.active_date), { addSuffix: true, locale: vi })
                                                    ) : (
                                                        'Chưa đăng nhập'
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
                                                    {user.note || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <EditUserDialog user={user} onSuccess={fetchUsers} />
                                                        
                                                        {user.failed_login_attempts > 0 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleResetLoginAttempts(user)}
                                                                title="Reset số lần đăng nhập sai"
                                                            >
                                                                <Lock className="h-4 w-4" />
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant={user.status ? 'destructive' : 'default'}
                                                            size="sm"
                                                            onClick={() => handleToggleStatus(user)}
                                                            title={user.status ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                                        >
                                                            {user.status ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                                        </Button>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Bạn có chắc chắn muốn xóa người dùng "{user.username}"? Hành động này không thể hoàn tác.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(user._id)} className="bg-red-600 hover:bg-red-700">
                                                                        Xóa
                                                                    </AlertDialogAction>
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                                <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)} className="min-w-[2.5rem]">
                                                    {p}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
