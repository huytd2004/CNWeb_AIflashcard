import { useEffect, useState } from 'react'
import { Bell, BookOpen, Brain, Cpu, History, Home, LogOut, Mailbox, Menu, Moon, Speech, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/hooks/useTheme'
import type { IChat, IGamification, TASKS } from '@/types/etc'
import profileService from '@/services/profileService'
import DailyTask from '@/components/etc/DailyTask'
import etcService from '@/services/etcService'
import CNotify from '@/components/etc/CNotify'
import CChat from '@/components/etc/CChat'
export default function CHeader() {
    const [notify, setNotify] = useState([])
    const [gamificationProfile, setGamificationProfile] = useState<IGamification>()
    const [chat, setChat] = useState<IChat[]>()
    const [tasks, setTasks] = useState<TASKS>()
    const [unreadCountNotify, setUnreadCountNotify] = useState<number>(0)
    const [unreadCountChat, setUnreadCountChat] = useState<number>(0)
    const [isOpenNavBar, setIsOpenNavBar] = useState(false)

    const navigate = useNavigate()
    const pathname = useLocation().pathname
    const { theme, setTheme } = useTheme()

    const { user, logout } = useAuth()
    const linkData = [
        { name: 'Home', icon: <Home size={16} />, href: '/' },
        { name: 'Flashcard', icon: <BookOpen size={16} />, href: '/flashcard' },
        { name: 'AI Center', icon: <Brain size={16} />, href: '/ai-center' },
        // { name: 'Exam Eng', icon: <FolderOpenDot size={16} />, href: '/english-exam' },
        { name: 'Quiz', icon: <Cpu size={16} />, href: '/quiz' },
        { name: 'Subj...', icon: <Cpu size={16} />, href: '/decuong' },
        { name: 'Commu...', icon: <Speech size={16} />, href: '/community' },
    ]

    useEffect(() => {
        const fetchAPI = async () => {
            const sessionTask = await sessionStorage.getItem('tasksDaily')
            if (sessionTask && JSON.parse(sessionTask).length < 1) {
                setTasks(JSON.parse(sessionTask))
            } else {
                const taskData = await etcService.getTask()
                setTasks(taskData)
                sessionStorage.setItem('tasksDaily', JSON.stringify(taskData))
            }
            const res = await profileService.getProfileAnything()
            if (res) {
                setNotify(res?.notifications)
                setUnreadCountNotify(res?.unreadCount || 0)
                setGamificationProfile(res?.gamificationProfile)
                setChat(res?.chats)
                setUnreadCountChat(res?.unreadCountChat || 0)
            }
        }
        if (user) {
            fetchAPI()
        }
    }, [user])

    const handleRouterNotify = async (item: any) => {
        const req = await etcService.markReadNotify(item?._id)
        if (req.ok) {
            setUnreadCountNotify((prev) => prev - 1)
            navigate(item?.link)
        }
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-998 bg-black/20 transition-opacity duration-300 ${isOpenNavBar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpenNavBar(false)}
            />
            <div
                className={`fixed top-0 left-0 z-999 w-[80%] h-full shadow bg-gray-200/80 dark:bg-gray-700/90  backdrop-blur-md transition-transform duration-300 ${
                    isOpenNavBar ? 'translate-x-0' : '-translate-x-full'
                } flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                <nav className="flex flex-col gap-2 items-start justify-start">
                    <Link to="/" className="qwigley-font text-5xl  text-primary dark:text-white font-medium text-center block w-full py-4 translate-y-2">
                        My FlashCard
                    </Link>
                    {linkData.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`px-4 w-full flex items-center justify-start gap-2 h-12 transition-colors ${
                                pathname === item.href ? 'border-l-4 border-primary bg-primary/10 dark:bg-primary/40  text-primary dark:text-white ' : 'text-gray-500 dark:text-white/60'
                            }`}
                            onClick={() => setIsOpenNavBar(false)}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="w-full flex items-center justify-center sticky top-0 z-50 bg-linear-to-r from-primary/80 to-purple-800/80 backdrop-blur-sm py-1 px-3 ">
                <div className="flex items-center justify-between  mx-auto w-full md:max-w-7xl">
                    <div className="flex items-center gap-2">
                        <Menu size={16} className="block md:hidden cursor-pointer hover:opacity-60 text-white  " onClick={() => setIsOpenNavBar(true)} />
                        <Link to="/" className="qwigley-font text-4xl translate-y-1 text-white  font-medium">
                            My FlashCard
                        </Link>
                    </div>

                    <ul className="hidden md:flex items-center gap-5 text-white/70">
                        {linkData.map((link) => (
                            <li key={link.name}>
                                <Link to={link.href} className={`flex gap-1  items-center h-full  transition-colors  ${pathname === link.href ? 'text-white font-medium' : ''}`}>
                                    {link.icon} {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center">
                        <div className=" items-center hidden md:flex text-white/70">
                            {theme === 'dark' ? (
                                <Button variant={'ghost'} className="" onClick={() => setTheme('light')}>
                                    <Sun size={18} className="" />
                                </Button>
                            ) : (
                                <Button variant={'ghost'} className="" onClick={() => setTheme('dark')}>
                                    <Moon size={18} className="" />
                                </Button>
                            )}
                        </div>
                        {!user ? (
                            <div className=" ">
                                <Link to="/auth/login" className="relative">
                                    <div className="-z-1 absolute inset-0 bg-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000  animate-pulse "></div>
                                    <Button className="z-1 relative group overflow-hidden bg-linear-to-br from-blue-700/60 to-purple-700/80 font-bold group-hover:scale-105 transition-all duration-500 px-4 py-2 rounded-lg text-white">
                                        Đăng nhập
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50  dark:via-white/10 to-transparent transition-all duration-500 translate-x-full group-hover:translate-x-full"></div>
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <div className="flex gap-3 items-center">
                                    {gamificationProfile && tasks && <DailyTask gamificationProfile={gamificationProfile} setGamificationProfile={setGamificationProfile} tasks={tasks} />}

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="h-7 w-7 flex items-center justify-center hover:bg-gray-600 rounded-md transition-all duration-200 cursor-pointer text-white/70 relative">
                                                {unreadCountNotify > 0 && (
                                                    <div className="absolute -top-1 -right-1 h-3.5 w-3.5 text-[8px] rounded-full bg-red-500 text-white flex items-center justify-center font-mono tabular-nums">
                                                        {unreadCountNotify}
                                                    </div>
                                                )}
                                                <Bell size={18} />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="md:w-[500px] max-h-[600px] overflow-y-scroll dark:text-white">
                                            <CNotify notify={notify} handleRouter={handleRouterNotify} />
                                        </PopoverContent>
                                    </Popover>
                                    {user && chat && <CChat chat={chat} setChat={setChat} unreadCountChat={unreadCountChat} setUnreadCountChat={setUnreadCountChat} user={user} />}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div className="w-10 h-10 md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
                                                <img
                                                    src={user?.profilePicture || '/avatar.jpg'}
                                                    alt=""
                                                    className="object-cover w-full h-full absolute"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                                <User />
                                                Tài khoản
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate('/history')}>
                                                <History />
                                                Lịch sử
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate('/gopy')}>
                                                <Mailbox />
                                                Góp ý
                                            </DropdownMenuItem>
                                            {theme === 'dark' ? (
                                                <DropdownMenuItem className="flex md:hidden" onClick={() => setTheme('light')}>
                                                    <Sun className="" />
                                                    Bật chế độ sáng
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem className="flex md:hidden" onClick={() => setTheme('dark')}>
                                                    <Moon className="" /> Bật chế độ tối
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuItem onClick={logout} className="dark:text-red-300 text-red-500 hover:text-red-600">
                                                <LogOut /> Đăng xuất
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
            <div className="fixed bottom-0  z-10 px-3 md:px-0 h-12 w-full bg-gray-100/90 dark:bg-gray-700/90 backdrop-blur-xs negative-shadow-md grid md:hidden grid-cols-6 items-center justify-center transition-all duration-300">
                {linkData.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={`flex flex-col items-center justify-center gap-1  h-full hover:text-primary transition-colors border-t-2 ${
                            pathname === item.href ? 'text-primary dark:text-indigo-400  border-primary dark:border-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400 border-transparent'
                        } `}
                    >
                        {item.icon}
                        <span className="text-xs">{item.name}</span>
                    </Link>
                ))}
            </div>
        </>
    )
}
