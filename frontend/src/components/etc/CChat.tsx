import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MessageCircle, Search } from 'lucide-react'
import { useSocket } from '@/contexts/SocketContext'
import type { IChat } from '@/types/etc'
import type { IUser } from '@/types/user'
import etcService from '@/services/etcService'
import { Input } from '../ui/input'
import handleCompareDate from '@/lib/handleCompareDate'
import Loading from '../ui/loading'
import CShowMessage from './CShowMessage'
function useDebounce(value: any, duration = 300) {
    const [debounceValue, setDebounceValue] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value)
        }, duration)
        return () => {
            clearTimeout(timer)
        }
    }, [value, duration])
    return debounceValue
}
interface Props {
    chat: IChat[]
    setChat: any
    unreadCountChat: number
    setUnreadCountChat: any
    user: IUser | null
}
export default function CChat({ chat, setChat, unreadCountChat, setUnreadCountChat, user }: Props) {
    const [input, setInput] = useState('')

    const debouncedSearchTerm = useDebounce(input, 300)
    const [chatMessId, setChatMessId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(null)
    const [search, setSearch] = useState<IUser[]>([])
    const [isSearch, setIsSearch] = useState(false)
    const { socket, onlineUsers } = useSocket()

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true)
            const req = await etcService.findByName(input)
            if (req?.ok) {
                setSearch(req?.users)
            } else {
                console.error(req?.message)
            }
            setLoading(false)
        }

        if (debouncedSearchTerm && input !== '') {
            fetchAPI()
        }
    }, [debouncedSearchTerm, input])

    // const handleRouterChat = async (item) => {
    //     const req = await GET_API(`/notify/${item?._id}`, token);
    //     if (req.ok) {
    //         setUnreadCountNotify(req?.unreadCount || 0);
    //         router.push(item?.link);
    //         setOpenNoti(false);
    //     }
    // };

    useEffect(() => {
        if (input === '') {
            setSearch([]) // Gán lại danh sách chat mặc định
        }
    }, [input, chat])

    const handleCreateAndCheckRoomChat = async (id_another_user: string, index: any) => {
        setLoadingChat(index)
        const req = await etcService.createAndCheckExitChat({
            participants: [user?._id, id_another_user],
        })

        if (req.ok) {
            setChatMessId(req?.chatId)
            setUnreadCountChat(req?.countRead)
            setChat((prev: any) => prev.map((msg: IChat) => (msg._id === req.chatId ? { ...msg, is_read: true } : msg)))
        }
        setLoadingChat(null)
    }

    const handleDeleteChat = () => {
        setChatMessId(null)
    }

    const checkOnline = (userId: string) => {
        return onlineUsers?.find((item: any) => item?._id === userId)
    }
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="relative group">
                        <div className="h-9 w-9 flex items-center justify-center bg-white/10 hover:bg-gradient-to-br hover:from-teal-500 hover:to-cyan-500 rounded-xl transition-all duration-300 cursor-pointer text-white shadow-lg group-hover:shadow-xl group-hover:scale-105">
                            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                        </div>
                        {unreadCountChat > 0 && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 text-[10px] rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center font-bold shadow-lg animate-pulse ring-2 ring-white/30">
                                {unreadCountChat > 9 ? '9+' : unreadCountChat}
                            </div>
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent className="md:w-[480px] max-h-[400px] md:max-h-[600px] overflow-hidden rounded-2xl shadow-2xl border-2 border-teal-100 dark:border-teal-900/30 p-0">
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tin nhắn</h3>
                            </div>
                            
                            <div className="flex gap-2 items-center">
                                {isSearch && (
                                    <button
                                        className="h-10 w-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
                                        onClick={() => {
                                            setIsSearch(false)
                                            setInput('')
                                        }}
                                    >
                                        <FaArrowLeft className="w-4 h-4" />
                                    </button>
                                )}

                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Tìm kiếm người dùng..."
                                        className="pl-10 h-10 w-full border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-800 focus-visible:ring-teal-500"
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value)
                                            setIsSearch(true)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto p-2 bg-white dark:bg-slate-900">
                            {!isSearch &&
                                chat?.map((item, index) => {
                                    const otherParticipant = item?.participants.find((p: any) => p?.userId?._id !== user?._id)
                                    return (
                                        <div
                                            onClick={() => otherParticipant?.userId?._id && handleCreateAndCheckRoomChat(otherParticipant.userId._id, index)}
                                            key={index}
                                            className={`p-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center gap-3 cursor-pointer rounded-xl transition-all duration-200 mb-2 ${
                                                !item?.is_read ? 'bg-teal-50/50 dark:bg-slate-800/50 border border-teal-200 dark:border-teal-900/30' : ''
                                            }`}
                                        >
                                            <div className="w-12 h-12 md:w-14 md:h-14 relative flex-shrink-0">
                                                <img 
                                                    src={otherParticipant?.userId?.profilePicture || '/avatar.jpg'} 
                                                    alt="" 
                                                    className="object-cover w-full h-full rounded-full ring-2 ring-white dark:ring-slate-700 shadow-md" 
                                                />
                                                {otherParticipant?.userId?._id && checkOnline(otherParticipant.userId._id) && (
                                                    <div className="absolute z-10 right-0 bottom-0 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm md:text-base truncate">
                                                    {otherParticipant?.userId?.displayName}
                                                </p>
                                                {item?.last_message ? (
                                                    <div className="text-gray-500 dark:text-gray-400">
                                                        <p className="line-clamp-1 text-xs md:text-sm">{item?.last_message}</p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">{item?.last_message_date && handleCompareDate(item?.last_message_date)}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm">Chưa có tin nhắn</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {loadingChat === index && <Loading className="w-5 h-5" />}
                                                {loadingChat !== index && !item?.is_read && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md"></div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            {isSearch &&
                                search?.map((item, index) => (
                                    <div
                                        onClick={() => handleCreateAndCheckRoomChat(item?._id, index)}
                                        key={index}
                                        className="p-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center gap-3 cursor-pointer rounded-xl transition-all duration-200 mb-2"
                                    >
                                        <div className="w-12 h-12 md:w-14 md:h-14 relative flex-shrink-0">
                                            <img 
                                                src={item?.profilePicture || '/avatar.jpg'} 
                                                alt="" 
                                                className="object-cover w-full h-full rounded-full ring-2 ring-white dark:ring-slate-700 shadow-md" 
                                            />
                                            {checkOnline(item?._id) && (
                                                <div className="absolute z-10 right-0 bottom-0 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm md:text-base truncate">
                                                {item?.displayName}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                                                Tham gia {item?.created_at && handleCompareDate(item?.created_at)}
                                            </p>
                                        </div>
                                        {loadingChat === index && <Loading className="w-5 h-5 flex-shrink-0" />}
                                    </div>
                                ))}

                            {!isSearch && !loading && chat?.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mb-4">
                                        <MessageCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Chưa có tin nhắn</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Bắt đầu trò chuyện với bạn bè của bạn</p>
                                </div>
                            )}
                            {loading && (
                                <div className="flex items-center justify-center h-[300px]">
                                    <Loading className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <CShowMessage chatMessId={chatMessId} handleDeleteChat={handleDeleteChat} socket={socket} checkOnline={checkOnline} />
        </>
    )
}
