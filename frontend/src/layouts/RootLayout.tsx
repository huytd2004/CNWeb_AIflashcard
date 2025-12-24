import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import useScrollRestoration from '@/hooks/useScrollRestoration'
import { ThemeProvider } from '@/hooks/useTheme'
import { SocketProvider } from '@/contexts/SocketContext'
import { EffectProvider } from '@/features/app/tools/context/EffectContext'

export default function RootLayout() {
    useScrollRestoration()

    return (
        <EffectProvider>
            <AuthProvider>
                <SocketProvider>
                    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                        <Outlet />
                        <Toaster />
                    </ThemeProvider>
                </SocketProvider>
            </AuthProvider>
        </EffectProvider>
    )
}
