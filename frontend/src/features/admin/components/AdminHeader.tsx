import { useAuth } from '@/contexts/AuthContext'
import { Bell, LogOut, Moon, Sun, User, Home, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'

interface AdminHeaderProps {
    isSidebarCollapsed: boolean
    setIsSidebarCollapsed: (value: boolean) => void
    isMobileSidebarOpen: boolean
    setIsMobileSidebarOpen: (value: boolean) => void
}

export default function AdminHeader({ 
    isMobileSidebarOpen,
    setIsMobileSidebarOpen 
}: AdminHeaderProps) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()

    const handleLogout = () => {
        logout()
        navigate('/auth/login')
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
            <div className="flex items-center justify-between h-full px-4 md:px-6">
                {/* Left Side: Menu Button + Logo */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="lg:hidden"
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Logo */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl">
                            A
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Quản trị hệ thống</p>
                        </div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1 cursor-pointer transition-colors">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    {user?.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.displayName} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <User className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                Xem trang cá nhân
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/')}>
                                <Home className="mr-2 h-4 w-4" />
                                Về trang chủ
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 dark:text-red-500 dark:focus:text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
