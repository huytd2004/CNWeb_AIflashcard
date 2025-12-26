import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/features/admin/components/AdminSidebar'
import AdminHeader from '@/features/admin/components/AdminHeader'

export default function AdminLayout() {
    const { user, isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                // Redirect to login if not authenticated
                navigate('/auth/login?redirect=/admin')
            } else if (user?.role !== 'admin') {
                // Redirect to home if not admin
                navigate('/')
            }
        }
    }, [isAuthenticated, isLoading, user, navigate])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Overlay */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}
            
            {/* Admin Header */}
            <AdminHeader 
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            />
            
            <div className="flex">
                {/* Sidebar */}
                <AdminSidebar 
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />
                
                {/* Main Content */}
                <main className={`flex-1 p-4 md:p-6 mt-16 transition-all duration-300 ${
                    isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                }`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
