import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
export default function DataEmptyNoti({ title, message }: { title: string; message: string }) {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="dark:text-gray-400  text-gray-600">{message}</p>
            <Button variant={'outline'} className="mt-6" onClick={() => navigate(-1)}>
                <ChevronLeft />
                Quay về
            </Button>
        </div>
    )
}
