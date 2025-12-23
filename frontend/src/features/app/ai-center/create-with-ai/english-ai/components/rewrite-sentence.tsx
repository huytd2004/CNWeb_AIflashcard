import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PenLine, Save, SquarePen, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { IRewriteSentenceQuestion } from '@/types/english-exam'

export function RewriteSentenceQuestion({ question, id }: { question: IRewriteSentenceQuestion; id?: number }) {
    const [editData, setEditData] = useState(question)
    const [edit, setEdit] = useState(false)
    const handleRemove = () => {}

    const handleSaveEdit = () => {
        // Cập nhật dữ liệu câu hỏi với các thay đổi
        question.question_text = editData.question_text
        question.correct_answer_text = editData.correct_answer_text
        setEdit(false) // Tắt chế độ chỉnh sửa sau khi lưu
    }
    return (
        <Card className="bg-slate-800 border-slate-700" id={`question-${id}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 ">
                        <PenLine className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Viết lại câu</h3>
                        <Badge variant="secondary" className="bg-slate-700">
                            Viết
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
                <div className="mb-6">
                    <h3 className="text-xl max-h-[100px] font-semibold text-white ">{question.question_text.split(':')[0].trim().replace(/['"]/g, '')}</h3>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-700 rounded-lg p-4">
                        <h4 className="font-medium text-slate-300 mb-2">Câu gốc:</h4>
                        {edit ? (
                            <Input value={editData.question_text} onChange={(e) => setEditData({ ...editData, question_text: e.target.value })} />
                        ) : (
                            <p className="text-white text-lg italic">{question.question_text.includes(':') ? question.question_text.split(':')[1].trim().replace(/['"]/g, '') : ''}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-slate-300">Câu trả lời của bạn:</h4>
                        </div>
                        {edit ? (
                            <Textarea
                                value={editData.correct_answer_text}
                                onChange={(e) => setEditData({ ...editData, correct_answer_text: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white min-h-[100px] text-lg leading-relaxed"
                                placeholder="Viết lại câu theo yêu cầu..."
                            />
                        ) : (
                            <p>{question.correct_answer_text}</p>
                        )}
                    </div>
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
