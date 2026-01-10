import { SidebarProvider } from '@/components/ui/sidebar'
import { AuthProvider } from '@/contexts/AuthContext'
import { SideBarAICenter } from '@/features/app/ai-center/components/SideBarAICenter'
import CFooter from '@/features/app/home/CFooter'
import CHeader from '@/features/app/home/CHeader'
import { Outlet } from 'react-router-dom'

export default function AICenterLayout() {
    return (
        <div className="">
            <CHeader />
            <AuthProvider>
                <SidebarProvider>
                    <div className="flex min-h-screen w-full bg-gray-200/80  dark:bg-inherit">
                        <SideBarAICenter />
                        <main className="flex-1 overflow-auto py-6 ">
                            <Outlet />
                        </main>
                    </div>
                </SidebarProvider>
            </AuthProvider>
        </div>
    )
}
