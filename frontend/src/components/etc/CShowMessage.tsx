import { useCallback, useEffect, useRef, useState } from 'react'
import { GrFormClose } from 'react-icons/gr'
import { IoIosArrowDown, IoMdClose } from 'react-icons/io'
import { MdOutlineReply } from 'react-icons/md'
import { Send, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import etcService from '@/services/etcService'
import { Link } from 'react-router-dom'
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

    // const handleImageChange = (e:any) => {
    //     const file = e.target.files[0]
    //     setImage(file)
    //     setImageReview(file ? URL.createObjectURL(file) : null as any)
    // }

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() && !image) return

        setLoading(true)
        try {
            let imageUrl = ''
            if (image) {
                const formData = new FormData()
                formData.append('image', image)
                const res = await etcService.uploadImage(formData)
                imageUrl = res.originalUrl
            }

            const messageData = {
                profilePicture: user?.profilePicture,
                displayName: user?.displayName,
                chatRoomId: messages?._id,
                userId: user?._id,
                message: newMessage,
                image: imageUrl,
                replyTo: replyingTo,
            }
            socket.emit('sendMessage', messageData)
            setNewMessage('')
            setImage(null)
            setImageReview(null)
            setReplyingTo(null)
            // setSendMess(true);
        } catch (error) {
            console.error('Failed to send message', error)
        } finally {
            setLoading(false)
        }
    }, [newMessage, image, user, replyingTo, socket])

    useEffect(() => {
        if (!socket) return
        socket.emit('joinRoom', messages?._id)

        socket.on('message', (data: any) => {
            setChats((prevData: any) => [...prevData, data.newMessage])
            if (data.newMessage.userId !== userId) {
                handleSendNoti(data.displayName, data.newMessage.message, data.profilePicture)
            }
        })

        return () => {
            socket.emit('leaveRoom', messages?._id)
            socket.off()
        }
    }, [messages?._id, socket])

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
                <div className="fixed right-5 -bottom-[900px] ">
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
                                    const isSameUser = index > 0 && chats[index - 1]?.userId === msg?.userId
                                    const isCurrentUser = msg?.userId === user?._id
                                    const isLastMessage = index === chats?.length - 1
                                    // const image_another_user = user?._id === msg?.userId?._id ? messages?.participants[0]?.userId?.profilePicture : messages?.participants[1]?.userId?.profilePicture;
                                    const otherParticipant = messages?.participants.find((p: any) => p?.userId?._id !== user?._id)
                                    return (
                                        <div key={index} ref={isLastMessage ? lastMessageRef : null}>
                                            {/* Tin nhắn */}
                                            {!isSameUser && <p className="mb-5"></p>}

                                            <div className={`flex items-start ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-[4px] group min-h-[40px] items-center`}>
                                                {/* Avatar của người khác */}
                                                {!isCurrentUser && !isSameUser && (
                                                    <Link to={`/profile/${msg?.userId}`} className="w-[35px] h-[35px] relative mr-[-35px]">
                                                        <img src={otherParticipant?.userId?.profilePicture || '/meme.jpg'} alt="" className="w-full h-full object-cover absolute rounded-full" />
                                                    </Link>
                                                )}

                                                {/* Nội dung tin nhắn */}
                                                <div className={`flex items-center w-full gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`max-w-[70%]  ${isCurrentUser ? '' : 'ml-[45px]'}`}>
                                                        {msg?.replyTo && (
                                                            <div className="text-[12px]">
                                                                {isCurrentUser ? (
                                                                    <div className="">
                                                                        <p className="flex items-center gap-1">
                                                                            <MdOutlineReply />
                                                                            Bạn đã trả lời {msg?.replyTo?.userId?._id == userId ? 'chính bạn' : ':' + msg?.replyTo?.userId?.displayName}
                                                                        </p>

                                                                        {msg?.replyTo?.image && (
                                                                            <Link to={`#${msg?.replyTo._id}`} className={`mb-1 flex justify-end`}>
                                                                                <img alt="" src={msg?.replyTo.image} width={100} height={100} className="brightness-50 rounded-lg " />
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="">
                                                                        <p className="flex items-center gap-1">
                                                                            <MdOutlineReply />
                                                                            {msg?.userId?.displayName} đã trả lời bạn
                                                                        </p>
                                                                        {msg?.replyTo?.image && (
                                                                            <Link to={`#${msg?.replyTo._id}`} className={`mb-1 flex justify-start`}>
                                                                                <img alt="" src={msg?.replyTo.image} width={100} height={100} className="brightness-50 rounded-lg " />
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {msg?.replyTo?.message !== '' && (
                                                                    <Link to={`#${msg?.replyTo._id}`} className={`block ${isCurrentUser ? 'w-full text-end' : ''}`}>
                                                                        <p className={` inline-block bg-gray-400 rounded-lg px-3 py-2 mb-[-10px] line-clamp-2`}>
                                                                            {msg?.replyTo?.unsend ? 'Tin nhắn đã bị gỡ' : msg?.replyTo?.message}
                                                                        </p>
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        )}
                                                        {msg?.isEdit && <span className={`text-xs text-gray-600 ${isCurrentUser ? 'text-end mr-5' : 'text-start ml-5'} block `}>Đã chỉnh sửa</span>}
                                                        <div className={` ${isCurrentUser ? 'w-full' : ''} `} id={msg?._id}>
                                                            {msg?.message && (
                                                                <p
                                                                    className={`max-w-[350px] ${
                                                                        isCurrentUser ? ' bg-primary text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-200'
                                                                    } ${msg?.unsend ? '!bg-white border border-primary  text-[12px]' : ''} rounded-lg px-3 py-2 inline-block`}
                                                                >
                                                                    {msg?.unsend ? 'Tin nhắn đã bị gỡ' : msg?.message}
                                                                </p>
                                                            )}

                                                            {!msg?.unsend && msg?.reactions && msg?.reactions?.length != 0 && (
                                                                <div className={`mt-[-10px] relative z-2 h-[20px] flex ${isCurrentUser ? 'justify-end mr-1' : 'ml-1'}`}>
                                                                    {msg?.reactions?.map((react: any, index: number) => (
                                                                        <div className="flex bg-linear-item-2 rounded-full items-center px-[3px] cursor-pointer " key={index}>
                                                                            <img src={react.emoji} alt="" width={15} height={15} className="" />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {!msg?.unsend && msg?.image && (
                                                            <img src={msg?.image || '/meme.jpg'} alt="" width={200} height="auto" className="object-cover rounded-lg mt-2" />
                                                        )}
                                                    </div>
                                                    {isSameUser && <p className="text-gray-500 text-xs ">{msg?.timestamp && handleCompareDate(msg?.timestamp)}</p>}
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
                                {/* <label htmlFor="image" className="h-full flex items-center justify-center text-gray-500 hover:text-primary cursor-pointer">
                                    <IoIosImages size={20} />
                                </label>
                                <input id="image" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} /> */}

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
