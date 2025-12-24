import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Save, SquarePen, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import type { IReadingComprehensionQuestion } from '@/types/english-exam'

export function ReadingComprehensionQuestion({ question, id }: { question: IReadingComprehensionQuestion; id?: number }) {
    const [editData, setEditData] = useState(question)
    const [edit, setEdit] = useState(false)
    const handleRemove = () => {}

    const handleSaveEdit = () => {
        // Cập nhật dữ liệu câu hỏi với các thay đổi
        question.question_text = editData.question_text
        question.passage = editData.passage
        question.options = editData.options
        question.correct_answer_id = editData.correct_answer_id
        setEdit(false) // Tắt chế độ chỉnh sửa sau khi lưu
    }

    return (
        <div className="space-y-6" id={`question-${id}`}>
            {/* Reading Passage */}
            <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 ">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">Đoạn văn</h3>
                            <Badge variant="secondary" className="bg-slate-700">
                                Đọc hiểu
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
                    {edit ? (
                        <Textarea
                            value={editData.passage}
                            onChange={(e) => setEditData({ ...editData, passage: e.target.value })}
                            className=" text-white h-[100px] text-lg leading-relaxed"
                            placeholder="Viết lại câu theo yêu cầu..."
                        />
                    ) : (
                        <div className="bg-slate-700 rounded-lg p-6">
                            <p className="text-white leading-relaxed text-lg">{question.passage}</p>
                        </div>
                    )}

                    <div className="mt-6 mb-3">
                        {edit ? (
                            <Textarea
                                value={editData.question_text}
                                onChange={(e) => setEditData({ ...editData, passage: e.target.value })}
                                className=" text-white h-16 text-lg leading-relaxed"
                                placeholder="Viết lại câu theo yêu cầu..."
                            />
                        ) : (
                            <h3 className="text-xl font-semibold text-white ">{question.question_text}</h3>
                        )}
                    </div>

                    <div className="space-y-3">
                        {!edit &&
                            question?.options?.map((option: any, index: number) => (
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
                                            <span className="whitespace-normal">{option.text}</span>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        {edit &&
                            editData?.options?.map((option: any) => (
                                <Button
                                    key={option.id}
                                    variant="outline"
                                    className={`w-full justify-start h-auto p-4 text-left transition-all ${
                                        editData.correct_answer_id === option.id
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                            : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 hover:border-blue-400 ${
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
        </div>
    )
}
