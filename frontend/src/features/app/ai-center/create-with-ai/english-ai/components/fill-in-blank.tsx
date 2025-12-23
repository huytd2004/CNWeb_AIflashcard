import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { PaintBucket, Save, SquarePen, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { IFillInTheBlankQuestion } from '@/types/english-exam'

export function FillInBlankQuestion({ question, id }: { question: IFillInTheBlankQuestion; id?: number }) {
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
                        <PaintBucket className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Điền vào chỗ trống</h3>
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
                <div className="mb-6">
                    <div className="text-xl text-white leading-relaxed">
                        {/* <Input value={question.correct_answer_text} className="inline-block w-32 mx-2 bg-slate-700 border-slate-600 text-white text-center" placeholder="..." /> */}
                        {edit ? (
                            <Input value={editData.question_text} onChange={(e) => setEditData({ ...editData, question_text: e.target.value })} className="bg-slate-700 border-slate-600 text-white" />
                        ) : (
                            <p>{question.question_text}</p>
                        )}
                    </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 text-sm mb-2">Câu trả lời của bạn:</p>
                    {edit ? (
                        <Input
                            value={editData.correct_answer_text}
                            onChange={(e) => setEditData({ ...editData, correct_answer_text: e.target.value })}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Nhập câu trả lời..."
                        />
                    ) : (
                        <p>{question.correct_answer_text}</p>
                    )}
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
