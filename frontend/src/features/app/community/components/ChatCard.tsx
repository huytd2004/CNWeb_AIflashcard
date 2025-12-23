import { Heart, MessageCircle, Trash } from 'lucide-react'
import { forwardRef, useState } from 'react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { IChatCommunityMessage } from '@/types/community'
import type { IUser } from '@/types/user'
import { Link } from 'react-router-dom'
import handleCompareDate from '@/lib/handleCompareDate'
import PopperEmoji from './PopperEmoji'
import { Button } from '@/components/ui/button'
interface MessageCardProps {
    message: IChatCommunityMessage // Define a more specific type if possible
    ref?: any
    isLastMessage?: boolean
    handleReactIcon: (messageId: string, emoji: string) => void
    setReplyingTo: (reactingTo: IChatCommunityMessage) => void
    handleUnsend: (messageId: string) => void
    user: IUser | null
    PhotoView: any
    inputRef: any
}

const ChatCard = forwardRef<HTMLDivElement, MessageCardProps>(({ message, isLastMessage, handleReactIcon, inputRef, setReplyingTo, handleUnsend, user, PhotoView }, ref) => {
    const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [open, setOpen] = useState(false)
    // ✅ Hiển thị actions khi hover HOẶC khi popover đang mở
    const shouldShowActions = isHovered || emojiPopoverOpen

    return (
        <div
            className="flex items-start gap-3 py-5 px-3 hover:bg-gray-200/10 rounded-xl group"
            id={message?._id}
            ref={isLastMessage ? ref : null}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/profile/${message.userId._id}`} className="block w-10 md:w-12 h-10 md:h-12 relative rounded-full overflow-hidden">
                <img src={message?.userId.profilePicture} alt="" className="absolute w-full h-full object-cover" />
            </Link>
            <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between h-7">
                    <div className="flex items-center gap-2">
                        <Link to={`/profile/${message.userId._id}`} className="font-medium hover:underline">
                            {message?.userId?.displayName}
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{handleCompareDate(message?.timestamp)}</p>
                        {message?.isEdit && <span className="text-xs text-gray-400"> (Đã chỉnh sửa)</span>}
                        {message?.replyTo && (
                            <span className="text-xs text-gray-400 w-[70px]  md:max-w-[350px] truncate">
                                {/* to={`#${message.replyTo._id}`} */}
                                (Trả lời {message?.replyTo?.userId.displayName}:{' '}
                                <Link className="hover:underline hover:text-white/80" to="#">
                                    {message?.replyTo.message}
                                </Link>
                                )
                            </span>
                        )}
                    </div>
                    {/* ✅ Hiển thị actions khi hover hoặc popover mở */}
                    <div className={`items-center gap-2 transition-all duration-200 ${shouldShowActions ? 'flex' : 'hidden'}`}>
                        <PopperEmoji open={emojiPopoverOpen} setOpen={setEmojiPopoverOpen} handleReactIcon={handleReactIcon} messageId={message?._id}>
                            <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md  cursor-pointer text-gray-800 dark:text-white/60 hover:text-white transition-all duration-500 ">
                                <Heart size={14} className="" />
                            </div>
                        </PopperEmoji>
                        <div
                            className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-800 dark:text-white/60 hover:text-white"
                            onClick={() => {
                                setReplyingTo(message)
                                inputRef.current.focus()
                            }}
                        >
                            <MessageCircle size={14} />
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                {(user?.role === 'admin' || user?._id === message?.userId._id) && (
                                    <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-800 dark:text-white/60 hover:text-white">
                                        <Trash size={14} />
                                    </div>
                                )}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Bạn có chắc muốn xóa không</DialogTitle>
                                    <DialogDescription>Bạn sẽ không thể hoàn tác hành động này. Vui lòng xác nhận để tiếp tục.</DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Hủy</Button>
                                    </DialogClose>
                                    <Button
                                        onClick={() => {
                                            handleUnsend(message?._id)
                                            setOpen(false)
                                        }}
                                        className="text-white"
                                    >
                                        Xóa
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="w-full bg-gray-300/50 dark:bg-gray-500/50 px-3 py-2 md:py-3 md:px-5 rounded-md md:rounded-xl">
                    {message?.unsend ? (
                        <p className="break-words whitespace-normal text-xs text-gray-400">Tin nhắn đã bị gỡ...</p>
                    ) : (
                        <p className="break-words whitespace-normal">{message?.message}</p>
                    )}
                </div>
                <PhotoView src={message?.image}>
                    <div className="relative w-full h-full">
                        <div className="">
                            {message?.image && (
                                <img src={message?.image} alt="" width={200} height={200} className=" cursor-pointer hover:opacity-90 transition-all duration-200 object-contain rounded-lg" />
                            )}
                        </div>
                    </div>
                </PhotoView>

                <div className="flex items-center gap-2">
                    {message?.reactions?.map((react, index) => (
                        <div className="flex rounded-full items-center px-3 py-1 bg-slate-300/50 dark:bg-slate-900/50 cursor-pointer " key={index}>
                            <img src={react.emoji} alt="" width={15} height={15} className="" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
})

ChatCard.displayName = 'ChatCard'

export default ChatCard
