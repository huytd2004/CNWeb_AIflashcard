import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Send } from 'lucide-react'

export default function FeatureFillBlank({ currentCard, showAns, inputAnswer, setInputAnswer, isCorrectAns, checkListeningAnswer, setShowAns }: any) {
    return (
        <div className="p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold ">Điền từ còn thiếu</h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Practice</span>
            </div>
            <div className="flex-1">
                <p className=" mb-4">{currentCard?.define}</p>
                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg mb-4">
                    <p className="text-gray-600 dark:text-white/70 font-medium mb-2">Ví dụ:</p>
                    <p className="text-lg">
                        {showAns ? currentCard?.example?.[0]?.en : currentCard?.example?.[0]?.en.replace(new RegExp(currentCard?.title, 'gi'), '_'.repeat(currentCard.title.length + 2))}
                    </p>
                </div>
                <Input
                    type="text"
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === ' ') {
                            e.stopPropagation() // Prevent space key event from bubbling up
                        }
                    }}
                    placeholder="Điền từ còn thiếu..."
                    autoFocus
                    className={`h-14 dark:border-white/10 w-full border outline-none focus-visible:ring-0 rounded-md transition-colors dark:bg-gray-500/50 text-third dark:text-white
                                                ${isCorrectAns === 'correct' ? 'dark:!border-green-300 !border-green-500 border-2' : ''}
                                                ${isCorrectAns === 'incorrect' ? 'dark:!border-red-300 !border-red-500 border-2 shake' : ''}
                                            `}
                />
                <div className="flex justify-end mt-3">
                    <Button className="text-white" onClick={checkListeningAnswer}>
                        <Send /> Kiểm tra
                    </Button>
                </div>
            </div>
            <Button onClick={() => setShowAns(!showAns)} variant={showAns ? 'outline' : 'secondary'} className=" mt-4  " size="lg">
                <Eye />
                {showAns ? 'Ẩn đáp án' : 'Hiển thị đáp án'}
            </Button>
        </div>
    )
}
