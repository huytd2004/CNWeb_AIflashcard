/* eslint-disable no-async-promise-executor */
import { useEffect, useState, useCallback } from 'react'
import { EdgeSpeechTTS } from '@lobehub/tts'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight, Eye, Lightbulb, Volume2 } from 'lucide-react'
import { toast } from 'sonner'
import Loading from '@/components/ui/loading'
import { TbConfetti } from 'react-icons/tb'
import type { Flashcard } from '@/types/flashcard'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import flashcardService from '@/services/flashcardService'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import FeatureQuiz from './FeatureQuiz'
import FeatureFillBlank from './FeatureFillBlank'
import FeatureChoose from './FeatureChoose'
import FeatureListening from './FeatureListening'

const FEATURES = {
    FLASHCARD: 1,
    QUIZ: 2,
    LISTENING: 3,
    FILL_BLANK: 4,
    CHOOSE: 5,
    // REARRANGE: 6,
}

interface ISessionRating {
    id: string
    quality: number
    userId: string
}
export default function FlashcardPractice({ flashcardData }: { flashcardData: Flashcard[] }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0) // Vị trí hiện tại trong danh sách flashcards
    const [feature, setFeature] = useState(FEATURES.FLASHCARD)
    const [showAns, setShowAns] = useState(false)
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [inputAnswer, setInputAnswer] = useState('')
    const [quizOptions, setQuizOptions] = useState<string[]>([])
    const [loadingAudio, setLoadingAudio] = useState(false)
    const [sessionRatings, setSessionRatings] = useState<ISessionRating[]>([]) // Mảng lưu trữ các đánh giá trong phiên
    // random moder
    const [wrongCount, setWrongCount] = useState<number>(0)
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string | null }>({})
    const [isCorrectAns, setIsCorrectAns] = useState<'correct' | 'incorrect' | null>(null)
    const [voiceSetting, setVoiceSetting] = useState<any>({})
    const [isShiftDisabled, setIsShiftDisabled] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isShowTrans, setIsShowTrans] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('isShowTrans')
            return saved ? JSON.parse(saved) : false
        }
        return false
    })
    const navigate = useNavigate()
    const { user } = useAuth() || {}
    const shuffle = (array: any) => {
        let currentIndex = array.length,
            randomIndex
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
        }
        return array
    }
    // Fetch flashcards data
    const generateQuizOptions = useCallback(
        (currentCard: Flashcard) => {
            if (!currentCard || flashcards.length < 4) return

            // Đáp án đúng
            const correctOption = currentCard.title

            // Các đáp án sai
            const availableCards = flashcards.filter((card) => card._id !== currentCard._id)
            const wrongOptions = []
            while (wrongOptions.length < 3 && availableCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCards.length)
                wrongOptions.push(availableCards[randomIndex].title)
                availableCards.splice(randomIndex, 1)
            }

            // Trộn đáp án đúng và đáp án sai
            const options = [correctOption, ...wrongOptions]
            setQuizOptions(options.sort(() => Math.random() - 0.5))
        },
        [flashcards]
    )
    useEffect(() => {
        if (flashcardData?.length > 0) {
            setFlashcards(shuffle(flashcardData))
            generateQuizOptions(flashcardData[0])

            const savedVoiceString = JSON.parse(localStorage.getItem('defaultVoices') || '{}')
            setVoiceSetting(savedVoiceString)
        }
    }, [flashcardData])

    useEffect(() => {
        if (flashcards.length > 0) {
            generateQuizOptions(flashcards[0])
        }
    }, [flashcards])

    useEffect(() => {
        if (sessionRatings.length > 0 && sessionRatings.length % 5 === 0) {
            handleCompleteSession() // Gửi các đánh giá hiện có
        }
    }, [sessionRatings]) // Chạy lại khi sessionRatings thay đổi

    const currentCard = flashcards[currentIndex]

    const [tts] = useState(() => new EdgeSpeechTTS({ locale: 'en-US' }))

    const speakWord = useCallback(
        async (text: string, language: string, retryCount = 0): Promise<void> => {
            const MAX_RETRIES = 2 // Tối đa thử lại 2 lần
            const TIMEOUT_DURATION = 4000 // 4 giây timeout

            return new Promise(async (resolve, reject) => {
                let timeoutId: any = null
                let audio: HTMLAudioElement | null = null
                let isResolved = false

                // ✅ Function để cleanup và resolve
                const cleanup = (success: boolean, error?: Error) => {
                    if (isResolved) return
                    isResolved = true

                    if (timeoutId) clearTimeout(timeoutId)
                    if (audio) {
                        audio.removeEventListener('ended', onAudioEnded)
                        audio.removeEventListener('error', onAudioError)
                        audio.pause()
                        audio.src = ''
                    }

                    setIsSpeaking(false)
                    setLoadingAudio(false)

                    if (success) {
                        resolve()
                    } else if (error) {
                        reject(error)
                    }
                }

                // ✅ Audio event handlers
                const onAudioEnded = () => {
                    cleanup(true)
                }

                const onAudioError = () => {
                    cleanup(false, new Error('Audio playback failed'))
                }

                // ✅ Timeout handler
                const onTimeout = async () => {
                    console.warn(`Audio timeout after ${TIMEOUT_DURATION}ms, attempt ${retryCount + 1}`)

                    if (retryCount < MAX_RETRIES) {
                        // Thử lại
                        cleanup(false)
                        try {
                            await speakWord(text, language, retryCount + 1)
                            resolve()
                        } catch (error) {
                            reject(error)
                        }
                    } else {
                        // Hết lượt thử lại
                        cleanup(false, new Error(`Audio timeout after ${MAX_RETRIES + 1} attempts`))
                    }
                }

                try {
                    setLoadingAudio(true)
                    setIsSpeaking(true)

                    // ✅ Set timeout
                    timeoutId = setTimeout(onTimeout, TIMEOUT_DURATION)

                    // ✅ Tạo audio
                    const response = await tts.create({
                        input: text,
                        options: {
                            voice: voiceSetting[language] || 'en-US',
                        },
                    })

                    const audioBuffer = await response.arrayBuffer()
                    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
                    const url = URL.createObjectURL(blob)

                    audio = new Audio(url)

                    // ✅ Add event listeners
                    audio.addEventListener('ended', onAudioEnded)
                    audio.addEventListener('error', onAudioError)

                    // ✅ Cleanup URL sau khi audio ended
                    audio.addEventListener('ended', () => {
                        URL.revokeObjectURL(url)
                    })

                    // ✅ Play audio
                    await audio.play()
                } catch (error: any) {
                    console.error('TTS Error:', error)

                    if (retryCount < MAX_RETRIES) {
                        // Thử lại khi có lỗi
                        cleanup(false)

                        try {
                            await speakWord(text, language, retryCount + 1)
                            resolve()
                        } catch (retryError) {
                            reject(retryError)
                        }
                    } else {
                        // Hết lượt thử lại
                        toast.error('Không thể phát âm', {
                            description: `Đã thử ${MAX_RETRIES + 1} lần nhưng không thành công`,
                            duration: 3000,
                            position: 'top-center',
                        })
                        cleanup(false, error)
                    }
                }
            })
        },
        [tts, voiceSetting]
    )

    // Navigation handlers
    const setDefaultValue = useCallback(() => {
        setIsFlipped(false)
        setInputAnswer('')
        setShowAns(false)
    }, [])

    const handlePlayAudio = (method: string) => {
        if (method == 'correct') {
            const audio = new Audio('/audio/correct.mp3')
            audio.play()
        } else if (method == 'wrong') {
            const audio = new Audio('/audio/wrong.mp3')
            audio.play()
        }
    }

    const handleChangeIndex = useCallback(async () => {
        const newIndex = currentIndex < flashcards.length - 1 ? currentIndex + 1 : 0
        setCurrentIndex(newIndex)
        setDefaultValue() // Reset các giá trị về mặc định
        if (feature === FEATURES.FLASHCARD || feature === FEATURES.LISTENING) {
            await speakWord(flashcards[newIndex].title, flashcards[newIndex].language || 'english')
        }

        generateQuizOptions(flashcards[newIndex])
    }, [currentIndex, flashcards, feature, speakWord, generateQuizOptions, setDefaultValue])

    // === 3. Xử lý đánh giá chất lượng thẻ (0-5) ===
    const handleRate = async (quality: number) => {
        const newRating = { id: currentCard._id, quality: quality, userId: user?._id || '' }
        setSessionRatings([...sessionRatings, newRating]) // Cập nhật mảng đánh giá
        setWrongCount(0) // Reset wrong count sau khi đánh giá
        if (flashcards && currentIndex < flashcards.length - 1) {
            handleChangeIndex()
        } else {
            if (sessionRatings.length > 0) {
                setIsSuccess(true)
                toast.success('Đã hoàn thành phiên ôn tập!', {
                    duration: 5000,
                })
                // handleCompleteSession()
            }
        }
    }

    const handleQuizAnswer = async (selectedAnswer: string, idx: number) => {
        const isCorrect = selectedAnswer === currentCard.title

        // ✅ Set selected answer ngay lập tức để disable buttons
        setSelectedAnswers({
            ...selectedAnswers,
            [idx]: isCorrect ? 'correct' : 'incorrect',
        })

        toast[isCorrect ? 'success' : 'error'](isCorrect ? 'Chính xác, giỏi quá' : 'Sai mất rồi :(', {
            duration: 2000,
            position: 'top-center',
        })

        if (isCorrect) {
            handlePlayAudio('correct')

            await speakWord(currentCard.title, currentCard.language || 'english')

            handleRate(wrongCount > 0 ? 3 : 4) // Đánh giá 5 sao cho thẻ flashcard
            setSelectedAnswers({}) // ✅ Reset selected answers
        } else {
            handlePlayAudio('wrong')

            await speakWord(currentCard.title, currentCard.language || 'english')

            setWrongCount((prev) => prev + 1)
            setSelectedAnswers({}) // ✅ Reset để cho phép chọn lại
        }
    }

    // Listening practice handler
    const checkListeningAnswer = useCallback(() => {
        const isCorrect = inputAnswer.toLowerCase() === currentCard.title.toLowerCase()
        toast[isCorrect ? 'success' : 'error'](isCorrect ? 'Chính xác, giỏi quá' : 'Sai mất rồi :((', {
            duration: 2000,
            position: 'top-center',
        })
        setIsCorrectAns(isCorrect ? 'correct' : 'incorrect')
        if (isCorrect) {
            handlePlayAudio('correct')
            setTimeout(() => {
                handleRate(wrongCount > 0 ? 3 : 5) // Đánh giá 5 sao cho thẻ flashcard
                setIsCorrectAns(null) // Reset về null thay vì false
            }, 1000)
        } else {
            handlePlayAudio('wrong')
            setWrongCount((prev) => prev + 1)
            // handleRate(0) // Đánh giá 0 sao cho thẻ flashcard
            setTimeout(() => {
                setIsCorrectAns(null)
            }, 820)
        }
    }, [inputAnswer, flashcards, currentIndex])

    const handleCompleteSession = async () => {
        // ✅ Sử dụng parameter hoặc fallback về state
        if (sessionRatings.length === 0) {
            toast.error('Không có đánh giá nào để gửi')
            return
        }
        if (!user) {
            toast.error('Bạn cần đăng nhập để lưu đánh giá ôn tập.', {
                duration: 10000,
            })
            return
        }

        setSessionRatings([]) // Clear state
        setCurrentIndex(0) // Reset current index
        setFlashcards((prev) => (prev ? prev.slice(sessionRatings.length) : []))
        toast.loading('Đang gửi dữ liệu ôn tập...', {
            position: 'top-center',
            id: 'send-session',
        })

        try {
            const res = await flashcardService.batchRateFlashcards(sessionRatings)

            if (res?.ok) {
                toast.success('Đã gửi dữ liệu ôn tập thành công!', {
                    duration: 3000,
                    position: 'top-center',
                    id: 'send-session',
                })
            }
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            toast.dismiss('send-session')
        }
    }

    // Keyboard navigation
    const handleKeyDown = useCallback(
        async (e: any) => {
            switch (e.key.toLowerCase()) {
                case 'alt':
                    e.preventDefault()
                    if (feature === FEATURES.LISTENING || feature === FEATURES.FILL_BLANK) {
                        setShowAns((prev) => !prev)
                        if (!showAns) {
                            setInputAnswer(currentCard.title) // Hiển thị đáp án khi bấm space
                        }
                    }
                    break
                case ' ':
                    if (feature === FEATURES.FLASHCARD) {
                        setIsFlipped((prev) => !prev)
                    }
                    break
                case 'enter':
                    if (feature === FEATURES.LISTENING || feature === FEATURES.FILL_BLANK) {
                        checkListeningAnswer()
                    }
                    break
                case 'shift':
                    // Phát âm thanh với accent đang được chọn
                    if (!isShiftDisabled) {
                        setIsShiftDisabled(true)
                        speakWord(currentCard?.title, currentCard?.language || 'english')
                        setTimeout(() => {
                            setIsShiftDisabled(false)
                        }, 2000)
                    }
                    break
                case '/':
                    e.preventDefault()
                    setIsShowTrans((prev: any) => {
                        localStorage.setItem('isShowTrans', JSON.stringify(!prev))
                        return !prev
                    })
                    break

                default:
                    break
            }
        },
        [feature, checkListeningAnswer]
    )

    if (flashcards === null || flashcards === undefined) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-3">
                <p className="text-gray-500">Vui lòng thêm từ mới vào danh sách flashcard.</p>
                <Eye size={50} className="text-gray-400" />
                <h1>Không có từ nào trong bộ flashcard này</h1>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    <ArrowLeft /> Quay lại
                </Button>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-3 text-gray-500 dark:text-gray-400">
                <TbConfetti size={50} className="" />
                <p className="">Chúc mừng bạn đã hoàn thành phiên ôn tập!</p>
                <p className="">Hãy tiếp tục học tập và nâng cao kiến thức của mình nhé!</p>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    <ArrowLeft /> Quay lại
                </Button>
            </div>
        )
    }
    return (
        <div className="relative z-10 px-3 flex justify-center items-center py-5">
            <div className="w-full md:w-[1000px] xl:w-[1200px] focus-visible:outline-none min-h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
                <div className="w-full flex items-center justify-center min-h-[80vh] flex-col gap-2">
                    <div className="w-full text-left">
                        <Button className="w-full md:w-auto" variant="outline" onClick={() => navigate(-1)}>
                            <ArrowLeft /> Quay lại
                        </Button>
                    </div>

                    {/* Progress Display */}
                    <div className="space-y-2 block md:hidden w-full">
                        <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span>Đã học:</span>
                                <span>
                                    {sessionRatings.length}/{flashcards.length}
                                </span>
                            </div>

                            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{
                                        width: `${sessionRatings.length / 0.05}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-5 items-start">
                        <div className="w-full flex flex-col gap-5">
                            {/* Main Flashcard Container */}
                            <div
                                className=" relative w-full h-[500px] border border-white/10 rounded-md  shadow-md bg-white dark:bg-slate-800/50 dark:text-white"
                                style={{ perspective: '1000px' }}
                                onClick={feature === FEATURES.FLASHCARD ? () => setIsFlipped(!isFlipped) : undefined}
                            >
                                {/* Flashcard Feature */}
                                {feature === FEATURES.FLASHCARD && (
                                    <div
                                        className={`rounded-lg  cursor-pointer absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? 'rotate-y-180' : ''}`}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Front Side */}
                                        <div
                                            className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center backface-hidden p-5"
                                            style={{ backfaceVisibility: 'hidden' }}
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <p className="text-2xl font-semibold">{currentCard?.title}</p>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        speakWord(currentCard?.title, currentCard?.language || 'english')
                                                    }}
                                                    className=""
                                                    disabled={loadingAudio}
                                                    variant="outline"
                                                >
                                                    {loadingAudio ? <Loading /> : <Volume2 size={24} />}
                                                </Button>
                                            </div>
                                            {!isShowTrans && <p className="text-gray-500 text-lg font-bold">{currentCard?.transcription}</p>}

                                            <p className="text-gray-500 text-sm">(Click to flip)</p>
                                        </div>

                                        {/* Back Side */}
                                        <div
                                            className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center p-5 backface-hidden"
                                            style={{
                                                backfaceVisibility: 'hidden',
                                                transform: 'rotateY(180deg)',
                                            }}
                                        >
                                            {isFlipped && (
                                                <>
                                                    <p className="text-lg ">{currentCard?.define}</p>
                                                    <p className="text-gray-500 text-lg font-bold">{currentCard?.transcription}</p>
                                                </>
                                            )}

                                            {currentCard?.example && (
                                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-200 rounded-lg w-full">
                                                    {isFlipped && (
                                                        <>
                                                            {' '}
                                                            <p className="font-medium mb-2 inline-flex gap-2 items-center">
                                                                <Lightbulb />
                                                                Ví dụ:
                                                            </p>
                                                            <div className="text-slate-800 dark:text-slate-400">
                                                                <div className="mb-2">
                                                                    <p className="font-bold italic">{currentCard.example[0]?.en}</p>
                                                                    <p className="italic">{currentCard.example[0]?.vi}</p>
                                                                </div>
                                                                <div className="mb-2">
                                                                    <p className="font-bold italic">{currentCard.example[1]?.en}</p>
                                                                    <p className="italic">{currentCard.example[1]?.vi}</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-center mt-3">
                                                <Button
                                                    variant="secondary"
                                                    disabled={flashcards.length < currentIndex}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleChangeIndex()
                                                    }}
                                                >
                                                    Tiếp tục <ChevronRight />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Quiz Feature */}
                                {feature === FEATURES.QUIZ && (
                                    <FeatureQuiz
                                        currentCard={currentCard}
                                        quizOptions={quizOptions}
                                        handleQuizAnswer={handleQuizAnswer}
                                        selectedAnswers={selectedAnswers}
                                        loadingAudio={loadingAudio}
                                        isSpeaking={isSpeaking}
                                    />
                                )}

                                {/* Listening Feature */}
                                {feature === FEATURES.LISTENING && (
                                    <FeatureListening
                                        currentCard={currentCard}
                                        speakWord={speakWord}
                                        inputAnswer={inputAnswer}
                                        setInputAnswer={setInputAnswer}
                                        isCorrectAns={isCorrectAns}
                                        checkListeningAnswer={checkListeningAnswer}
                                    />
                                )}

                                {/* Fill in the blank Feature */}
                                {feature === FEATURES.FILL_BLANK && (
                                    <FeatureFillBlank
                                        currentCard={currentCard}
                                        speakWord={speakWord}
                                        inputAnswer={inputAnswer}
                                        setInputAnswer={setInputAnswer}
                                        isCorrectAns={isCorrectAns}
                                        checkListeningAnswer={checkListeningAnswer}
                                        showAns={showAns}
                                        setShowAns={setShowAns}
                                    />
                                )}
                                {/* Choose Feature */}
                                {feature === FEATURES.CHOOSE && (
                                    <FeatureChoose
                                        flashcards={flashcards}
                                        handlePlayAudio={handlePlayAudio}
                                        userId={user?._id || ''}
                                        speakWord={speakWord}
                                        sessionRatings={sessionRatings}
                                        setSessionRatings={setSessionRatings}
                                    />
                                )}

                                {/* ReArrange Feature */}
                                {/* {feature === FEATURES.REARRANGE && <FeatureReArrage flashcards={flashcards} />} */}
                            </div>

                            {/* Navigation Controls */}
                        </div>

                        {/* Feature Selection Panel */}
                        <div className="w-full md:w-auto flex flex-col gap-4">
                            {/* <div className="space-y-2">
                                <h2 className="font-medium">Cài đặt</h2>
                                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                                    <div className="">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Switch checked={reverse} onCheckedChange={(checked) => setReverse(checked)} />
                                            <span>{reverse ? "Bật" : "Tắt"}</span>
                                        </div>
                                        <p className="text-xs text-white/60">Giúp bạn đảo ngược ý nghĩa trong chế độ Fill Blank</p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="space-y-2">
                                <h2 className="font-medium">Chế độ học</h2>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries({
                                        Flashcard: FEATURES.FLASHCARD,
                                        Quiz: FEATURES.QUIZ,
                                        Listening: FEATURES.LISTENING,
                                        'Fill Blank': FEATURES.FILL_BLANK,
                                        Choose: FEATURES.CHOOSE,
                                        // ReArrange: FEATURES.REARRANGE,
                                    }).map(([name, value]) => (
                                        <Button
                                            className="dark:text-white"
                                            key={value}
                                            onClick={() => {
                                                setFeature(value)
                                                setSessionRatings([])
                                            }}
                                            variant={feature === value ? 'default' : 'secondary'}
                                        >
                                            {name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Display */}

                            <div className="space-y-2 hidden md:block">
                                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span>Còn:</span>
                                        <span>{flashcards.length} từ</span>
                                    </div>

                                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${sessionRatings.length / 0.05}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Keyboard Shortcuts Guide */}
                            <div className="space-y-2">
                                <h2 className="font-medium">Phím tắt</h2>
                                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg space-y-3 text-gray-500 dark:text-white">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Space</kbd>
                                        <span className="">Lật thẻ</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Enter</kbd>
                                        <span className="">Kiểm tra đáp án</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Alt</kbd>
                                        <span className="">Hiển thị đáp án</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Shift</kbd>
                                        <span className="">Phát âm thanh</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">/</kbd>
                                        <span className="">{isShowTrans ? 'Bật' : 'Ẩn'} phiên âm</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
