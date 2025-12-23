import { LoaderCircle } from 'lucide-react'

interface LoadingProps {
    className?: string
}

export default function Loading({ className = '' }: LoadingProps) {
    return <LoaderCircle className={`h-5 w-5 animate-spin dark:text-white text-gray-500 ${className}`} />
}
