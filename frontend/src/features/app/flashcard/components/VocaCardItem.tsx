import { useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Volume2, BookOpen, MessageCircle, Lightbulb, MoreVertical, Edit3, ChevronUp, ChevronDown, Trash2, History } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import HistoryViewModal from './HistoryViewModal'
import { formatDistanceToNowStrict } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toast } from 'sonner'
import type { Flashcard } from '@/types/flashcard'
import type { IUser } from '@/types/user'
import flashcardService from '@/services/flashcardService'
import Loading from '@/components/ui/loading'
interface Props {
    data: Flashcard
    speakWord: (word: string, id?: string) => void
    loadingAudio: any
    setIsEditOpen: (value: boolean) => void
    setEditFlashcard: (data: Flashcard) => void
    user?: IUser | null
    listFlashcard: any
    setListFlashcard: any
    setFilteredFlashcards: any
    viewMode: string // "full" or "simple"
}
export default function VocaCardItem({ data, speakWord, loadingAudio, setIsEditOpen, setEditFlashcard, user, listFlashcard, setListFlashcard, setFilteredFlashcards, viewMode }: Props) {
    const [showExamples, setShowExamples] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [loadingConfirm, setLoadingConfirm] = useState(false)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'learned':
                return ' bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
            case 'reviewing':
                return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
            case 'remembered':
                return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
        }
    }

    const getBorderColor = (status: string) => {
        switch (status) {
            case 'learned':
                return ' border-l-green-500 dark:border-l-green-400'
            case 'reviewing':
                return 'border-l-orange-500 dark:border-l-orange-400'
            case 'remembered':
                return 'border-l-blue-500 dark:border-l-blue-400'
            default:
                return 'border-l-gray-500 dark:border-l-gray-400'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'learned':
                return 'Đã học'
            case 'reviewing':
                return 'Cần ôn tập'
            case 'remembered':
                return 'Đang ghi nhớ'
            default:
                return 'Chưa học'
        }
    }

    const handleEdit = () => {
        setIsEditOpen(true)
        setEditFlashcard(data)
    }

    const handleDelete = useCallback(async (id: string) => {
        try {
            setLoadingConfirm(true)
            const req = await flashcardService.deleteFlashcardFromList(id, listFlashcard?._id)
            // const req = await POST_API(`/flashcards/${id}`, { list_flashcard_id: listFlashcard?._id }, "DELETE", token)
            // const res = await req?.json()

            if (req.ok) {
                setFilteredFlashcards((prev: any) => prev.filter((item: any) => item._id !== id))

                setListFlashcard((prev: any) => {
                    if (!prev) return prev
                    return {
                        ...prev,
                        flashcards: prev.flashcards?.filter((item: any) => item._id !== id) || [],
                    }
                })
                setOpenDelete(false)
                toast.success('Xóa flashcard thành công')
            } else {
                toast.error('Xóa flashcard không thành công', {
                    description: req.message,
                    position: 'top-center',
                })
            }
        } catch (error) {
            console.error('Error deleting flashcard:', error)
            toast.error('Xóa flashcard không thành công')
        } finally {
            setLoadingConfirm(false)
        }
    }, [])

    return (
        <Card className={`w-full max-w-2xl md:max-w-full mx-auto shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 overflow-hidden h-full ${getBorderColor(data.status)}`}>
            <CardContent className=" h-full">
                {/* Header with status */}
                <div className="flex items-center justify-between pb-2">
                    <Badge className={`${getStatusColor(data.status)} font-medium`}>
                        {getStatusText(data.status)}
                        {data.status === 'reviewing' ? '' : ': ' + data.progress?.percentage + '%'}
                    </Badge>
                    <div className={`flex items-center gap-2 text-xs text-gray-500 dark:text-white/70 ${viewMode === 'simple' && 'hidden'}`}>
                        {data && data.status !== 'reviewing' && (
                            <span>
                                {new Date(data.nextReviewDate) > new Date()
                                    ? `Còn ${formatDistanceToNowStrict(new Date(data.nextReviewDate), { locale: vi, addSuffix: true })} để ôn tập lại`
                                    : `Quá hạn ${formatDistanceToNowStrict(new Date(data.nextReviewDate), { locale: vi, addSuffix: true })}`}
                            </span>
                        )}
                    </div>
                    {/* Action Menu */}
                    {user?._id === data?.userId && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Edit3 className="w-4 h-4 mr-2  cursor-pointer" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
                                    <History className="w-4 h-4 mr-2 cursor-pointer" />
                                    Lịch sử học
                                </DropdownMenuItem>
                                <DropdownMenuItem className="dark:text-red-400 text-red-600 w-full  cursor-pointer" onClick={() => setOpenDelete(true)}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Xóa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Bạn có chắc chắn muốn xóa không</DialogTitle>
                            <DialogDescription>Việc xóa sẽ không thể hoàn tác. Bạn có chắc chắn muốn xóa từ vựng này khỏi flashcard của mình?</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Hủy</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={() => handleDelete(data._id)} disabled={loadingConfirm}>
                                {loadingConfirm ? <Loading /> : <Trash2 />} Xóa
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <HistoryViewModal history={data.history} isHistoryOpen={isHistoryOpen} setIsHistoryOpen={setIsHistoryOpen}></HistoryViewModal>

                {/* Main content */}
                <div className="">
                    {/* Chinese sentence - Main focus */}
                    <div className="mb-4">
                        <div className="flex items-start gap-3 mb-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-1">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white/80 leading-relaxed mb-2">{data.title}</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-6 w-6 p-0 text-gray-400 hover:text-gray-400 ${viewMode !== 'simple' && 'hidden'}`}
                                        disabled={loadingAudio}
                                        onClick={() => speakWord(data.title, data._id)}
                                    >
                                        {loadingAudio ? <Loading /> : <Volume2 className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className={`flex items-center flex-wrap gap-2 mb-3 ${viewMode === 'simple' ? 'hidden' : ''}`}>
                                    <p className={`text-base text-gray-400 font-mono ${listFlashcard.isHiddenTranscription && 'hidden'}`}>{data.transcription}</p>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-400" disabled={loadingAudio} onClick={() => speakWord(data.title, data._id)}>
                                        {loadingAudio ? <Loading /> : <Volume2 className="w-4 h-4" />}
                                    </Button>
                                    <span className={`text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded`}>{data.type_of_word || 'N/A'}</span>
                                    <span className={`text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded`}>{data.level}</span>
                                </div>
                            </div>
                        </div>
                        {/* Vietnamese meaning */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
                            <div className="flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-300 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-900 mb-1 dark:text-gray-200">Định nghĩa:</p>
                                    <p className="text-gray-700 leading-relaxed dark:text-gray-100">{data.define}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Examples section */}
                    <div className={`space-y-3 ${viewMode === 'simple' && 'hidden'}`}>
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white/80 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-gray-600 dark:text-white/60" />
                                Ví dụ ({data.example?.length})
                            </h4>
                            <Button variant="ghost" size="sm" onClick={() => setShowExamples(!showExamples)} className="text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400">
                                {showExamples ? <ChevronUp /> : <ChevronDown />} {showExamples ? 'Thu gọn' : 'Xem ví dụ'}
                            </Button>
                        </div>

                        {showExamples && (
                            <div className="">
                                {data.example.map((exa, index: any) => (
                                    <div
                                        key={index}
                                        className="dark:hover:border-gray-400 duration-300 cursor-pointer py-3  border-l-2 border-gray-200 dark:border-gray-600 dark:hover:text-white text-gray-400 pl-4 rounded-md group "
                                        onClick={() => speakWord(exa.en, index)}
                                    >
                                        <div className="space-y-2">
                                            {/* Chinese exa */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium   min-w-5">{index + 1}.</span>
                                                <p className="light:text-gray-900 flex-1 ">{exa.en}</p>
                                                <Button variant="ghost" size="sm" disabled={loadingAudio} className="h-6 w-6 p-0 text-gray-400 group-hover:scale-125 duration-300 transition-all">
                                                    {loadingAudio ? <Loading /> : <Volume2 className="w-3 h-3" />}
                                                </Button>
                                            </div>

                                            {/* Pinyin */}
                                            <div className="ml-6">
                                                {listFlashcard.isHiddenTranscription && <p className="text-sm  font-mono mb-1">{exa.trans}</p>}

                                                <p className="text-sm italic">{exa.vi}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes section */}
                    {data.note && viewMode === 'full' && (
                        <>
                            <Separator className="my-4" />
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-gray-600 dark:text-gray-200 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900 mb-1 dark:text-gray-200">Ghi chú:</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-100 leading-relaxed">{data.note}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
