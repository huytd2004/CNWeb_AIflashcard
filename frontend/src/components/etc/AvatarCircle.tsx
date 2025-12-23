import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
export default function AvatarCircle({ user, className }: { user?: any; className?: string }) {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div
                    className={cn(
                        `w-12 h-12 bg-linear-to-br from-sky-200 to-purple-200 dark:from-primary/80 dark:to-purple-700/80 rounded-full flex items-center justify-center cursor-pointer`,
                        className
                    )}
                >
                    {user && user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="dark:bg-slate-500 dark:text-white text-lg">
                            {user?.displayName
                                ?.split(' ')
                                .map((n: string) => n[0])
                                .join('') || 'N/A'}
                        </span>
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent className="">
                <p>{user?.displayName}</p>
                <Link to={`mailto:${user?.email}`}>{user?.email}</Link>
            </TooltipContent>
        </Tooltip>
    )
}
