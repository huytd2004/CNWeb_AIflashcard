import handleCompareDate from '@/lib/handleCompareDate'
import { useState } from 'react'
import { Eye, EyeClosed, Play, Settings, SquareCheckBig, Trash2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import Loading from '@/components/ui/loading'
import { toast } from 'sonner'
import type { IListFlashcard } from '@/types/flashcard'
import { Link } from 'react-router-dom'
import flashcardService from '@/services/flashcardService'
import ToastLogErrror from '@/components/etc/ToastLogErrror'

const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
        english: '🇺🇸',
        chinese: '🇨🇳',
        japan: '🇯🇵',
        korea: '🇰🇷',
        vietnamese: '🇻🇳',
        germany: '🇩🇪',
        france: '🇫🇷',
    }
    return flags[lang] || '🌐'
}
export default function UserFC({ item }: { item: IListFlashcard }) {
    const [loading, setLoading] = useState(false)
    const statusCounts = {
        reviewing: 0, // từ mới và chưa ôn tập lần nào
        remembered: 0, // đã ôn tập
        learned: 0, // đã nhớ đã học thuộc
    }
    item.flashcards.forEach((card) => {
        if (card.status in statusCounts) {
            statusCounts[card.status as keyof typeof statusCounts] = (statusCounts[card.status as keyof typeof statusCounts] || 0) + 1
        }
    })

    const handleUpdate = async (e: any, type: string) => {
        try {
            e.preventDefault()
            setLoading(true)
            const res = await flashcardService.updatedListFlashcards(item._id, type === 'isSuccess' ? { isSuccess: !item.isSuccess } : { isHiddenTranscription: !item.isHiddenTranscription })
            if (res?.ok) {
                if (res?.isSuccess) {
                    toast.success(`Đã cập nhật trạng thái thành công`, {
                        description: 'Bộ thẻ này đã được đánh dấu là hoàn thành.',
                        duration: 5000,
                        position: 'top-center',
                    })
                    item.isSuccess = !item.isSuccess
                }
                if (res?.isHiddenTranscription) {
                    toast.success(`Đã cập nhật phiên âm thành công`, {
                        description: 'Phiên âm đã được cập nhật.',
                        duration: 5000,
                        position: 'top-center',
                    })
                    item.isHiddenTranscription = !item.isHiddenTranscription
                }
            } else {
                console.error('Failed to toggle transcription visibility:', res?.message)
                toast.error(`"Không thể cập nhật phiên âm`, {
                    description: res?.message,
                    duration: 10000,
                    position: 'top-center',
                })
            }
        } catch (error: any) {
            console.error(error.message)
            toast.error(`Không thể cập nhật phiên âm`, {
                description: error.message,
                duration: 10000,
                position: 'top-center',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFlashcardList = async (e: any, listFlashcardId: string) => {
        try {
            e.preventDefault()
            setLoading(true)
            const res = await flashcardService.removeListFlashcards(listFlashcardId)
            if (res?.ok) {
                toast.success(`Đã xóa bộ thẻ thành công`, {
                    duration: 5000,
                    position: 'top-center',
                })
            }
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }

    const percent = Math.round(((statusCounts.learned + statusCounts.remembered) / item.flashcards.length) * 100)
    return (
        <Link
            to={`/flashcard/${item?._id}`}
            className="relative group overflow-hidden w-full  bg-white/80  dark:bg-slate-800/50 border border-white/10 rounded-md shadow-sm px-5 py-3 hover:shadow-md transition-all duration-300  items-start space-y-3 "
        >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
            <div className="flex items-start justify-between mt-0">
                <div className="flex-1">
                    <h1 className=" font-bold line-clamp-1 text-gray-900 dark:text-white/80 text-xl duration-300" title={item.title}>
                        {item.title}
                    </h1>

                    <p className="text-md line-clamp-1 text-gray-600 dark:text-white/60" title={item.desc}>
                        {item.desc || 'Không có mô tả'}
                    </p>
                    {item?.last_practice_date && (
                        <p className="line-clamp-1  text-md text-gray-600 dark:text-white/60">Lần học cuối: {handleCompareDate(item?.last_practice_date) || 'Không có mô tả'}</p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="">{getLanguageFlag(item.language)}</div>
                    <Badge variant="secondary">{item.flashcards?.length || 0} từ</Badge>
                </div>
            </div>
            <div className="flex items-start text-sm dark:text-white/60">
                <div className="flex-1 flex flex-col item-center text-center text-green-600 dark:text-green-400">
                    <p className="text-2xl font-semibold">{statusCounts.learned}</p>
                    <p className="">Đã nhớ</p>
                </div>
                <div className="flex-1 flex flex-col item-center text-center text-purple-600 dark:text-purple-400">
                    <p className="text-2xl font-semibold">{statusCounts.remembered}</p>
                    <p className="">Đang học</p>
                </div>
                <div className="flex-1 flex flex-col item-center text-center text-orange-600 dark:text-orange-400">
                    <p className="text-2xl font-semibold">{statusCounts.reviewing}</p>
                    <p className="">Từ mới</p>
                </div>
                <div className="flex-1 flex flex-col item-center text-center text-indigo-600 dark:text-indigo-400">
                    <p className="text-2xl font-semibold">{item.accuracyPercentage || 0}%</p>
                    <p className="">Chính xác</p>
                </div>
            </div>
            <div className="">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-gray-600 dark:text-white/60">Tiến trình học</p>
                    <p>{percent || 0}%</p>
                </div>
                <Progress value={percent}></Progress>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                    {item.flashcards?.length > 0 && item.countCardsDueToday > 0 ? (
                        <>
                            <Play />
                            Học ngay ({item.countCardsDueToday} từ vựng)
                        </>
                    ) : (
                        <>
                            <Eye />
                            Xem chi tiết
                        </>
                    )}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline" className="">
                            <Settings />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Các tính năng</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={(e) => handleUpdate(e, 'isHiddenTranscription')}>
                            {item.isHiddenTranscription ? <>{loading ? <Loading /> : <Eye />} Bật phiên âm (pinyin)</> : <>{loading ? <Loading /> : <EyeClosed />} Tắt phiên âm (pinyin)</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleUpdate(e, 'isSuccess')}>
                            {loading ? <Loading /> : <SquareCheckBig />}
                            Đã hoàn thành bộ này
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={(e) => handleRemoveFlashcardList(e, item._id)}>
                            <Trash2 /> Xóa bộ thẻ này
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Link>
    )
}
