import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Send, Volume2 } from 'lucide-react'

interface Props {
    speakWord: (word: string, language: string) => void
    currentCard: any
    inputAnswer: any
    setInputAnswer: any
    isCorrectAns: any
    checkListeningAnswer: any
}

export default function FeatureListening({ speakWord, currentCard, inputAnswer, setInputAnswer, isCorrectAns, checkListeningAnswer }: Props) {
    return (
        <div className="p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold ">Nghe và điền từ</h1>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Listening</span>
            </div>
            <div className="flex gap-4 mb-6">
                <Button onClick={() => speakWord(currentCard?.title, currentCard?.language || 'english')} className="" variant="outline">
                    <Volume2 />
                </Button>
            </div>
            <div className="flex-1">
                <p className=" mb-2">Định nghĩa:</p>
                <p className="text-gray-600 dark:text-white/70 mb-4">{currentCard?.define}</p>
                <Input
                    type="text"
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    placeholder="Điền từ bạn nghe được"
                    autoFocus
                    className={`w-full h-14 dark:border-white/10 border outline-none focus-visible:ring-0 rounded-md transition-colors dark:bg-gray-500/50 text-third dark:text-white
            ${isCorrectAns === 'correct' ? '!border-green-500 dark:!border-green-300 border-2' : ''}
            ${isCorrectAns === 'incorrect' ? '!border-red-500 dark:!border-red-300 border-2 shake' : ''}
        `}
                />
                <div className="flex justify-end">
                    <Button className="mt-3 text-white" onClick={checkListeningAnswer}>
                        <Send /> Kiểm tra
                    </Button>
                </div>
            </div>
            <Button onClick={() => setInputAnswer(currentCard.title)} variant="outline" size="lg">
                <Eye />
                Hiển thị đáp án
            </Button>
        </div>
    )
}
