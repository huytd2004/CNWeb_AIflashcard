import { Button } from '@/components/ui/button'
interface Props {
    currentCard: any
    quizOptions: string[]
    handleQuizAnswer: (option: string, index: number) => void
    selectedAnswers: any
    isSpeaking: boolean
    loadingAudio: boolean
}
export default function FeatureQuiz({ currentCard, quizOptions, handleQuizAnswer, selectedAnswers, isSpeaking, loadingAudio }: Props) {
    return (
        <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <h1 className="text-xl font-bold ">Chọn đáp án đúng</h1>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Quiz</span>
            </div>
            <p className=" mb-4 text-gray-500"> (nếu không có đáp án đúng vui lòng bấm bỏ qua)</p>
            <p className="text-lg mb-3 md:mb-6">{currentCard?.define}</p>
            <div className="grid grid-cols-2 gap-2 md:gap-5 flex-1">
                {quizOptions.map((option, idx) => (
                    <Button
                        key={idx}
                        onClick={() => handleQuizAnswer(option, idx)}
                        disabled={
                            Object.keys(selectedAnswers).length > 0 || // ✅ Disable khi đã chọn đáp án
                            isSpeaking || // ✅ Disable khi đang phát âm
                            loadingAudio // ✅ Disable khi đang load audio
                        }
                        variant="secondary"
                        className={`h-full relative whitespace-normal text-gray-700 dark:text-white  transition-colors
                                                                ${selectedAnswers[idx] === 'correct' ? '!border-green-500 border-2 tada' : ''}
                                                                ${selectedAnswers[idx] === 'incorrect' ? '!border-red-500 border-2 shake' : ''}
                                            `}
                    >
                        <div className="absolute top-1 left-1 h-8 w-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-900 dark:text-white   dark:bg-slate-900/50">{idx + 1}</div>
                        <p className="flex-1 text-center px-2">{option}</p>
                    </Button>
                ))}
                {quizOptions.length < 4 && <p className="text-red-500">Cảnh báo: Chưa đủ đáp án để trộn ngẫu nhiên (Yêu cầu trên 4)</p>}
            </div>
        </div>
    )
}
