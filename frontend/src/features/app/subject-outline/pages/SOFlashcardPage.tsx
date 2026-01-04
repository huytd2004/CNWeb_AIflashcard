import { useEffect, useState, useCallback } from 'react'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import soService from '@/services/soService'
import { useLocation, useNavigate } from 'react-router-dom'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import LoadingScreen from '@/components/etc/LoadingScreen'
import { ArrowLeft } from 'lucide-react'
const FEATURES = {
    FLASHCARD: 1,
    QUIZ: 2,
}

interface ParsedQuestion {
    _id: string
    question: string
    answer: string
    options: string[]
    correctAnswer: string
}

export default function SOFlashcardPage() {
    const [isFlipped, setIsFlipped] = useState(false)
    const [index, setIndex] = useState(0)
    const [feature, setFeature] = useState(FEATURES.FLASHCARD)
    const [flashcards, setFlashcards] = useState<ParsedQuestion[]>([])
    const [progress, setProgress] = useState<{ known: any[]; unknown: any[] }>({
        known: [],
        unknown: [],
    })
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    const [quizOptions, setQuizOptions] = useState<string[]>([])
    // random moder
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | null>>({})
    const navigate = useNavigate()
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

    // Parse format: "A. text|B. text|C. text|D. text|correct:A"
    const parseAnswer = (answerString: string) => {
        const parts = answerString.split('|')
        const options: string[] = []
        let correctAnswer = ''

        parts.forEach((part) => {
            if (part.startsWith('correct:')) {
                correctAnswer = part.replace('correct:', '').trim()
            } else {
                // Remove "A. ", "B. ", etc and keep only the text
                const text = part.substring(part.indexOf('.') + 1).trim()
                options.push(text)
            }
        })

        return { options, correctAnswer }
    }

    useEffect(() => {
        try {
            const fetchAPI = async () => {
                setLoading(true)

                const req = await soService.getSOBySlug(location.pathname.split('/').pop() || '')
                console.log(req)
                const result = req?.quest?.data_so

                // Parse questions with new format
                const parsedQuestions: ParsedQuestion[] = result.map((item: any) => {
                    const { options, correctAnswer } = parseAnswer(item.answer)
                    return {
                        _id: item._id,
                        question: item.question,
                        answer: item.answer, // Keep original for fallback
                        options,
                        correctAnswer,
                    }
                })

                setFlashcards(shuffle(parsedQuestions))
                if (parsedQuestions.length > 0) {
                    setQuizOptions(shuffle([...parsedQuestions[0].options]))
                }
            }
            fetchAPI()
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (flashcards.length > 0) {
            setQuizOptions(shuffle([...flashcards[index].options]))
        }
    }, [flashcards, index])

    const generateQuizOptions = useCallback(
        (currentCard: ParsedQuestion) => {
            if (!currentCard || !currentCard.options || currentCard.options.length === 0) return

            // Use parsed options directly
            setQuizOptions(shuffle([...currentCard.options]))
        },
        []
    )

    // Navigation handlers
    const handleChangeIndex = useCallback(
        async (type: any) => {
            const newIndex = type === 'next' ? (index < flashcards.length - 1 ? index + 1 : 0) : index > 0 ? index - 1 : flashcards.length - 1

            setIndex(newIndex)
            setIsFlipped(false)

            if (flashcards[newIndex]) {
                setQuizOptions(shuffle([...flashcards[newIndex].options]))
            }
        },
        [index, flashcards, feature]
    )

    // Progress tracking
    const handleProgress = useCallback(
        (type: any, cardId?: string) => {
            const currentId = cardId || flashcards[index]._id
            if (type === 'known') {
                // Đánh dấu câu hiện tại là đã học
                setProgress((prev) => ({
                    ...prev,
                    known: Array.from(new Set([...prev.known, currentId])),
                }))
                handleChangeIndex('next')
            } else {
                // Bỏ đánh dấu câu hiện tại khỏi đã học
                setProgress((prev) => ({
                    ...prev,
                    known: prev.known.filter((id) => id !== currentId),
                }))
                handleChangeIndex('prev')
            }
        },
        [index, flashcards, handleChangeIndex]
    )

    const handlePlayAudio = (method: any) => {
        if (method == 'correct') {
            const audio = new Audio('/audio/correct.mp3')
            audio.play()
        } else if (method == 'wrong') {
            const audio = new Audio('/audio/wrong.mp3')
            audio.play()
        }
    }

    // Quiz answer handler - check against parsed options
    const handleQuizAnswer = async (selectedAnswer: string, idx: number) => {
        const currentCard = flashcards[index]
        const cardId = currentCard._id
        
        // Find the correct answer text from options
        const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(currentCard.correctAnswer)
        const correctAnswerText = currentCard.options[correctAnswerIndex]
        
        const isCorrect = selectedAnswer === correctAnswerText
        
        toast[isCorrect ? 'success' : 'error'](isCorrect ? 'Chính xác, giỏi quá! ✨' : 'Sai rồi, thử lại nhé! 💪')
        setSelectedAnswers({
            ...selectedAnswers,
            [idx]: isCorrect ? 'correct' : 'incorrect',
        })
        if (isCorrect) {
            handlePlayAudio('correct')

            setTimeout(() => {
                handleProgress('known', cardId)
                setSelectedAnswers({})
            }, 1000)
        } else {
            handlePlayAudio('wrong')

            setTimeout(() => {
                setSelectedAnswers((prev) => ({
                    ...prev,
                    [idx]: null,
                }))
            }, 820)
        }
    }

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: any) => {
            switch (e.key.toLowerCase()) {
                case 'arrowleft':
                    handleChangeIndex('prev')
                    break
                case 'arrowright':
                    handleChangeIndex('next')
                    break
                case ' ':
                    e.preventDefault()
                    if (feature === FEATURES.FLASHCARD) {
                        setIsFlipped((prev) => !prev)
                    }
                    break
            }
        },
        [feature, handleChangeIndex, handleProgress]
    )

    if (loading && flashcards.length === 0) {
        return <LoadingScreen />
    }

    return (
        <div className="my-5  w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
            <div className="focus-visible:outline-none " onKeyDown={handleKeyDown} tabIndex={0}>
                <div className="">
                    <div className="w-full text-left mb-5">
                        <Button className="w-full md:w-auto" variant="outline" onClick={() => navigate(-1)}>
                            <ArrowLeft /> Quay lại
                        </Button>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-5 items-start">
                        <div className="w-full flex flex-col gap-5">
                            {/* Main Flashcard Container */}
                            <div
                                className=" relative w-full h-full md:h-[500px] border border-white/10 rounded-lg  shadow-md bg-white dark:bg-slate-800/50 dark:text-white"
                                style={{ perspective: '1000px' }}
                                onClick={feature === FEATURES.FLASHCARD ? () => setIsFlipped(!isFlipped) : undefined}
                            >
                                {/* Flashcard Feature */}
                                {feature === FEATURES.FLASHCARD && (
                                    <div
                                        className={`rounded-lg  cursor-pointer absolute inset-0 w-full h-full transition-transform duration-500 transform ${isFlipped ? 'rotate-y-180' : ''}`}
                                        style={{
                                            transformStyle: 'preserve-3d',
                                        }}
                                    >
                                        {/* Front Side */}
                                        <div
                                            className="rounded-lg  absolute inset-0 bg-white dark:bg-slate-800/50 flex flex-col items-center justify-center backface-hidden p-5"
                                            style={{
                                                backfaceVisibility: 'hidden',
                                            }}
                                        >
                                            <div className="flex items-center gap-2 mb-4 text-center">
                                                <p className="text-2xl font-semibold">{flashcards[index]?.question}</p>
                                            </div>

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
                                                <div className="w-full space-y-3">
                                                    <h3 className="text-center font-semibold text-lg mb-4">Các đáp án:</h3>
                                                    <div className="grid gap-2">
                                                        {flashcards[index]?.options.map((option, idx) => {
                                                            const label = ['A', 'B', 'C', 'D'][idx]
                                                            const isCorrect = label === flashcards[index]?.correctAnswer
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className={`p-3 rounded-lg border-2 transition-all ${
                                                                        isCorrect
                                                                            ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-400'
                                                                            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                            {label}.
                                                                        </span>
                                                                        <span className={isCorrect ? 'font-semibold text-green-800 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}>
                                                                            {option}
                                                                        </span>
                                                                        {isCorrect && <span className="ml-auto text-green-600 dark:text-green-400">✓</span>}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Quiz Feature */}
                                {feature === FEATURES.QUIZ && (
                                    <div className="p-5 h-full flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <h1 className="text-xl font-bold ">Chọn đáp án đúng</h1>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Quiz</span>
                                        </div>
                                        <p className=" mb-4 text-gray-500">Chọn một trong bốn đáp án A, B, C, D</p>
                                        <p className="text-lg mb-6 font-semibold">{flashcards[index]?.question}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                                            {quizOptions.map((option, idx) => {
                                                const label = ['A', 'B', 'C', 'D'][idx] || String(idx + 1)
                                                return (
                                                    <Button
                                                        key={idx}
                                                        variant="secondary"
                                                        onClick={() => handleQuizAnswer(option, idx)}
                                                        disabled={!!selectedAnswers[idx]}
                                                        className={`w-full h-full min-h-[80px] py-4 relative text-black dark:text-white transition-all hover:scale-105
                                                                    ${selectedAnswers[idx] === 'correct' ? '!border-green-500 !bg-green-500 border-2 tada' : ''}
                                                                    ${selectedAnswers[idx] === 'incorrect' ? '!border-red-500 !bg-red-500 border-2 shake' : ''}
                                                                    `}
                                                    >
                                                        <div className="absolute top-2 left-2 h-8 w-8 flex items-center justify-center rounded-full bg-gray-300 dark:bg-slate-900/80 font-bold text-black dark:text-white">
                                                            {label}
                                                        </div>
                                                        <p className="flex-1 text-center px-10 break-words whitespace-normal text-sm md:text-base">{option}</p>
                                                        {selectedAnswers[idx] === 'correct' && <span className="absolute top-2 right-2 text-2xl">✓</span>}
                                                        {selectedAnswers[idx] === 'incorrect' && <span className="absolute top-2 right-2 text-2xl">✗</span>}
                                                    </Button>
                                                )
                                            })}
                                            {quizOptions.length < 4 && <p className="text-red-500 col-span-2">Cảnh báo: Câu hỏi chưa có đủ 4 đáp án</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Controls */}

                            <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 rounded-md overflow-hidden w-full flex items-center justify-between shadow-md text-2xl">
                                <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleProgress('unknown')}>
                                    <GrFormPrevious />
                                    <p className="text-sm">Lùi lại</p>
                                </div>
                                <div className="flex-1 p-3 hover:bg-primary hover:text-white flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => handleProgress('known')}>
                                    <GrFormNext />
                                    <p className="text-sm">Tiến tới</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature Selection Panel */}
                        <div className="w-full md:w-auto flex flex-col gap-4">
                            <div className="space-y-2">
                                <h2 className="font-medium">Chế độ học</h2>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries({
                                        Flashcard: FEATURES.FLASHCARD,
                                        Quiz: FEATURES.QUIZ,
                                    }).map(([name, value]) => (
                                        <Button
                                            key={value}
                                            onClick={() => setFeature(value)}
                                            variant={feature === value ? 'default' : 'secondary'}
                                            className={`${feature === value ? 'text-white' : 'text-black dark:text-white'} transition-colors border border-white/10`}
                                        >
                                            {name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Display */}
                            <div className="space-y-2">
                                <h2 className="font-medium">Tiến trình</h2>
                                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span>Đã học:</span>
                                        <span>
                                            {progress.known.length}/{flashcards.length}
                                        </span>
                                    </div>

                                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-500/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${(progress.known.length / flashcards.length) * 100}%`,
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
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">→</kbd>
                                        <span className="">Tiến tới</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">←</kbd>
                                        <span className="">Lùi lại</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">Space</kbd>
                                        <span className="">Lật thẻ </span>
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
