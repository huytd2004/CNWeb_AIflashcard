import React, { useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Props {
    children: React.ReactNode
    open?: boolean
    setOpen?: (open: boolean) => void
    messageId: string
    handleReactIcon: (messageId: string, emoji: string) => void
}

export default function PopperEmoji({ children, open, setOpen, messageId, handleReactIcon }: Props) {
    const handleEmojiClick = (emoji: string) => {
        handleReactIcon(messageId, emoji)
        setOpen?.(false) // Đóng popover sau khi chọn emoji
    }
    const reactIconList = useMemo(
        () => [
            'https://static.xx.fbcdn.net/images/emoji.php/v9/tb6/1/32/1f44d.png',
            'https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png',
            'https://static.xx.fbcdn.net/images/emoji.php/v9/t8e/1/32/1f606.png',
            'https://static.xx.fbcdn.net/images/emoji.php/v9/t7b/1/32/1f62e.png',
            'https://static.xx.fbcdn.net/images/emoji.php/v9/tc8/1/32/1f622.png',
            'https://static.xx.fbcdn.net/images/emoji.php/v9/t47/1/32/1f621.png',
        ],
        []
    )
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent className="w-80 p-2 dark:border-white/10" side="top" align="end">
                <div className="grid grid-cols-6 gap-2">
                    {reactIconList.map((emoji, index) => (
                        <button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="hover:bg-white/10 rounded-full flex items-center justify-center py-2 transition-all duration-300 group"
                            type="button"
                        >
                            <img src={emoji} alt="" width={25} height={20} className="group-hover:scale-125 transition-all duration-200" />
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
