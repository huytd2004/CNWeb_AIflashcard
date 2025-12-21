import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

export default function AuthLayout() {
    return (
        <div>
            <div className="min-h-screen flex items-center justify-center dark:bg-slate-700/30 bg-white w-full ">
                <Outlet />
            </div>
            <Toaster />
        </div>
    )
}
