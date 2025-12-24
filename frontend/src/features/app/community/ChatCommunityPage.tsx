import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'

import { Bell, ChevronRight, CodeXml, Crown, EllipsisVertical, Flame, Hash, ImagePlus, Minus, Search, Send, Smile, Users, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TokenStorage, useAuth } from '@/contexts/AuthContext'
import type { IChatCommunityMessage } from '@/types/community'
import { useSocket } from '@/contexts/SocketContext'
import type { IPodiumUser } from '@/types/etc'
import chatComService from '@/services/chatComService'
import etcService from '@/services/etcService'
import Loading from '@/components/ui/loading'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'
import type { IUser } from '@/types/user'
import ChatCard from './components/ChatCard'

export default function ChatCommunityPage() {
    const { user } = useAuth()
    const lastMessageRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<IChatCommunityMessage[]>([])
    const { socket, onlineUsers } = useSocket()
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null) // tham chiếu đến input
    const [messageInput, setMessageInput] = useState('') // State để quản lý giá trị input
    const [image, setImage] = useState('')
    const [imageReview, setImageReview] = useState<string | null>(null)
    const [replyingTo, setReplyingTo] = useState<IChatCommunityMessage | null>(null) // quản lí trạng thái đang trả lời tin nhắn nào
    const [podiumUsers, setPodiumUsers] = useState<IPodiumUser[]>([])
    // const [pagination, setPagination] = useState<IPagination>({ currentPage: 1, totalPages: 1, itemsPerPage: 8, totalItems: 0, hasNextPage: false, hasPrevPage: false })
    // const [currentPage, setCurrentPage] = useState(1)
    const fetchInitialMessages = useCallback(async () => {
        setLoading(true)
        const req = await chatComService.getPublicChat({ currentPage: 1, itemsPerPage: 50 })
        if (req.ok) {
            const sortedMessages = req.publicChat.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            setMessages(sortedMessages)
            const podium = req?.podiumUsers || []
            // Sắp xếp lại thứ tự hiển thị: top 2, top 1, top 3
            const reorderedPodiumUsers =
                podium && podium.length >= 3
                    ? [podium[1], podium[0], podium[2]] // Đổi vị trí: 2nd, 1st, 3rd
                    : podium
            setPodiumUsers(reorderedPodiumUsers)
            // setHasMore(req?.hasMore);
            // setSkip(50);
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchInitialMessages()

        return () => {
            // Cleanup if needed
        }
    }, [])

    useEffect(() => {
        // ✅ Dùng setTimeout để đảm bảo DOM đã render
        const scrollToBottom = () => {
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end', // ✅ Scroll đến cuối element
                })
            }
        }

        // ✅ Timeout để đảm bảo DOM update xong
        const timeoutId = setTimeout(scrollToBottom, 100)

        return () => clearTimeout(timeoutId)
    }, [messages])

    const messageHandlers = useMemo(
        () => ({
            updateMessages: (newMessage: { _id: string; [key: string]: any }) => {
                setMessages((prev: any) => [...prev, newMessage]) // Sử dụng setMessages thay vì setChatState
            },
            handleUnsend: (messageId: string) => {
                setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)))
            },
            handleReact: (messageId: string, reactions: any) => {
                setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, reactions: reactions } : msg)))
            },
        }),
        []
    )

    useEffect(() => {
        if (!socket) return

        socket.on('newMessageCommu', messageHandlers.updateMessages)
        socket.on('replyUnsendMessageCommu', messageHandlers.handleUnsend)
        socket.on('replyReactMessageCommu', messageHandlers.handleReact)

        return () => {
            socket.off('newMessageCommu', messageHandlers.updateMessages)
            socket.off('replyUnsendMessageCommu', messageHandlers.handleUnsend)
            socket.off('replyReactMessageCommu', messageHandlers.handleReact)
        }
    }, [socket, messageHandlers])

    const handleSendMessage = useCallback(async () => {
        if (!messageInput.trim()) {
            toast.error('Vui lòng nhập nội dung tin nhắn', {
                position: 'top-center',
                duration: 3000,
            })
            return
        }
        setLoading(true)
        try {
            let imageUrl = ''
            if (image) {
                toast.loading('Đang tải hình ảnh lên server', {
                    duration: 2000,
                    position: 'top-center',
                    id: 'upload-image',
                })
                const formData = new FormData()

                formData.append('image', image)
                const uploadResponse = await etcService.uploadImage(formData)
                imageUrl = uploadResponse?.data?.url
            }

            const messageData = {
                userId: user?._id,
                message: messageInput,
                token: TokenStorage.getCookieToken(),
                image: imageUrl,
                replyTo: replyingTo,
            }
            socket?.emit('sendMessageCommu', messageData)
            setMessageInput('')
            setImage('')
            setImageReview(null)
            setReplyingTo(null)
            toast.success('Thành công', {
                duration: 2000,
                position: 'top-center',
                id: 'upload-image',
            })
        } catch (error: any) {
            toast.error('Lỗi khi gửi tin nhắn', {
                description: error.message,
                position: 'top-center',
                duration: 10000,
            })
            console.error('Error sending message:', error)
        } finally {
            setLoading(false)
        }
    }, [messageInput, image, user, replyingTo, socket])

    const handleUnsend = async (messageId: string) => {
        try {
            setLoading(true)
            socket?.emit('unsendMessageCommu', {
                messageId,
                token: TokenStorage.getCookieToken(),
                userId: user?._id,
            })
            // const req = await POST_API(`/chatcommu/unsend`, { messageId, userId: user?._id }, "POST", token);
            // const res = await req?.json();
            // if (res.ok) {
            //     setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === messageId ? { ...msg, unsend: true } : msg)));
            // }
        } catch (error: any) {
            toast.error('Lỗi khi gỡ tin nhắn', {
                description: error.message,
                position: 'top-center',
                duration: 10000,
            })
            console.error('Error sending message:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleReactIcon = async (messageId: string, emoji: any) => {
        try {
            if (!user) return
            socket?.emit('reactMessageCommu', {
                messageId,
                token: TokenStorage.getCookieToken(),

                userId: user?._id,
                emoji,
            })
            // const req = await POST_API(`/chatcommu/react`, { messageId, userId: user._id, emoji }, "POST", token);
            // if (req) {
            //     const res = await req.json();
            //     if (res.ok) {
            //         setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === messageId ? { ...msg, reactions: res.reactions } : msg)));
            //     }
            // }
        } catch (error: any) {
            toast.error('Lỗi khi thả cảm xúc ' + error.message)
            console.error('Error sending message:', error)
        }
    }

    const handlePaste = (event: any) => {
        const items = event.clipboardData.items
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.includes('image')) {
                const blob = items[i].getAsFile()
                const url = URL.createObjectURL(blob)
                setImage(blob)
                setImageReview(url)
                break
            }
        }
    }

    const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value)
    }, [])

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && messageInput.trim()) {
                handleSendMessage()
            }
        },
        [handleSendMessage, messageInput]
    )

    const handleImageChange = (e: any) => {
        const file = e.target.files[0]
        setImage(file)
        setImageReview(file ? URL.createObjectURL(file) : null)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const getPodium = (index: number) => {
        switch (index) {
            case 0: // top 2 (vị trí đầu tiên trong mảng nhưng hiển thị bên trái)
                return 'h-16 bg-gray-400 dark:bg-gray-600 group-hover:bg-gray-700'
            case 1: // top 1 (vị trí thứ hai trong mảng nhưng hiển thị ở giữa)
                return 'h-20 bg-yellow-500 dark:bg-yellow-600 group-hover:bg-yellow-700'
            case 2: // top 3 (vị trí thứ ba trong mảng và hiển thị bên phải)
                return 'h-12 bg-amber-600 dark:bg-amber-700 group-hover:bg-amber-800'
            default:
                return 'h-12 bg-gray-300'
        }
    }

    const getIconLevel = (level: number) => {
        if (level <= 3) {
            return '/icon-level/crystal_lv1_1-3.svg' // Default icon for invalid levels
        }
        if (level <= 6) {
            return `/icon-level/crystal_lv2_4-6.svg` // Assuming icons are named as crystal_lv1.svg, crystal_lv2.svg, etc.
        }
        if (level <= 9) {
            return `/icon-level/crystal_lv3_7-9.svg`
        }
        if (level <= 12) {
            return `/icon-level/crystal_lv4_10-12.svg`
        }
        if (level <= 15) {
            return `/icon-level/crystal_lv5_13-15.svg`
        }
        return `/icon-level/crystal_lv6_16-18.svg`
    }
    return (
        <PhotoProvider>
            <div className="my-5 md:my-8 w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
                <div className="text-third dark:text-white flex flex-col md:flex-row px-0 min-h-[85vh] border-t-gray-300/50 dark:border-white/10 border  shadow-xl w-full rounded-xl overflow-hidden ">
                    <div className=" flex-1">
                        {/* {khung chat ben trái} */}
                        <div className="w-auto border-b border-t-gray-300/50 dark:border-b-white/10 flex items-center md:justify-between  h-16 md:px-5 px-3 bg-white dark:bg-slate-800/50 ">
                            {/* header */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 ">
                                    <Hash className="text-4xl font-bold dark:text-gray-400" />
                                    <h3>My FlashCard Community</h3>
                                </div>
                                <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600 "></div>
                                <p className="dark:text-white/60 line-clamp-1 hidden md:block">Kênh thảo luận chung cho cộng đồng</p>
                            </div>
                            <div className="hidden md:flex items-center gap-3">
                                <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                    <Bell size={18} />
                                </div>
                                <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                    <Search size={18} />
                                </div>
                                <div className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                    <EllipsisVertical size={18} />
                                </div>
                            </div>
                        </div>
                        {/* nội dung chính */}
                        <div className="flex flex-col ">
                            <div
                                className={`py-5 px-3 flex-1  bg-white/80 dark:bg-inherit ${
                                    replyingTo && imageReview
                                        ? 'max-h-[calc(80vh-249px)] min-h-[calc(80vh-249px)]'
                                        : imageReview
                                        ? 'max-h-[calc(80vh-200px)] min-h-[calc(80vh-200px)]'
                                        : replyingTo
                                        ? 'max-h-[calc(80vh-150px)] min-h-[calc(80vh-150px)]'
                                        : 'max-h-[calc(80vh-100px)] min-h-[calc(80vh-100px)]'
                                } overflow-y-auto  flex flex-col gap-2 overscroll-contain`}
                            >
                                {messages &&
                                    messages.map((message, index) => (
                                        <ChatCard
                                            key={message._id || index}
                                            message={message}
                                            ref={lastMessageRef}
                                            isLastMessage={index === messages.length - 1}
                                            handleReactIcon={handleReactIcon}
                                            inputRef={inputRef}
                                            setReplyingTo={setReplyingTo}
                                            handleUnsend={handleUnsend}
                                            user={user}
                                            PhotoView={PhotoView}
                                        />
                                    ))}
                                {loading && (
                                    <div className="flex items-center justify-center col-span-4 h-[500px]">
                                        <Loading className="h-12 w-12" />{' '}
                                    </div>
                                )}
                            </div>
                            <div
                                className={`border-t border-t-gray-300/50 dark:border-t-white/10 bg-white dark:bg-slate-800/50 ${
                                    replyingTo && imageReview ? 'h-[249px]' : imageReview ? 'h-[200px]' : replyingTo ? 'h-[150px]' : 'h-[100px]'
                                }`}
                            >
                                {replyingTo && (
                                    <div className="px-5  border-b border-t-gray-300/50 dark:border-b-white/10 ">
                                        <div className="h-12 flex items-center justify-between ">
                                            <p className="">
                                                Bạn đang trả lời <span className="font-bold"> {user?._id === replyingTo.userId._id ? 'chính bản thân' : replyingTo.userId.displayName}</span>{' '}
                                            </p>
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/50 hover:bg-white/10 transition-all duration-300">
                                                <X size={16} onClick={() => setReplyingTo(null)} className="" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {imageReview && (
                                    <div className="px-5  border-b border-t-gray-300/50 dark:border-b-white/10 ">
                                        <div className="relative h-12 w-12 md:h-24 md:w-36 overflow-hidden">
                                            <img src={imageReview} alt="Image preview" className="w-full h-full py-2  absolute object-cover rounded-md" />
                                            <div
                                                className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-red-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                                                onClick={() => {
                                                    setImageReview(null)
                                                    setImage('')
                                                }}
                                            >
                                                <X size={16} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {user ? (
                                    <div className="p-5 ">
                                        <div className="px-3  border border-gray-300/50 shadow-sm dark:border-white/10 rounded-xl h-16 w-full flex items-center justify-between">
                                            {/* <DialogAddImage image={image} setImage={setImage}>
                                        </DialogAddImage> */}
                                            <div className="">
                                                <Label
                                                    htmlFor="image"
                                                    className="h-10 w-10 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white"
                                                >
                                                    <ImagePlus size={18} />
                                                </Label>
                                                <input id="image" type="file" className="hidden" onChange={(e) => handleImageChange(e)} />
                                            </div>
                                            <Input
                                                value={messageInput}
                                                onChange={handleMessageChange}
                                                ref={inputRef}
                                                onPaste={handlePaste}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Nhắn tin tới # cộng đồng My FlashCard..."
                                                className="flex-1 text-sm md:text-md border-none shadow-none ring-0 outline-none focus-visible:ring-0"
                                            ></Input>
                                            <div className="flex items-center gap-3">
                                                <div className="hidden md:flex h-10 w-10 items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-gray-400 dark:text-white/60 hover:text-white">
                                                    <Smile size={18} />
                                                </div>
                                                <Button
                                                    onClick={handleSendMessage}
                                                    disabled={loading}
                                                    className="bg-linear-to-r from-blue-500 to-purple-500  text-white h-10 px-4 rounded-lg hover:scale-[1.02] transition-all duration-200"
                                                >
                                                    {loading ? <Loading /> : <Send />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-16 flex items-center justify-center text-center">
                                        <p>Bạn cần phải đăng nhập để gia nhập chat cộng đồng</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-[300px] p-4 bg-white dark:bg-slate-800/50 md:border-s  md:border-s-gray-300/50 dark:md:border-s-white/10 border-t md:border-t-gray-300/50 dark:border-t-white/10">
                        {/* podium top 3 server */}
                        <div className="mb-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-md ">
                                    <Crown className="dark:text-gray-400" size={18} /> <span className="inline-flex items-end">Bục vinh danh</span>
                                </div>
                                <Link to="/community/top" className="flex items-center gap-1 text-xs hover:underline cursor-pointer text-gray-500 dark:text-white/60">
                                    <p>Chi tiết</p>
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                            <div className="flex justify-center items-end gap-2 mt-4">
                                {podiumUsers &&
                                    podiumUsers.map((user: IPodiumUser, index: number) => {
                                        // Xác định vị trí thực tế (1, 2, 3) dựa trên index sau khi reorder
                                        let position: string
                                        let ringColor: string
                                        let heigthAvatar: string
                                        if (index === 0) {
                                            // Top 2 (bên trái)
                                            position = '2'
                                            ringColor = 'ring-gray-400'
                                            heigthAvatar = 'h-12 w-12'
                                        } else if (index === 1) {
                                            // Top 1 (giữa)
                                            position = '1'
                                            ringColor = 'ring-yellow-400'
                                            heigthAvatar = 'h-16 w-16'
                                        } else {
                                            // Top 3 (bên phải)
                                            position = '3'
                                            ringColor = 'ring-amber-600'
                                            heigthAvatar = 'h-12 w-12'
                                        }

                                        return (
                                            <Link to={`/profile/${user.user_id._id}`} className="block group text-center" key={index}>
                                                <Avatar className={`mx-auto mb-2 ring-2 ${ringColor} ${heigthAvatar}  `}>
                                                    <AvatarImage src={user.user_id.profilePicture} alt={user.user_id.displayName} className="object-cover" />
                                                    <AvatarFallback className="bg-slate-500 text-white">
                                                        {user.user_id.displayName
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={`${getPodium(index)} w-16 mx-auto rounded-t-lg flex flex-col items-center justify-center`}>
                                                    <span className="text-white font-bold text-lg">{position == '1' ? <Crown className="text-white" /> : position}</span>
                                                    <span className={`text-white text-[10px] ${position == '1' && 'mt-1'}`}>{new Intl.NumberFormat().format(user.xp)}XP</span>
                                                </div>
                                                <p className="text-xs text-white mt-1 truncate w-16">{user.user_id.displayName}</p>
                                            </Link>
                                        )
                                    })}
                            </div>
                            {loading && (
                                <div className="flex items-center justify-center h-[270px]">
                                    <Loading className="h-12 w-12" />{' '}
                                </div>
                            )}
                        </div>
                        {/* Online Users List */}
                        <div className="">
                            <div className="flex items-center gap-2 text-md ">
                                <Users className="text-gray-400" size={18} />{' '}
                                <span className="inline-flex items-end">
                                    Đang online <Minus /> {onlineUsers?.length || '0'}
                                </span>
                            </div>
                            <div className="space-y-3 mt-8 h-full">
                                {onlineUsers &&
                                    onlineUsers.map((user: IUser, index: number) => {
                                        return (
                                            <Link
                                                to={`/profile/${user?._id}`}
                                                className="flex items-center justify-between group hover:bg-white/20 p-3 rounded-lg transition-all duration-300 cursor-pointer"
                                                key={index}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`relative w-10 h-10 ${user.role === 'admin' && 'ring-2 ring-blue-500'} rounded-full `}>
                                                        <img src={user?.profilePicture || '/avatar.jpg'} alt="" className="w-full h-full absolute object-cover rounded-full"></img>
                                                        {user?.role === 'admin' ? (
                                                            <div className="absolute -bottom-1 -right-1 z-10 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
                                                                <CodeXml size={12} />
                                                            </div>
                                                        ) : (
                                                            <div className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0 z-10"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 w-full">
                                                        <div className="flex items-center gap-2">
                                                            <h1
                                                                className={`line-clamp-1 w-[110px] animate-text-gradient bg-linear-to-r font-semibold ${
                                                                    user.role === 'admin' ? 'from-blue-500 via-blue-400 to-blue-600 bg-[200%_auto] bg-clip-text text-transparent' : ''
                                                                }`}
                                                            >
                                                                {user?.displayName || 'Khách vãng lai'}
                                                            </h1>
                                                            {user && (
                                                                <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1 text-xs">
                                                                    <img src={getIconLevel(user?.gamification?.level || 0)} width={14} height={14} alt="" />
                                                                    Cấp {user?.gamification?.level || 0}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {user ? (
                                                            <p className="flex gap-1 items-center text-gray-500 dark:text-gray-400 text-sm ">
                                                                {user?.gamification?.xp?.toLocaleString() || 0}XP -{' '}
                                                                <span className="flex gap-1 items-center">
                                                                    <Flame size={14} className="stroke-yellow-500" />
                                                                    {user?.gamification?.dailyStreak?.current || 0}
                                                                </span>
                                                            </p>
                                                        ) : (
                                                            <p className="text-gray-500 dark:text-gray-400 text-sm ">Đang hoạt động</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                <div className="">{onlineUsers && !onlineUsers.length && <div className="text-center text-gray-400">Không có thành viên nào đang online...</div>}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PhotoProvider>
    )
}
