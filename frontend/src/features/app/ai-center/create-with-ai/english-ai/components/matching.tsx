import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Binoculars, MoveDown, RotateCcw, Save, SquarePen, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { ILeftItem, IMatchingQuestion, IRightItem } from '@/types/english-exam'

interface CreateMatchingQuestion {
    question_text: string
    left_items: ILeftItem[]
    right_items: IRightItem[]
}
export function MatchingQuestion({ question, id }: { question: IMatchingQuestion; id?: number }) {
    const [selectedAnswers, setSelectedAnswers] = useState<Array<{ left: string; right: string }>>([])
    const [currentSelection, setCurrentSelection] = useState<{ left: string | null; right: string | null }>({
        left: null,
        right: null,
    })

    const [edit, setEdit] = useState(false)
    const [editData, setEditData] = useState<CreateMatchingQuestion>({
        question_text: question.question_text,
        left_items: question.left_items,
        right_items: question.right_items,
    })
    const getColorForItem = (itemId: string, side: 'left' | 'right') => {
        // Kiểm tra xem item đã được match chưa
        const matchedIndex = selectedAnswers.findIndex((pair) => (side === 'left' ? pair.left === itemId : pair.right === itemId))

        if (matchedIndex !== -1) {
            // Item đã được match, trả về màu theo index
            return getColorSelectedIndex(matchedIndex)
        }

        // Kiểm tra xem item có đang được chọn không
        if (side === 'left' && currentSelection.left === itemId) {
            return 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 border-blue-400'
        }
        if (side === 'right' && currentSelection.right === itemId) {
            return 'bg-blue-200 text-blue-800  dark:bg-blue-800 dark:text-blue-200 border-blue-400'
        }

        // Mặc định màu gray
        return 'bg-gray-600 dark:bg-gray-700 text-white'
    }

    const getColorSelectedIndex = (index: number) => {
        switch (index) {
            case 0:
                return 'bg-blue-500 dark:bg-blue-700 text-white'
            case 1:
                return 'bg-teal-500 dark:bg-teal-700 text-white'
            case 2:
                return 'bg-indigo-500 dark:bg-indigo-700 text-white'
            case 3:
                return 'bg-cyan-500 dark:bg-cyan-700 text-white'
            case 4:
                return 'bg-sky-500 dark:bg-sky-700 text-white'
            default:
                return 'bg-gray-600 dark:bg-gray-700 text-white'
        }
    }

    const handleLeftItemClick = (itemId: string) => {
        // Kiểm tra xem item đã được match chưa
        const isAlreadyMatched = selectedAnswers.some((pair) => pair.left === itemId)
        if (isAlreadyMatched) return

        // Nếu đã chọn bên phải, tạo cặp ngay lập tức
        if (currentSelection.right) {
            const newPair = {
                left: itemId,
                right: currentSelection.right,
            }

            setSelectedAnswers((prev) => [...prev, newPair])

            // Reset current selection để bắt đầu cặp mới
            setCurrentSelection({
                left: null,
                right: null,
            })
        } else {
            // Chưa chọn bên phải, chỉ highlight bên trái (thay thế nếu đã chọn item khác)
            setCurrentSelection((prev) => ({
                ...prev,
                left: itemId,
            }))
        }
    }

    const handleRightItemClick = (itemId: string) => {
        // Kiểm tra xem item đã được match chưa
        const isAlreadyMatched = selectedAnswers.some((pair) => pair.right === itemId)
        if (isAlreadyMatched) return

        // Nếu đã chọn bên trái, tạo cặp ngay lập tức
        if (currentSelection.left) {
            // Tạo cặp mới và thêm vào mảng
            const newPair = {
                left: currentSelection.left,
                right: itemId,
            }

            setSelectedAnswers((prev) => [...prev, newPair])

            // Reset current selection để bắt đầu cặp mới
            setCurrentSelection({
                left: null,
                right: null,
            })
        } else {
            // Chưa chọn bên trái, chỉ highlight bên phải (thay thế nếu đã chọn item khác)
            setCurrentSelection((prev) => ({
                ...prev,
                right: itemId,
            }))
        }
    }

    const handleReset = () => {
        setSelectedAnswers([])
        setCurrentSelection({ left: null, right: null })
        setEditData({
            question_text: question.question_text,
            left_items: question.left_items,
            right_items: question.right_items,
        })
        setEdit(false) // Tắt chế độ chỉnh sửa khi reset
    }
    const handleRemove = () => {}

    const handleSaveEdit = () => {
        // Cập nhật dữ liệu câu hỏi với các thay đổi
        question.question_text = editData.question_text
        question.left_items = editData.left_items
        question.right_items = editData.right_items
        setEdit(false) // Tắt chế độ chỉnh sửa sau khi lưu
    }
    return (
        <Card className="bg-slate-800 border-slate-700" id={`question-${id}`}>
            <CardContent className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row gap-2 justify-between md:items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Binoculars className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Nối câu</h3>
                        <Badge variant="secondary" className="bg-slate-700">
                            Đọc hiểu
                        </Badge>
                    </div>
                    <div className="space-x-2">
                        <Button onClick={handleReset} variant="outline" size="sm" className="">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
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
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{question.question_text}</h3>

                {/* Hiển thị hướng dẫn */}
                <div className="mb-4 p-3 bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-200">💡 Hướng dẫn: Chọn một item bên trái hoặc bên phải, sau đó chọn item ở phía còn lại để tạo cặp.</p>
                </div>

                <div className="flex gap-5 items-center flex-col md:flex-row">
                    {/* Left side - Items to match */}
                    <div className="flex-1">
                        <h4 className="text-lg font-medium text-white mb-3 text-center">Cột A</h4>
                        <div className="flex gap-1 flex-wrap md:flex-col">
                            {question.left_items.map((item, index) => {
                                if (edit) {
                                    return (
                                        <Input
                                            key={item.id}
                                            value={editData.left_items[index].text}
                                            onChange={(e) => {
                                                const newLeftItems = [...editData.left_items]
                                                newLeftItems[index] = { ...newLeftItems[index], text: e.target.value }
                                                setEditData({ ...editData, left_items: newLeftItems })
                                            }}
                                        />
                                    )
                                }
                                return (
                                    <Badge key={item.id} className={`cursor-pointer mb-2 transition-all duration-200 ${getColorForItem(item.id, 'left')}`} onClick={() => handleLeftItemClick(item.id)}>
                                        {item.text}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>

                    {/* Middle - Arrow */}
                    <div className="flex-1 flex justify-center">
                        <ArrowRight className="hidden md:block w-8 h-8 text-gray-400" />
                        <MoveDown className="block md:hidden w-8 h-8 text-gray-400" />
                    </div>

                    {/* Right side - Items to match with */}
                    <div className="flex-1">
                        <h4 className="text-lg font-medium text-white mb-3 text-center">Cột B</h4>
                        <div className="flex gap-1 flex-wrap md:flex-col">
                            {question.right_items.map((item) => {
                                if (edit) {
                                    return (
                                        <Input
                                            key={item.id}
                                            value={editData.right_items.find((i) => i.id === item.id)?.text || ''}
                                            onChange={(e) => {
                                                const newRightItems = editData.right_items.map((i) => (i.id === item.id ? { ...i, text: e.target.value } : i))
                                                setEditData({ ...editData, right_items: newRightItems })
                                            }}
                                        />
                                    )
                                }
                                return (
                                    <Badge
                                        key={item.id}
                                        className={`cursor-pointer mb-2 transition-all duration-200 ${getColorForItem(item.id, 'right')}`}
                                        onClick={() => handleRightItemClick(item.id)}
                                    >
                                        {item.text}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                </div>
                {/* Hiển thị nút lưu khi đang ở chế độ chỉnh sửa */}
                {edit && (
                    <div className="mt-4 flex justify-center">
                        <Button onClick={handleSaveEdit} variant="outline" className="">
                            <Save /> Lưu thay đổi
                        </Button>
                    </div>
                )}
                {/* Hiển thị các cặp đã ghép */}
                {selectedAnswers.length > 0 && (
                    <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                        <h4 className="text-white font-medium mb-3">Các cặp đã ghép:</h4>
                        <div className="space-y-2">
                            {selectedAnswers.map((pair, index) => {
                                const leftItem = question.left_items.find((item) => item.id === pair.left)
                                const rightItem = question.right_items.find((item) => item.id === pair.right)
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <Badge className={getColorSelectedIndex(index)}>{leftItem?.text}</Badge>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                        <Badge className={getColorSelectedIndex(index)}>{rightItem?.text}</Badge>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Current selection indicator */}
                {(currentSelection.left || currentSelection.right) && (
                    <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg">
                        <p className="text-yellow-200 text-sm">
                            {currentSelection.left && !currentSelection.right && ' Đã chọn bên trái, hãy chọn bên phải để hoàn thành cặp'}
                            {!currentSelection.left && currentSelection.right && 'Đã chọn bên phải, hãy chọn bên trái để hoàn thành cặp'}
                            {/* {currentSelection.left && currentSelection.right && "✅ Đã chọn cả hai bên, sẽ tạo cặp khi bạn click"} */}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
