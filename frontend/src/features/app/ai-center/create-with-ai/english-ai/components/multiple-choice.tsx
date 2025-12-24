import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { IMultipleChoiceQuestion } from '@/types/english-exam'
import { CircleDot, Save, SquarePen, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export function MultipleChoiceQuestion({ question, id }: { question: IMultipleChoiceQuestion; id?: number }) {
    const [editData, setEditData] = useState(question)
    const [edit, setEdit] = useState(false)

    const handleRemove = () => {}

    const handleSaveEdit = () => {
        // Cập nhật dữ liệu câu hỏi với các thay đổi
        question.question_text = editData.question_text
        question.correct_answer_id = editData.correct_answer_id
        question.options = editData.options
        setEdit(false) // Tắt chế độ chỉnh sửa sau khi lưu
    }
    return (
        <Card className="dark:bg-slate-800 bg-gray-100/80 backdrop-blur-md shadow-md" id={`question-${id}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 ">
                        <CircleDot className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Chọn nhiều đáp án</h3>
                        <Badge variant="secondary" className="bg-slate-700">
                            Từ vựng
                        </Badge>
                    </div>
                    <div className="space-x-2">
                        {edit ? (
                            <Button onClick={() => setEdit(false)} variant="outline" size="sm">
                                <X /> Tắt chỉnh sửa
                            </Button>
                        ) : (
                            <Button onClick={() => setEdit(true)} variant="outline" size="sm">
                                <SquarePen /> Mở chỉnh sửa
                            </Button>
                        )}
                        <Button onClick={handleRemove} variant="destructive" size="sm">
                            <Trash2 /> Xóa
                        </Button>
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-6">
                    {edit ? <Textarea className="h-16" value={editData.question_text} onChange={(e) => setEditData({ ...editData, question_text: e.target.value })} /> : <>{question.question_text}</>}
                </h3>

                <div className="space-y-3">
                    {!edit &&
                        question.options.map((option: any, index: number) => (
                            <Button
                                key={option.id}
                                variant="outline"
                                className={`w-full justify-start h-auto p-4 text-left transition-all ${
                                    question.correct_answer_id === option.id
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                        : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                            question.correct_answer_id === option.id ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                                        }`}
                                    >
                                        {question.correct_answer_id === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                        <span>{option.text}</span>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    {edit &&
                        editData.options.map((option: any) => (
                            <Button
                                key={option.id}
                                variant="outline"
                                className={`w-full justify-start h-auto p-4 text-left transition-all ${
                                    editData.correct_answer_id === option.id
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                        : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                            editData.correct_answer_id === option.id ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                                        }`}
                                        onClick={() => {
                                            const updatedOptions = editData.options.map((opt: any) => (opt.id === option.id ? { ...opt, is_correct: !opt.is_correct } : opt))
                                            setEditData({ ...editData, correct_answer_id: option.id, options: updatedOptions })
                                        }}
                                    >
                                        {editData.correct_answer_id === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={option.text}
                                            onChange={(e) => {
                                                const updatedOptions = editData.options.map((opt: any) => (opt.id === option.id ? { ...opt, text: e.target.value } : opt))
                                                setEditData({ ...editData, options: updatedOptions })
                                            }}
                                        />
                                    </div>
                                </div>
                            </Button>
                        ))}
                </div>
                {edit && (
                    <div className="mt-4 flex justify-center">
                        <Button onClick={handleSaveEdit} variant="outline" className="">
                            <Save /> Lưu thay đổi
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
