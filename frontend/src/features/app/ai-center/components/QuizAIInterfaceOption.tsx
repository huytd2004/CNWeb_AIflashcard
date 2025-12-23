import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Bot, Sparkles, Wand2, Clock, Users, BookOpen } from 'lucide-react'
import type { QuizAIInterface } from '@/types/create-ai'
import { difficultyOptions, topicSuggestions } from './configEnglish'
import { Slider } from '@/components/ui/slider'

interface Props {
    dataQuizInterface: QuizAIInterface
    setDataQuizInterface: React.Dispatch<React.SetStateAction<QuizAIInterface>>
    handleGenerate: (data: QuizAIInterface, type: string) => void
    isGenerating: boolean
    generatedQuiz: any
}

export default function QuizAIInterfaceOption({ dataQuizInterface, setDataQuizInterface, handleGenerate, isGenerating, generatedQuiz }: Props) {
    const handleChangeValue = (key: string, value: any) => {
        setDataQuizInterface((prev) => ({
            ...prev,
            [key]: value,
        }))
    }
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="dark:border-white/10 dark:shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <BookOpen className="h-5 w-5" />
                                <span>Thông tin chủ đề</span>
                            </CardTitle>
                            <CardDescription>Cung cấp thông tin về chủ đề quiz bạn muốn tạo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="topic">Chủ đề quiz *</Label>
                                <Input
                                    id="topic"
                                    placeholder="VD: Lịch sử Việt Nam thế kỷ 20"
                                    value={dataQuizInterface.topic}
                                    onChange={(e) => handleChangeValue('topic', e.target.value)}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label>Gợi ý chủ đề</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {topicSuggestions.map((suggestion) => (
                                        <Badge key={suggestion} variant="outline" className="cursor-pointer dark:text-white/80" onClick={() => handleChangeValue('topic', suggestion)}>
                                            {suggestion}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả chi tiết (tùy chọn)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Mô tả thêm về nội dung, phạm vi, yêu cầu đặc biệt..."
                                    value={dataQuizInterface.description}
                                    onChange={(e) => handleChangeValue('description', e.target.value)}
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="dark:border-white/10 dark:shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Wand2 className="h-5 w-5" />
                                <span>Cấu hình quiz</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label>Số lượng câu hỏi: {dataQuizInterface.questionCount[0]}</Label>
                                <Slider value={dataQuizInterface.questionCount} onValueChange={(value) => handleChangeValue('questionCount', value)} max={50} min={5} step={5} className="mt-2" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>5 câu</span>
                                    <span>50 câu</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label>Lựa chọn cấp độ</Label>
                                <div className="flex gap-2  flex-col md:flex-row ">
                                    {difficultyOptions.map((option) => (
                                        <Card
                                            key={option.value}
                                            className={`relative ml-0! flex-1 p-3 rounded-lg cursor-pointer dark:border-white/10 border-2 ${
                                                dataQuizInterface.difficulty === option.value ? option.color + ' ' + option.bgColor : 'bg-white dark:bg-gray-800'
                                            } hover:shadow-md transition-shadow ml-2`}
                                            onClick={() => handleChangeValue('difficulty', option.value)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Badge className={`${option.bgColor} shadow-md text-white`}>{option.badge}</Badge>
                                                <span className="text-sm">{option.label}</span>
                                                <div
                                                    className={`absolute top-1 right-1 w-3 h-3  rounded-full dark:border-white/50 ${
                                                        dataQuizInterface.difficulty === option.value ? option.color + ' border-2' : ''
                                                    }`}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2"> {option.desc}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview/Stats */}
                <div className="space-y-6">
                    <Card className="dark:border-white/10 dark:shadow-md bg-linear-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-900/20 dark:to-pink-900/20">
                        <CardContent className="p-4">
                            <div className="text-center space-y-2">
                                <Bot className="h-8 w-8 text-purple-500 mx-auto" />
                                <p className="text-sm font-medium">AI sẽ tạo quiz dựa trên:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>• Chủ đề và mô tả của bạn</li>
                                    <li>• Độ khó phù hợp</li>
                                    <li>• Đa dạng loại câu hỏi</li>
                                    <li>• Đáp án chính xác</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:border-white/10 dark:shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Xem trước</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Chủ đề:</span>
                                </div>
                                <p className="text-sm font-medium">{dataQuizInterface.topic || 'Chưa nhập chủ đề'}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Số câu hỏi:</span>
                                </div>
                                <p className="text-sm font-medium">{dataQuizInterface.questionCount[0]} câu</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Thời gian tạo ước tính:</span>
                                </div>
                                <p className="text-sm font-medium">{30 + Math.ceil(dataQuizInterface.questionCount[0] / 0.4)}s</p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm mr-2">Độ khó:</span>
                                <Badge className={difficultyOptions.find((d) => d.value === dataQuizInterface.difficulty)?.bgColor + ' shadow-md text-white'}>
                                    {difficultyOptions.find((d) => d.value === dataQuizInterface.difficulty)?.label}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="flex justify-center flex-col gap-5  mt-10">
                <div className={`flex items-center gap-3 flex-col md:flex-row `}>
                    <Button
                        size="lg"
                        className="dark:text-white bg-linear-to-r from-purple-500 to-pink-500 hover:opacity-90"
                        onClick={() => handleGenerate(dataQuizInterface, 'interface')}
                        disabled={!dataQuizInterface.topic.trim() || isGenerating}
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
                </div>
            </div>
        </>
    )
}
