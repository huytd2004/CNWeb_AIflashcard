import { useEffect, useState, useCallback } from 'react'

// import { languageOption } from "@/lib/languageOption";
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, BookOpen, Brain, Flag, GalleryVerticalEnd, Grid3X3, Grid3x3, List, PencilLine, Plus, RefreshCcw, RotateCcw, Target, Trash2, User, Volume2 } from 'lucide-react'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import flashcardService from '@/services/flashcardService'
import type { Flashcard, IEditFlashcard, IListFlashcard, IWordCount } from '@/types/flashcard'
import { EdgeSpeechTTS } from '@lobehub/tts'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import VoiceSelectionModal from '../components/VoiceSelectionModal'
import { EditListFlashcardModal } from '../components/EditListFlashcardModal'
import AddMoreVocaModal from '../components/AddMoreVocaModal'
import Loading from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { getLanguageFlag, getLanguageName } from '@/lib/utilUI'
import AddVocaModal from '../components/AddVocaModal'
import VocaCardItem from '../components/VocaCardItem'
import EditVocaModal from '../components/EditVocaModal'
import LoadingGrid from '@/components/etc/LoadingGrid'

export default function FlashcardDetailPage() {
    const [loading, setLoading] = useState(false)
    const [loadingConfirm, setLoadingConfirm] = useState(false)
    const [loadingAudio, setLoadingAudio] = useState(null)
    const [disableAudio, setDisableAudio] = useState(false)
    const [selectedVoice, setSelectedVoice] = useState('')
    const [editFlashcard, setEditFlashcard] = useState<Flashcard>()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [viewMode, setViewMode] = useState('full') // full or simple
    const location = useLocation()
    const id_flashcard = location.pathname.split('/')[2]
    const navigate = useNavigate()
    const { user } = useAuth()
    const sortFlashcards = (flashcards: any) => {
        return flashcards?.sort((a: any, b: any) => {
            return new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
        })
    }

    const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[] | null>(null)
    const [listFlashcard, setListFlashcard] = useState<IListFlashcard>()
    const [editListFlashcard, setEditListFlashcard] = useState<IEditFlashcard>()
    const [statusCounts, setStatusCount] = useState<IWordCount>()

    useEffect(() => {
        const fetchAPI = async () => {
            const req = await flashcardService.getFlashcardDetail(id_flashcard)
            if (req?.ok) {
                setListFlashcard(req?.listFlashCards)
                setFilteredFlashcards(sortFlashcards(req?.listFlashCards?.flashcards))
                setEditListFlashcard(req?.listFlashCards)
                setStatusCount(req?.statusCounts)
            }
        }
        try {
            setLoading(true)
            fetchAPI()
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }, [id_flashcard])

    useEffect(() => {
        if (!listFlashcard?.language) return // Đợi listFlashcard load xong

        const defaultVoices = {
            english: 'en-GB-SoniaNeural',
            vietnamese: 'vi-VN-HoaiMyNeural',
            germany: 'de-DE-KatjaNeural',
            france: 'fr-FR-DeniseNeural',
            japan: 'ja-JP-NanamiNeural',
            korea: 'ko-KR-SunHiNeural',
            chinese: 'zh-CN-XiaoxiaoNeural',
        }

        // Lấy hoặc tạo mới defaultVoices trong localStorage
        let savedVoices
        const savedVoiceString = localStorage.getItem('defaultVoices')

        if (savedVoiceString) {
            try {
                savedVoices = JSON.parse(savedVoiceString)
            } catch (error) {
                console.error('Error parsing saved voices:', error)
                savedVoices = defaultVoices
                localStorage.setItem('defaultVoices', JSON.stringify(defaultVoices))
            }
        } else {
            savedVoices = defaultVoices
            localStorage.setItem('defaultVoices', JSON.stringify(defaultVoices))
        }

        // Lấy voice cho ngôn ngữ hiện tại
        const currentVoice = savedVoices[listFlashcard.language as keyof typeof defaultVoices] || defaultVoices.english
        setSelectedVoice(currentVoice)
    }, [listFlashcard?.language])

    const getStatCard = [
        {
            type: 'all',
            borderColor: 'border-l-gray-500 dark:border-l-gray-400',
            textColor: 'text-gray-500 dark:text-gray-400',
            count: listFlashcard?.flashcards?.length || 0,
            title: 'Tất cả thẻ',
            icon: GalleryVerticalEnd,
        },
        {
            type: 'learned',
            borderColor: 'border-l-green-500 dark:border-l-green-400',
            textColor: 'text-green-500 dark:text-green-400',
            count: statusCounts?.learned || 0,
            title: 'Đã nhớ',
            icon: BookOpen,
        },
        {
            type: 'remembered',
            borderColor: 'border-l-blue-500 dark:border-l-blue-400',
            textColor: 'text-blue-500 dark:text-blue-400',
            count: statusCounts?.remembered || 0,
            title: 'Đang ghi nhớ',
            icon: Brain,
        },
        {
            type: 'reviewing',
            borderColor: 'border-l-orange-500 dark:border-l-orange-400',
            textColor: 'text-orange-500 dark:text-orange-400',
            count: statusCounts?.reviewing || 0,
            title: 'Cần ôn tập',
            icon: RotateCcw,
        },
    ]

    const handleDeleteListFlashcard = async () => {
        try {
            setLoadingConfirm(true)
            const req = await flashcardService.removeListFlashcards(id_flashcard)

            if (req?.ok) {
                navigate(-1)
            }
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoadingConfirm(false)
        }
    }

    const [tts] = useState(() => new EdgeSpeechTTS({ locale: 'en-US' }))

    const speakWord = useCallback(
        async (text: string, id: any) => {
            if (disableAudio) return

            const voice = selectedVoice

            try {
                setLoadingAudio(id)
                setDisableAudio(true)

                const response = await tts.create({
                    input: text,
                    options: {
                        voice: voice,
                    },
                })

                const audioBuffer = await response.arrayBuffer()
                const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
                const url = URL.createObjectURL(blob)
                const audio = new Audio(url)

                audio.addEventListener('ended', () => {
                    URL.revokeObjectURL(url)
                })

                audio.play()
            } catch (error) {
                console.error('TTS Error:', error)
                toast.error('Có lỗi sảy ra', {
                    description: error instanceof Error ? error.message : 'Lỗi không xác định',
                    duration: 3000,
                    position: 'top-center',
                })
            } finally {
                setLoadingAudio(null)
                setTimeout(() => {
                    setDisableAudio(false)
                }, 1000)
            }
        },
        [disableAudio, listFlashcard?.language, tts, selectedVoice]
    )

    const handleFilter = (filter: string) => {
        if (!listFlashcard?.flashcards) return

        let filtered = listFlashcard.flashcards

        switch (filter) {
            case 'learned':
                filtered = listFlashcard.flashcards.filter((item) => item.status === 'learned')
                break
            case 'remembered':
                filtered = listFlashcard.flashcards.filter((item) => item.status === 'remembered')
                break
            case 'reviewing':
                filtered = listFlashcard.flashcards.filter((item) => item.status === 'reviewing')
                break
            case 'all':
                filtered = listFlashcard.flashcards
        }

        setFilteredFlashcards(sortFlashcards(filtered))
    }

    const handleRefresh = async () => {
        try {
            setLoading(true)

            const res = await flashcardService.getFlashcardDetail(id_flashcard)
            // const newData = await GET_API(`/flashcards/${id_flashcard}`, token)

            if (res?.listFlashCards) {
                const sortedFlashcards = sortFlashcards(res.listFlashCards.flashcards)
                setListFlashcard(res.listFlashCards)
                setFilteredFlashcards(sortedFlashcards)
                setEditListFlashcard(res.listFlashCards)

                toast.success('Đã làm mới dữ liệu!', { position: 'top-center' })
            }
        } catch (error: any) {
            console.error('Error refreshing flashcard:', error)
            toast.error('Làm mới không thành công', {
                description: error.message,
                position: 'top-center',
                id: 'refresh-flashcard',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full space-y-5 relative z-10 dark:bg-slate-700 bg-gray-200">
            <div className="bg-white dark:bg-slate-800 p-2 md:p-5 border-b border-gray-200 dark:border-white/10 space-y-3">
                <div className="flex justify-between  items-start md:items-center flex-col md:flex-row gap-5 md:gap-0">
                    <div className="flex w-full md:items-center flex-col md:flex-row gap-5 justify-between md:justify-start flex-1">
                        <Button className="w-full md:w-auto" variant="outline" onClick={() => navigate(-1)}>
                            <ArrowLeft /> Quay lại
                        </Button>
                        <div className="">
                            <h1 className="text-primary text-2xl font-bold">Flashcard: {listFlashcard?.title}</h1>
                            <p className="text-gray-400 dark:text-white/50 text-sm">{listFlashcard?.desc || 'Không có mô tả...'} </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap dark:text-white/80">
                        <Button className="dark:text-white" variant="outline" onClick={handleRefresh} disabled={loading}>
                            <RefreshCcw className={`${loading && 'animate-spin'}`} />
                            Làm mới
                        </Button>
                        <VoiceSelectionModal selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} language={listFlashcard?.language || 'english'}>
                            <Button className="dark:text-white" variant="outline">
                                <Volume2 /> Chọn giọng nói
                            </Button>
                        </VoiceSelectionModal>

                        <div className={` items-center gap-2 md:gap-3 flex-wrap ${user?._id === String(listFlashcard?.userId._id) ? 'flex' : 'hidden'}`}>
                            <EditListFlashcardModal listFlashcard={listFlashcard} setListFlashcard={setListFlashcard} editListFlashcard={editListFlashcard}>
                                <Button className="dark:text-white" variant="outline" onClick={() => listFlashcard && setEditListFlashcard(listFlashcard as IEditFlashcard)}>
                                    <PencilLine /> Chỉnh Sửa
                                </Button>
                            </EditListFlashcardModal>
                            <AddMoreVocaModal
                                listFlashcard={listFlashcard}
                                setListFlashcard={setListFlashcard}
                                filteredFlashcards={filteredFlashcards}
                                setFilteredFlashcards={setFilteredFlashcards}
                                speakWord={speakWord}
                            >
                                <Button className="dark:text-white" variant="outline">
                                    <Grid3x3 /> Thêm nhiều
                                </Button>
                            </AddMoreVocaModal>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 /> Xóa
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Bạn có chắc muốn xóa flashcard này không?</AlertDialogTitle>
                                        <AlertDialogDescription>Sau khi xóa bạn sẽ không thể khôi phục lại được nữa</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Từ chối</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteListFlashcard} disabled={loadingConfirm} className="dark:text-white">
                                            {loadingConfirm && <Loading />}Xóa
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-6 flex-wrap text-sm text-gray-600 dark:text-white/60">
                    <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        <span>Ngôn ngữ:</span>
                        <Badge variant="secondary" className="gap-1">
                            {getLanguageFlag(listFlashcard?.language || '')}
                            {getLanguageName(listFlashcard?.language || '')}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Người chia sẻ:</span>
                        <span className="font-medium cursor-pointer hover:underline" onClick={() => navigate(`/profile/${listFlashcard?.userId._id}`)}>
                            {listFlashcard?.userId?.displayName || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-3 md:px-5">
                <div className="">
                    {user?._id === String(listFlashcard?.userId?._id) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-5">
                            {getStatCard.map((card) => (
                                <div
                                    key={card.type}
                                    onClick={() => handleFilter(card.type)}
                                    className={`w-full h-24 px-5 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-between border-l-4 ${card.borderColor} ${card.textColor} shadow-sm hover:scale-105 transition-transform cursor-pointer duration-500`}
                                >
                                    <div className="">
                                        <p className=" line-clamp-1">{card.title}</p>
                                        <h3 className="text-3xl font-bold ">{card.count}</h3>
                                    </div>
                                    <div className={`w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-full`}>
                                        <card.icon />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center px-3 md:px-5 gap-2 md:gap-5 flex-wrap">
                <div className="flex bg-background rounded-lg p-1 shadow-sm">
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                            <Button variant={viewMode === 'full' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('full')} className="h-14 w-16 p-0 ">
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-white">Hiển thị thông tin flashcard đầy đủ</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                            <Button variant={viewMode === 'simple' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('simple')} className="h-14 w-16 p-0 ">
                                <List className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-white">Hiển thị thông tin flashcard ngắn gọn</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                {user?._id === String(listFlashcard?.userId?._id) && (
                    <>
                        <AddVocaModal filteredFlashcards={filteredFlashcards} setFilteredFlashcards={setFilteredFlashcards} listFlashcard={listFlashcard} setListFlashcard={setListFlashcard}>
                            <Button className="dark:text-white h-16 text-md  uppercase bg-linear-to-br from-blue-700/60 to-purple-700/80  text-white md:px-10">
                                <Plus size={24} /> Thêm từ vựng
                            </Button>
                        </AddVocaModal>
                    </>
                )}
                <Link to={`/flashcard/practice/${id_flashcard}`} className="flex-1">
                    <Button variant="outline" className=" w-full h-16 dark:text-white text-md  uppercase">
                        <Target /> Luyện tập
                    </Button>
                </Link>
            </div>
            <div
                className={`pb-5 grid grid-cols-1 ${
                    viewMode === 'simple' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ' : ' md:grid-cols-3 '
                } gap-3 md:gap-4 xl:gap-5 px-3 md:px-5 w-full `}
            >
                {loading && <LoadingGrid className="h-[700px]" />}

                {!loading &&
                    filteredFlashcards &&
                    filteredFlashcards?.length > 0 &&
                    filteredFlashcards.map((item: Flashcard) => (
                        <VocaCardItem
                            key={item._id}
                            data={item}
                            speakWord={speakWord}
                            loadingAudio={loadingAudio}
                            setEditFlashcard={setEditFlashcard}
                            setIsEditOpen={setIsEditOpen}
                            user={user}
                            setFilteredFlashcards={setFilteredFlashcards}
                            listFlashcard={listFlashcard}
                            setListFlashcard={setListFlashcard}
                            viewMode={viewMode}
                        />
                    ))}
                {!loading && filteredFlashcards?.length === 0 && (
                    <div className="col-span-full text-center h-[80vh] flex flex-col gap-2 items-center justify-center">
                        <h1 className="text-xl">Không có từ vựng nào trong flashcard này</h1>
                        <p className="text-gray-500 ">Bạn hãy bấm vào nút thêm từ vựng để học nhé</p>
                    </div>
                )}
            </div>
            {filteredFlashcards && filteredFlashcards.length === 0 && !loading && (
                <EditVocaModal
                    isEditOpen={isEditOpen}
                    setIsEditOpen={setIsEditOpen}
                    editFlashcard={editFlashcard}
                    setEditFlashcard={setEditFlashcard}
                    listFlashcard={listFlashcard}
                    filteredFlashcards={filteredFlashcards}
                    setFilteredFlashcards={setFilteredFlashcards}
                    setListFlashcard={setListFlashcard}
                ></EditVocaModal>
            )}
        </div>
    )
}
