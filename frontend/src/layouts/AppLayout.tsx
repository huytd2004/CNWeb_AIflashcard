import CFooter from '@/features/app/home/CFooter'
import CHeader from '@/features/app/home/CHeader'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
    return (
        <div className="">
            <CHeader />
            <main className="relative">
                <Outlet />
            </main>
            <CFooter />
        </div>
    )
}
