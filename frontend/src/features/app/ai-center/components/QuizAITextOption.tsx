import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, LetterText, Sparkles } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { QuizAIText } from '@/types/create-ai'
import { topicOptionsTemplate } from './configEnglish'

interface Props {
    dataQuizText: QuizAIText
    setDataQuizText: React.Dispatch<React.SetStateAction<QuizAIText>>
    handleGenerate: (data: QuizAIText, type: string) => void
    isGenerating: boolean
    generatedQuiz: any
}

export default function QuizAITextOption({ dataQuizText, setDataQuizText, handleGenerate, isGenerating, generatedQuiz }: Props) {
    const handleChangeValue = (key: string, value: any) => {
        setDataQuizText((prev) => ({
            ...prev,
            [key]: value,
        }))
    }
    return (
        <Card className=" ">
            <CardHeader>
                <CardTitle className="text-slate-600 dark:text-white flex items-center gap-2">
                    <LetterText className="w-5 h-5" />
                    Tạo câu hỏi từ văn bản
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="textInput">Nhập văn bản hoặc mô tả câu hỏi</Label>
                    <Textarea
                        id="textInput"
                        value={dataQuizText.content}
                        onChange={(e) => handleChangeValue('content', e.target.value)}
                        placeholder="Nhập văn bản của bạn ở đây..."
                        className="h-[300px] multiline-placeholder"
                    />
                </div>
                <p className="text-center text-sm text-blue-400  ">Tối đa hỗ trợ lên tới 50 câu hỏi</p>
                <div>
                    <Label>Gợi ý các kiểu trong prompt</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {topicOptionsTemplate.map((suggestion, index) => (
                            <Badge key={index} variant="outline" className="cursor-pointer dark:text-white/80" onClick={() => handleChangeValue('content', suggestion.description)}>
                                {suggestion.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                <Button
                    size="lg"
                    className="dark:text-white bg-linear-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    onClick={() => handleGenerate(dataQuizText, 'text')}
                    disabled={!dataQuizText.content.trim() || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Bot className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo quiz ...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {generatedQuiz ? 'Tạo lại quiz' : 'Tạo quiz bằng AI'}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
