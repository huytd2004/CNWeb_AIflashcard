import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Search, Edit, Trash2, Eye, Calendar, Clock, Bot, Upload, Plus, AlertCircle, Aperture } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import handleCompareDate from '@/lib/handleCompareDate'
import { AIResultPreview } from '../../components/AIResuiltPreview'
import DialogAddMoreInfoQuiz from '../../components/DialogAddMoreInfoQuiz'

interface DraftQuiz {
    id: string
    title: string
    content: string
    subject: string
    createdAt: Date
    updatedAt: Date
    questionCount: number
    questions: Question[]
    createdBy: 'ai' | 'manual' | 'file'
    status: 'draft' | 'in-progress'
    difficulty: 'easy' | 'medium' | 'hard'
}

interface QuizQuestion {
    title: string
    subject: string
    content: string
    questions: Question[]
}
interface Question {
    id: string
    type: 'multiple-choice' | 'true-false' | 'short-answer'
    question: string
    answers?: string[]
    correct: string
    points: number
}

export function DraftsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [openAddMoreInfo, setOpenAddMoreInfo] = useState(false)
    const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion | undefined>(undefined)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [draftToDelete, setDraftToDelete] = useState<DraftQuiz | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const navigate = useNavigate()
    const [drafts, setDrafts] = useState<DraftQuiz[]>([])
    useEffect(() => {
        const getDrawQuiz = localStorage.getItem('draftQuiz') || ''
        if (!getDrawQuiz) {
            localStorage.setItem('draftQuiz', JSON.stringify([]))
        }
        const draftQuiz = JSON.parse(localStorage.getItem('draftQuiz') || '') as DraftQuiz[]
        const sortedDrafts = draftQuiz.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        setDrafts(sortedDrafts || [])
    }, [])

    const filteredDrafts = drafts.filter((draft) => draft.title.toLowerCase().includes(searchTerm.toLowerCase()) || draft.content.toLowerCase().includes(searchTerm.toLowerCase()))

    const updateLocalStorage = (newDrafts: DraftQuiz[]) => {
        try {
            localStorage.setItem('draftQuiz', JSON.stringify(newDrafts))
        } catch (error) {
            console.error('Error saving drafts:', error)
        }
    }
    const getCreatedByIcon = (createdBy: string) => {
        switch (createdBy) {
            case 'ai':
                return <Bot className="h-4 w-4 text-purple-500" />
            case 'manual':
                return <Edit className="h-4 w-4 text-blue-500" />
            case 'file':
                return <Upload className="h-4 w-4 text-green-500" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    const getCreatedByLabel = (createdBy: string) => {
        switch (createdBy) {
            case 'ai':
                return 'Tạo bằng AI'
            case 'manual':
                return 'Tạo thủ công'
            case 'file':
                return 'Nhập từ file'
            default:
                return 'Không xác định'
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            case 'hard':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }
    }

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'Dễ'
            case 'medium':
                return 'Trung bình'
            case 'hard':
                return 'Khó'
            default:
                return 'Không xác định'
        }
    }

    const handleDeleteDraft = (draft: DraftQuiz) => {
        setDraftToDelete(draft)
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        if (draftToDelete) {
            const newDrafts = drafts.filter((d) => d.id !== draftToDelete.id)
            setDrafts(newDrafts)
            updateLocalStorage(newDrafts) // ✅ Update localStorage
            setShowDeleteDialog(false)
            setDraftToDelete(null)
        }
    }

    const handlePreviewDraft = (draft: DraftQuiz) => {
        setGeneratedQuiz({
            title: draft.title,
            subject: draft.subject,
            content: draft.content,
            questions: draft.questions,
        })
        setShowPreview(true)
    }

    const handleSetValueGeneratedQuiz = (draft: DraftQuiz) => {
        setGeneratedQuiz({
            title: draft.title,
            subject: draft.subject,
            content: draft.content,
            questions: draft.questions,
        })
    }

    // const handleQuizUpdate = (updatedQuiz: typeof generatedQuiz) => {
    //     setGeneratedQuiz(updatedQuiz)
    // }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        <SidebarTrigger className="mr-3" />
                        Nháp Quiz
                    </h1>
                    <p className="text-muted-foreground mt-1">Quản lý các quiz đã lưu tạm thời</p>
                </div>
                <Button className="flex items-center space-x-2 dark:text-white" onClick={() => navigate('/quiz/themcauhoi/ai-create')}>
                    <Plus className="h-4 w-4" />
                    <span>Tạo quiz mới</span>
                </Button>
            </div>

            {/* Search and Filter */}
            <Card className="dark:border-white/10 dark:bg-slate-800/50">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm quiz theo tên hoặc mô tả..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 dark:border-white/10" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline">{filteredDrafts.length} quiz</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Drafts List */}
            {filteredDrafts.length === 0 ? (
                <Card className="dark:border-white/10 dark:bg-slate-800/50">
                    <CardContent className="p-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">{searchTerm ? 'Không tìm thấy quiz nào' : 'Chưa có quiz nháp nào'}</h3>
                        <p className="text-muted-foreground mb-4">{searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Các quiz bạn tạo sẽ được lưu tự động ở đây nếu gặp lỗi'}</p>
                        {!searchTerm && (
                            <Button className="dark:text-white" onClick={() => navigate('/themcauhoi/ai-create')} variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo quiz đầu tiên
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredDrafts.map((draft, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow dark:border-white/10 dark:bg-slate-800/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-2">{draft.title || 'Không có tiêu đề'}</CardTitle>
                                        <CardDescription className="mt-1 line-clamp-2">{draft.content || 'Không có mô tả'}</CardDescription>
                                    </div>
                                    <Badge variant={draft.status === 'in-progress' ? 'default' : 'secondary'} className="ml-2 shrink-0 dark:text-white">
                                        {draft.status === 'in-progress' ? 'Đang làm' : 'Nháp'}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-1">
                                        {getCreatedByIcon(draft.createdBy)}
                                        <span className="text-muted-foreground">{getCreatedByLabel(draft.createdBy)}</span>
                                    </div>
                                    <Badge className={getDifficultyColor(draft.difficulty)}>{getDifficultyLabel(draft.difficulty)}</Badge>
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        <FileText className="h-4 w-4" />
                                        <span>{draft.questions.length} câu hỏi</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>~{Math.ceil(draft.questions.length * 1.5)} phút làm bài</span>
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>Tạo: {handleCompareDate(draft.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 ">
                                        <Edit className="h-3 w-3" />
                                        <span>Sửa: {handleCompareDate(draft.updatedAt)}</span>
                                    </div>
                                </div>

                                <div className="flex space-x-2 pt-2">
                                    <Button size="sm" variant="outline" onClick={() => handlePreviewDraft(draft)} className="flex-1">
                                        <Eye className="mr-1 h-3 w-3" />
                                        Xem
                                    </Button>
                                    <DialogAddMoreInfoQuiz generatedQuiz={generatedQuiz} openAddMoreInfo={openAddMoreInfo} setOpenAddMoreInfo={setOpenAddMoreInfo}>
                                        <Button size="sm" className="flex-1 dark:text-white bg-linear-to-r from-blue-500 to-cyan-500" onClick={() => handleSetValueGeneratedQuiz(draft)}>
                                            <Aperture className="mr-1 h-3 w-3" />
                                            Xuất bản
                                        </Button>
                                    </DialogAddMoreInfoQuiz>
                                    <Button size="sm" variant="outline" onClick={() => handleDeleteDraft(draft)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            {generatedQuiz && <AIResultPreview open={showPreview} onOpenChange={setShowPreview} quiz={generatedQuiz} setGeneratedQuiz={setGeneratedQuiz} setOpenAddMoreInfo={setOpenAddMoreInfo} />}

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                    </DialogHeader>
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/50 dark:border-red-700">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-200" />
                        <AlertDescription className="text-red-800 dark:text-red-300">
                            Bạn có chắc chắn muốn xóa quiz &quot;{draftToDelete?.title}&quot;? Hành động này không thể hoàn tác.
                        </AlertDescription>
                    </Alert>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
