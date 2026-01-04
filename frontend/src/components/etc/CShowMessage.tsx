import { useCallback, useEffect, useRef, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { IoIosArrowDown, IoMdClose } from 'react-icons/io'
import { MdOutlineReply } from 'react-icons/md'
import { Send, X, ImagePlus } from 'lucide-react'
import { TokenStorage, useAuth } from '@/contexts/AuthContext'
import etcService from '@/services/etcService'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import handleCompareDate from '@/lib/handleCompareDate'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Loading from '../ui/loading'
export default function CShowMessage({ chatMessId, handleDeleteChat, socket, checkOnline }: any) {
    const lastMessageRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<any>([])
    const [chats, setChats] = useState<any>([])
    const [newMessage, setNewMessage] = useState<any>('')
    const [image, setImage] = useState<any>(null)
    const [imageReview, setImageReview] = useState<any>(null)
    const [loading, setLoading] = useState<any>(false)
    const [replyingTo, setReplyingTo] = useState<any>(null)
    const { user } = useAuth()
    const userId = user?._id

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await etcService.getChatById(chatMessId)
            if (req.ok) {
                setChats(req?.chat?.messages)
                delete req?.chat?.messages
                setMessages(req?.chat)
            }
        }
        if (chatMessId !== null) {
            fetchAPI()
        } else {
            setMessages([])
            setChats([])
        }
    }, [chatMessId])

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chats])

    // const debouncedSearchEmoji = useCallback(
    //     debounce((searchTerm) => {
    //         const filteredData = emoji.filter((item) => item.unicodeName.toLowerCase().includes(searchTerm.toLowerCase()));
    //         setEmojiData(filteredData);
    //     }, 300),
    //     [emoji]
    // );

    // const handleSearchEmoji = useCallbackack(
    //     (e) => {
    //         const searchTerm = e.target.value;
    //         setSearchEmoji(searchTerm);
    //         debouncedSearchEmoji(searchTerm);
    //     },
    //     [debouncedSearchEmoji]
    // );

    const handlePaste = (event: any) => {
        const items = event.clipboardData.items
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.includes('image')) {
                const blob = items[i].getAsFile()
                const url = URL.createObjectURL(blob)
                setImage(blob)
                setImageReview(url as any)
                break
            }
        }
    }

    const handleImageChange = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImageReview(URL.createObjectURL(file))
        }
    }

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() && !image) return

        setLoading(true)
        try {
            let imageUrl = ''
            if (image) {
                const formData = new FormData()
                formData.append('image', image)
                const res = await etcService.uploadImage(formData)
                imageUrl = res?.url || res?.data?.url || ''
            }

            const messageData = {
                profilePicture: user?.profilePicture,
                displayName: user?.displayName,
                chatRoomId: messages?._id,
                userId: user?._id,
                message: newMessage,
                image: imageUrl,
                replyTo: replyingTo,
                token: TokenStorage.getCookieToken(),
            }
            socket.emit('sendMessage', messageData)
            setNewMessage('')
            setImage(null)
            setImageReview(null)
            setReplyingTo(null)
        } catch (error: any) {
            console.error('Failed to send message', error)
            toast.error('Lỗi khi gửi tin nhắn', {
                description: error?.message || 'Vui lòng thử lại',
                duration: 3000,
            })
        } finally {
            setLoading(false)
        }
    }, [newMessage, image, user, replyingTo, socket, messages])

    useEffect(() => {
        if (!socket) return
        socket.emit('joinRoom', messages?._id)

        socket.on('message', (data: any) => {
            setChats((prevData: any) => [...prevData, data.newMessage])
            if (data.newMessage.userId !== userId) {
                handleSendNoti(data.displayName, data.newMessage.message, data.profilePicture)
            }
        })

        socket.on('replyUnsendMessage', (messageId: string) => {
            setChats((prev: any) => prev.map((msg: any) => (msg._id === messageId ? { ...msg, unsend: true } : msg)))
        })

        socket.on('replyEditMessage', ({ messageId, newMessage }: any) => {
            setChats((prev: any) => prev.map((msg: any) => (msg._id === messageId ? { ...msg, message: newMessage, isEdit: true } : msg)))
        })

        socket.on('replyReactMessage', ({ messageId, reactions }: any) => {
            setChats((prev: any) => prev.map((msg: any) => (msg._id === messageId ? { ...msg, reactions } : msg)))
        })

        return () => {
            socket.emit('leaveRoom', messages?._id)
            socket.off('message')
            socket.off('replyUnsendMessage')
            socket.off('replyEditMessage')
            socket.off('replyReactMessage')
        }
    }, [messages?._id, socket, userId])

    const handleSendNoti = (displayName: string, message: string, profilePicture: string) => {
        if (!window.Notification) {
            console.error('Browser does not support notifications.')
        } else {
            // check if permission is already granted
            if (Notification.permission === 'granted') {
                // show notification here
                new Notification(displayName, {
                    body: message,
                    icon: profilePicture,
                })
            } else {
                // request permission from user
                Notification.requestPermission()
                    .then(function (p) {
                        if (p === 'granted') {
                            // show notification here
                            new Notification(displayName, {
                                body: message,
                                icon: profilePicture,
                            })
                        } else {
                            console.error('User blocked notifications.')
                        }
                    })
                    .catch(function (err) {
                        console.error(err)
                    })
            }
        }
    }
    return (
        <div className="">
            {messages?.participants?.length > 0 && messages && (
                <div className="fixed right-5 -bottom-[660px] ">
                    <div className="bg-white dark:bg-slate-800 border dark:border-white/10 w-[338px] h-[455px] rounded-t-lg shadow-sm overflow-hidden">
                        <div className="h-12 flex items-center justify-between p-1 my-1  border-b border-gray-200 dark:border-white/10 shadow-sm">
                            <Link
                                to={`/profile/${user?._id === messages?.participants[1]?.userId?._id ? messages?.participants[0]?.userId?._id : messages?.participants[1]?.userId?._id}`}
                                className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700   cursor-pointer rounded-md  px-2 h-full"
                            >
                                <div className="relative w-[36px] h-[36px]">
                                    <img
                                        src={
                                            user?._id === messages?.participants[1]?.userId?._id ? messages?.participants[0]?.userId?.profilePicture : messages?.participants[1]?.userId?.profilePicture
                                        }
                                        alt="Message sent"
                                        className="absolute w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="text-gray-500">
                                    <h3 className="font-bold leading-5 text-gray-700 dark:text-gray-200 line-clamp-1 max-w-[150px]">
                                        {user?._id === messages?.participants[1]?.userId?._id ? messages?.participants[0]?.userId?.displayName : messages?.participants[1]?.userId?.displayName}{' '}
                                    </h3>
                                    {checkOnline(user?._id === messages?.participants[1]?.userId?._id ? messages?.participants[0]?.userId?._id : messages?.participants[1]?.userId?._id) ? (
                                        <div className="text-sm flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-[#3fbb46]" />
                                            <p>Đang hoạt động</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm ">Không hoạt động</p>
                                    )}
                                </div>
                                <IoIosArrowDown size={14} />
                            </Link>
                            <div className="w-12 h-full hover:text-red-500 cursor-pointer flex items-center justify-center" onClick={handleDeleteChat}>
                                <X />
                            </div>
                        </div>

                        <div className={`${imageReview ? 'min-h-[220px] max-h-[220px]' : 'min-h-[320px] max-h-[320px]'}    overflow-y-scroll p-3 overscroll-contain`}>
                            {chats &&
                                chats?.map((msg: any, index: number) => {
                                    const msgUserId = typeof msg?.userId === 'string' ? msg?.userId : msg?.userId?._id
                                    const prevMsgUserId = index > 0 ? (typeof chats[index - 1]?.userId === 'string' ? chats[index - 1]?.userId : chats[index - 1]?.userId?._id) : null
                                    const isSameUser = msgUserId === prevMsgUserId
                                    const isCurrentUser = msgUserId === user?._id
                                    const isLastMessage = index === chats?.length - 1
                                    const otherParticipant = messages?.participants.find((p: any) => p?.userId?._id !== user?._id)
                                    return (
                                        <div key={index} ref={isLastMessage ? lastMessageRef : null}>
                                            {/* Tin nhắn */}
                                            {!isSameUser && <p className="mb-5"></p>}

                                            <div className={`flex items-start ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-[4px] group min-h-[40px]`}>
                                                {/* Avatar của người khác - hiển thị bên trái */}
                                                {!isCurrentUser && !isSameUser && (
                                                    <Link to={`/profile/${msgUserId}`} className="w-[35px] h-[35px] relative flex-shrink-0 mr-2">
                                                        <img src={otherParticipant?.userId?.profilePicture || '/meme.jpg'} alt="" className="w-full h-full object-cover rounded-full" />
                                                    </Link>
                                                )}

                                                {/* Nội dung tin nhắn */}
                                                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                                    {/* Reply indicator */}
                                                    {msg?.replyTo && (
                                                        <div className={`text-[12px] mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                                            <p className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                                <MdOutlineReply />
                                                                {isCurrentUser 
                                                                    ? `Bạn đã trả lời ${msg?.replyTo?.userId?._id == userId ? 'chính bạn' : msg?.replyTo?.userId?.displayName}`
                                                                    : `${msg?.userId?.displayName || 'Họ'} đã trả lời bạn`
                                                                }
                                                            </p>
                                                            {msg?.replyTo?.image && (
                                                                <Link to={`#${msg?.replyTo._id}`} className="inline-block mt-1">
                                                                    <img alt="" src={msg?.replyTo.image} width={80} height={80} className="brightness-75 rounded-lg" />
                                                                </Link>
                                                            )}
                                                            {msg?.replyTo?.message && (
                                                                <Link to={`#${msg?.replyTo._id}`}>
                                                                    <p className="inline-block bg-gray-400 dark:bg-gray-600 text-white rounded-lg px-3 py-1 text-xs line-clamp-2 mt-1">
                                                                        {msg?.replyTo?.unsend ? 'Tin nhắn đã bị gỡ' : msg?.replyTo?.message}
                                                                    </p>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Edit indicator */}
                                                    {msg?.isEdit && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Đã chỉnh sửa</span>
                                                    )}

                                                    {/* Message content */}
                                                    <div id={msg?._id} className="relative">
                                                        {msg?.message && (
                                                            <p
                                                                className={`rounded-2xl px-4 py-2 inline-block break-words ${
                                                                    isCurrentUser 
                                                                        ? 'bg-primary text-white rounded-br-sm' 
                                                                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-sm'
                                                                } ${msg?.unsend ? '!bg-transparent border border-gray-300 dark:border-gray-600 !text-gray-400 text-xs italic' : ''}`}
                                                            >
                                                                {msg?.unsend ? 'Tin nhắn đã bị gỡ' : msg?.message}
                                                            </p>
                                                        )}

                                                        {/* Reactions */}
                                                        {!msg?.unsend && msg?.reactions && msg?.reactions?.length > 0 && (
                                                            <div className={`absolute -bottom-2 flex gap-1 ${isCurrentUser ? 'right-0' : 'left-0'}`}>
                                                                {msg?.reactions?.map((react: any, idx: number) => (
                                                                    <div key={idx} className="flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-full items-center px-1 shadow-sm">
                                                                        <img src={react.emoji} alt="" width={14} height={14} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Image */}
                                                    {!msg?.unsend && msg?.image && (
                                                        <img 
                                                            src={msg?.image} 
                                                            alt="" 
                                                            className={`max-w-[200px] object-cover rounded-lg mt-2 cursor-pointer hover:opacity-90 transition-opacity ${
                                                                isCurrentUser ? 'rounded-br-sm' : 'rounded-bl-sm'
                                                            }`}
                                                        />
                                                    )}

                                                    {/* Timestamp - chỉ hiển thị khi không phải cùng user */}
                                                    {!isSameUser && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                            {msg?.timestamp && handleCompareDate(msg?.timestamp)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                        <div className="minh-16 flex items-center justify-between px-3">
                            {replyingTo && (
                                <label htmlFor="message" className="block replying-to relative bg-linear-item-blue px-3 py-1 rounded-lg mb-2 text-secondary ">
                                    <div className="absolute top-2 right-3 cursor-pointer hover:text-red-500" onClick={() => setReplyingTo(null)}>
                                        <IoMdClose />
                                    </div>
                                    <h1 className="text-secondary font-bold">Bạn đang trả lời{replyingTo?.userId?._id == userId ? ' chính bạn' : ': ' + replyingTo?.userId.displayName}</h1>
                                    <p className="line-clamp-2">{replyingTo?.message}</p>
                                    {replyingTo?.image && <img src={replyingTo?.image} alt="" width={120} height={100} className="object-cover rounded-lg mt-2" />}
                                </label>
                            )}
                            <div className="flex flex-1 gap-2  items-center border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-slate-800  px-3 py-1">
                                <label htmlFor="image-upload" className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary cursor-pointer transition-colors">
                                    <ImagePlus size={20} />
                                </label>
                                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} />

                                <div className="flex flex-col flex-1  ">
                                    {imageReview && (
                                        <div className="relative w-[45px] h-[45px]">
                                            <img src={imageReview} alt="" className="w-full h-full rounded-lg absolute object-cover"></img>
                                            <GrFormClose
                                                className="absolute z-1 top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xl cursor-pointer hover:opacity-80"
                                                onClick={() => {
                                                    setImage(null)
                                                    setImageReview(null)
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center min-h-8">
                                        <Input
                                            type="text"
                                            id="message"
                                            autoFocus
                                            className="h-full  p-0 border-none bg-transparent hover:border-none focus-visible:ring-0 text-gray-500 dark:text-gray-200 text-xl"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Nhập tin nhắn bạn muốn gửi..."
                                            onPaste={handlePaste}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        {/* <div className="flex items-center justify-center w-5 h-full">
                                            <Popover
                                                content={
                                                    <div>
                                                        <div className="">
                                                            <input placeholder="Tìm icon mà bạn thích" value={searchEmoji}></input>
                                                        </div>
                                                        <div className="grid grid-cols-5 gap-1 w-[300px]  mt-2">
                                                            {emojiData &&
                                                                emojiData.length > 0 && ( // Check if emoji exists and has elements
                                                                    <div className="grid grid-cols-5 gap-1 w-[300px] overflow-y-scroll h-[300px] mt-2">
                                                                        {emojiData.map((item, index) => (
                                                                            <div className="flex items-center justify-center hover:bg-gray-200 cursor-pointer" key={index}>
                                                                                <h1 className="text-xl" onClick={() => setNewMessage(newMessage + item.character)}>
                                                                                    {item.character}
                                                                                </h1>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                        </div>
                                                        {emojiData && emojiData?.length == 0 && <p className="h-[300px] flex items-center justify-center">Không tìm thấy Emojii này...</p>}
                                                    </div>
                                                }
                                                title="Chọn icon"
                                                trigger="click"
                                                open={open}
                                                onOpenChange={handleOpenChange}>
                                                <Button className="text-gray-500 hover:text-primary cursor-pointer">
                                                    <MdOutlineInsertEmoticon size={20} />
                                                </Button>
                                            </Popover>
                                        </div> */}
                                    </div>
                                </div>
                                <Button variant="outline" disabled={loading} onClick={handleSendMessage} className="bg-linear-to-r from-blue-500 to-purple-500 text-white ">
                                    {loading ? <Loading /> : <Send />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
