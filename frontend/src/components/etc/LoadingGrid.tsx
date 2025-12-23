import { cn } from '@/lib/utils'
import LoadingIcon from '../ui/loading-icon'

export default function LoadingGrid({ className = '' }: { className?: string }) {
    return (
        <div className={cn(`flex justify-center items-center h-[500px] col-span-full`, className)}>
            <LoadingIcon />
        </div>
    )
}
