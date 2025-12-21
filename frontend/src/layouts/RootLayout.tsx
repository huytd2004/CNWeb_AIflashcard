import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import useScrollRestoration from '@/hooks/useScrollRestoration'
import { ThemeProvider } from '@/hooks/useTheme'
import { SocketProvider } from '@/contexts/SocketContext'

export default function RootLayout() {
    useScrollRestoration()

    return (
        <AuthProvider>
            <SocketProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <Outlet />
                    <Toaster />
                </ThemeProvider>
            </SocketProvider>
        </AuthProvider>
    )
}
