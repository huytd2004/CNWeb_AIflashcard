import { Button } from '@/components/ui/button'
import type { Flashcard } from '@/types/flashcard'
import { useEffect, useState } from 'react'

interface FlashcardPiece {
    _id: string // ID của flashcard gốc
    type: 'title' | 'define'
    content: string
    language: string // Ngôn ngữ của flashcard
    title: string
}
interface ISessionRating {
    id: string
    quality: number
    userId: string
}

const shuffle = (array: FlashcardPiece[]) => {
    let currentIndex = array.length,
        randomIndex
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
    return array
}

interface FeatureChooseProps {
    flashcards?: Flashcard[]
    handlePlayAudio: (method: 'correct' | 'wrong') => void
    userId: string
    speakWord?: (word: string, language: string) => void
    sessionRatings: ISessionRating[]
    setSessionRatings: any
}
export default function FeatureChoose({ flashcards, handlePlayAudio, userId, speakWord, sessionRatings, setSessionRatings }: FeatureChooseProps) {
    const [selectedPieces, setSelectedPieces] = useState<FlashcardPiece[]>([])
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]) // Lưu trữ các _id của flashcard đã khớp
    const [shuffledPieces, setShuffledPieces] = useState<FlashcardPiece[]>([])
    const [isProcessing, setIsProcessing] = useState(false) // ✅ Ngăn spam click
    const [isCorrectAns, setIsCorrectAns] = useState<'correct' | 'incorrect' | null>(null) // ✅ Trạng thái đáp án đúng/sai
    const createFlashcardPieces = (flashcards: Flashcard[]): FlashcardPiece[] => {
        const pieces: FlashcardPiece[] = []
        flashcards.forEach((card) => {
            pieces.push({ _id: card._id, type: 'title', content: card.title, language: card.language, title: card.title })
            pieces.push({ _id: card._id, type: 'define', content: card.define, language: card.language, title: card.title })
        })
        return pieces
    }

    useEffect(() => {
        const sliceFC = flashcards && flashcards.length > 5 ? flashcards?.slice(0, 5) : flashcards || []

        const allPieces = createFlashcardPieces(sliceFC)
        const shuffled = shuffle(allPieces) // Hàm shuffle của bạn
        setShuffledPieces(shuffled) // Cập nhật state với mảng đã trộn
    }, [flashcards])

    useEffect(() => {
        if (sessionRatings && sessionRatings.length > 0 && shuffledPieces.length === 0) {
            // console.log('All pairs matched! Session ratings:', sessionRatings)
        }
    }, [sessionRatings, shuffledPieces])
    const handlePieceClick = async (clickedPiece: FlashcardPiece) => {
        if (isProcessing || matchedPairs.includes(clickedPiece._id)) {
            return // Đã khớp hoặc đang xử lý, không làm gì
        }

        const isAlreadySelected = selectedPieces.some((p) => p._id === clickedPiece._id && p.type === clickedPiece.type)

        if (isAlreadySelected) {
            setSelectedPieces((prev) => prev.filter((p) => !(p._id === clickedPiece._id && p.type === clickedPiece.type)))
            return
        }

        setSelectedPieces((prev) => {
            const newSelected = [...prev, clickedPiece]

            if (newSelected.length === 2) {
                setIsProcessing(true) // ✅ Bắt đầu xử lý
                const [piece1, piece2] = newSelected

                if (piece1._id === piece2._id && piece1.type !== piece2.type) {
                    setIsCorrectAns('correct')
                    speakWord?.(piece1.title, piece1.language) // Phát âm từ nếu có hàm speakWord
                    handlePlayAudio?.('correct') //
                    setMatchedPairs((prevMatched) => [...prevMatched, piece1._id])
                    const newRating = { id: piece1._id, quality: 5, userId: userId }
                    setSessionRatings([...sessionRatings, newRating]) // Cập nhật mảng đánh giá
                    setTimeout(() => {
                        setShuffledPieces((prev) => prev.filter((p) => p._id !== piece1._id))
                        setSelectedPieces([]) // Xóa lựa chọn
                        setIsProcessing(false) //
                        setIsCorrectAns(null) // Reset trạng thái đáp án
                    }, 700) // Ẩn sau 0.7 giây
                } else {
                    setIsCorrectAns('incorrect')
                    handlePlayAudio?.('wrong') //

                    setTimeout(() => {
                        setSelectedPieces([])
                        setIsProcessing(false) // ✅ Kết thúc xử lý
                        setIsCorrectAns(null) // Reset trạng thái đáp án
                    }, 700) // Reset sau 0.7 giây
                }
            }
            return newSelected
        })
    }

    return (
        <div className="p-5 flex flex-wrap h-full gap-3 overflow-h-scroll">
            {shuffledPieces?.map((piece, index) => (
                <Button
                    variant={selectedPieces.some((p) => p._id === piece._id && p.type === piece.type) ? 'default' : 'secondary'}
                    key={`${piece._id}-${piece.type}-${index}`} // Key duy nhất hơn
                    onClick={() => handlePieceClick(piece)}
                    disabled={isProcessing || matchedPairs.includes(piece._id)} // ✅ Disable khi đang xử lý
                    className={`h-auto min-w-[100px] max-w-[45%]  md:max-w-[250px] whitespace-normal ${
                        isCorrectAns === 'correct' && selectedPieces.some((p) => p._id === piece._id && p.type === piece.type) ? ' tada ' : ''
                    } ${isCorrectAns === 'incorrect' && selectedPieces.some((p) => p._id === piece._id && p.type === piece.type) ? ' shake ' : ''} transition-all duration-200 text-left`}
                >
                    {piece.content}
                </Button>
            ))}
        </div>
    )
}
