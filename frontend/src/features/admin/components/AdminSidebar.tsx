import { LayoutDashboard, Users, BookOpen, CircleHelp, FileText, History, TriangleAlert, List, Settings, HelpCircle, X, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AdminSidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    title: 'Users',
    icon: Users,
    path: '/admin/users',
  },
  {
    title: 'Flashcards',
    icon: BookOpen,
    path: '/admin/flashcard',
  },
  {
    title: 'Quizs',
    icon: CircleHelp,
    path: '/admin/quiz',
  },
  {
    title: 'Subject Outline',
    icon: FileText,
    path: '/admin/decuong',
  },
  {
    title: 'Histories',
    icon: History,
    path: '/admin/histories',
  },
  {
    title: 'Reports',
    icon: TriangleAlert,
    path: '/admin/reports',
  },
  {
    title: 'Daily Tasks',
    icon: List,
    path: '/admin/tasks',
  },
  {
    title: 'Error Logs',
    icon: TriangleAlert,
    path: '/admin/errors',
  },
]

const otherMenuItems = [
  {
    title: 'Settings',
    icon: Settings,
    path: '/admin/settings',
    hasArrow: true,
  },
  {
    title: 'Help Center',
    icon: HelpCircle,
    path: '/admin/help',
  },
]

export default function AdminSidebar({ isCollapsed, setIsCollapsed, isMobileOpen, onMobileClose }: AdminSidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn(
                'hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30',
                isCollapsed ? 'w-20' : 'w-64'
            )}>
                {/* Toggle Button - Positioned at right center */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="fixed top-1/2 -translate-y-1/2 z-[100] w-8 h-16 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-r-lg shadow-md flex items-center justify-center transition-all duration-300"
                    style={{ left: isCollapsed ? '68px' : '244px' }}
                    title={isCollapsed ? 'Mở sidebar' : 'Đóng sidebar'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn('w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300', isCollapsed ? 'rotate-0' : 'rotate-180')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <div className="h-full overflow-y-auto">
                    <nav className="p-2 md:p-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200',
                                            'hover:bg-gray-100 dark:hover:bg-gray-700',
                                            isActive
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300',
                                            isCollapsed && 'justify-center'
                                        )
                                    }
                                    title={isCollapsed ? item.title : undefined}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400')} />
                                            {!isCollapsed && <span className="font-medium truncate text-sm">{item.title}</span>}
                                        </>
                                    )}
                                </NavLink>
                            )
                        })}

                        {/* Other Section */}
                        {!isCollapsed && (
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Other</p>
                            </div>
                        )}

                        {otherMenuItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200',
                                            'hover:bg-gray-100 dark:hover:bg-gray-700',
                                            isActive
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300',
                                            isCollapsed && 'justify-center'
                                        )
                                    }
                                    title={isCollapsed ? item.title : undefined}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400')} />
                                            {!isCollapsed && (
                                                <>
                                                    <span className="font-medium truncate text-sm flex-1">{item.title}</span>
                                                    {item.hasArrow && <ChevronRight className="h-4 w-4 text-gray-400" />}
                                                </>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    {!isCollapsed && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                <p>Admin Panel v1.0</p>
                                <p>© 2025 My FlashCard</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside className={cn(
                'lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-transform duration-300 z-40',
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Close Button */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Menu</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMobileClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin'}
                                onClick={onMobileClose}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
                                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-300'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={cn('h-5 w-5', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400')} />
                                        <span className="font-medium text-sm">{item.title}</span>
                                    </>
                                )}
                            </NavLink>
                        )
                    })}

                    {/* Other Section */}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Other</p>
                    </div>

                    {otherMenuItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onMobileClose}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
                                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-300'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={cn('h-5 w-5', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400')} />
                                        <span className="font-medium text-sm flex-1">{item.title}</span>
                                        {item.hasArrow && <ChevronRight className="h-4 w-4 text-gray-400" />}
                                    </>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        <p>Admin Panel v1.0</p>
                        <p>© 2025 My FlashCard</p>
                    </div>
                </div>
            </aside>
        </>
    )
}
