import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GripVertical, RotateCcw, X, SquarePen, ArrowDownAZ, Trash2, Save } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Input } from '@/components/ui/input'
import type { IRearrangeSentencesQuestion } from '@/types/english-exam'

const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

export function RearrangeSentencesQuestion({ question, is_exam = false, id }: { question: IRearrangeSentencesQuestion; is_exam?: boolean; id?: number }) {
    const [editData, setEditData] = useState(question)
    const [edit, setEdit] = useState(false)
    const onDragEnd = (result: any) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        const reorderedItems = reorder(editData.scrambled_sentences, result.source.index, result.destination.index)
        setEditData({ ...editData, scrambled_sentences: reorderedItems as any })
    }

    const resetOrder = () => {
        setEditData({ ...editData, scrambled_sentences: question.scrambled_sentences })
    }

    const handleRemove = () => {}

    const handleSaveEdit = () => {
        // Cập nhật dữ liệu câu hỏi với các thay đổi
        question.question_text = editData.question_text
        question.scrambled_sentences = editData.scrambled_sentences
        setEdit(false) // Tắt chế độ chỉnh sửa sau khi lưu
    }

    return (
        <div className="" id={`question-${id}`}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            <Card className="dark:bg-slate-800 bg-gray-100/80 backdrop-blur-md shadow-md ">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        {!is_exam && (
                                            <div className="flex items-center gap-2 ">
                                                <ArrowDownAZ className="w-5 h-5 text-blue-400" />
                                                <h3 className="text-lg font-semibold text-white">Sắp xếp câu thành câu có ý nghĩa</h3>
                                                <Badge variant="secondary" className="bg-slate-700">
                                                    Đọc hiểu
                                                </Badge>
                                            </div>
                                        )}

                                        {!is_exam && (
                                            <div className="space-x-2">
                                                <Button variant="outline" size="sm" onClick={resetOrder} className="">
                                                    <RotateCcw />
                                                    Đặt lại
                                                </Button>
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
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <div className=" mb-6">
                                            {edit ? (
                                                <Input value={editData.question_text} onChange={(e) => setEditData({ ...editData, question_text: e.target.value })} className="" />
                                            ) : (
                                                <h3 className="text-xl font-semibold text-white">{question.question_text}</h3>
                                            )}
                                        </div>

                                        {!edit &&
                                            !is_exam &&
                                            question.scrambled_sentences.map((item: any, index: any) => (
                                                <Card key={item.id} className="mb-2 dark:bg-slate-800 bg-gray-100/80 backdrop-blur-md shadow-md ">
                                                    <CardContent className="flex items-center justify-between p-3 gap-2">
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <GripVertical className="text-slate-400" />

                                                            <span className="text-slate-300">{item.text}</span>
                                                        </div>
                                                        <Badge variant="secondary">{index + 1}</Badge>
                                                    </CardContent>
                                                </Card>
                                            ))}

                                        {(edit || is_exam) &&
                                            editData.scrambled_sentences.map((item: any, index: any) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided) => (
                                                        <Card
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="mb-2 dark:bg-slate-800 bg-gray-100/80 backdrop-blur-md shadow-md "
                                                        >
                                                            <CardContent className="flex items-center justify-between p-3 gap-2">
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <GripVertical className="text-slate-400" />
                                                                    {edit ? (
                                                                        <Input
                                                                            value={item.text}
                                                                            onChange={(e) => {
                                                                                const newItems = [...editData.scrambled_sentences]
                                                                                newItems[index].text = e.target.value
                                                                                setEditData({ ...editData, scrambled_sentences: newItems })
                                                                            }}
                                                                            className="w-full flex-1"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-slate-300">{item.text}</span>
                                                                    )}
                                                                </div>
                                                                <Badge variant="secondary">{index + 1}</Badge>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                    {edit && (
                                        <div className="my-4 flex justify-center">
                                            <Button onClick={handleSaveEdit} variant="outline" className="">
                                                <Save /> Lưu thay đổi
                                            </Button>
                                        </div>
                                    )}
                                    {/* Preview */}
                                    <div className="dark:bg-slate-700 bg-gray-100/80 backdrop-blur-md shadow-md rounded-md p-4">
                                        <h4 className="font-medium text-slate-300 mb-3">Xem trước đoạn văn:</h4>
                                        <div className="text-white leading-relaxed">
                                            {question.scrambled_sentences.map((sentence: any, index: number) => (
                                                <span key={sentence.id}>
                                                    {sentence.text}
                                                    {index < question.scrambled_sentences.length - 1 && ' '}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}
