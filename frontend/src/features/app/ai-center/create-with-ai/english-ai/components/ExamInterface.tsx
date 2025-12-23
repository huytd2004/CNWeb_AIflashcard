import { Button } from '@/components/ui/button'
import { FolderUp, X } from 'lucide-react'
import { FillInBlankQuestion } from './fill-in-blank'
import { MatchingQuestion } from './matching'
import type { IEnglishExam } from '@/types/english-exam'
import { RearrangeSentencesQuestion } from './rearrange-sentences'
import { RewriteSentenceQuestion } from './rewrite-sentence'
import { ReadingComprehensionQuestion } from './reading-comprehension'
import { ListeningComprehensionQuestion } from './listening-comprehension'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { MultipleChoiceQuestion } from './multiple-choice'
import engExService from '@/services/engExService'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
interface ExamInterfaceProps {
    examData: IEnglishExam
    open: boolean
    setOpen: (open: boolean) => void
    isEdit?: boolean
}

export function ExamInterface({ examData, isEdit = true, open, setOpen }: ExamInterfaceProps) {
    const renderQuestion = (question: any) => {
        switch (question.question_type) {
            case 'multiple_choice':
                return <MultipleChoiceQuestion question={question} />
            case 'fill_in_the_blank':
                return <FillInBlankQuestion question={question} />
            case 'matching':
                return <MatchingQuestion question={question} />
            case 'rearrange_sentences':
                return <RearrangeSentencesQuestion question={question} />
            case 'rewrite_sentence':
                return <RewriteSentenceQuestion question={question} />
            case 'reading_comprehension':
                return <ReadingComprehensionQuestion question={question} />
            case 'listening_comprehension':
                return <ListeningComprehensionQuestion question={question} />
            default:
                return <div className="text-slate-400">Unsupported question type</div>
        }
    }

    const handlePublish = async () => {
        // Logic to handle publishing the exam
        try {
            toast.loading('Đang xuất bản bài thi...', { duration: 5000, id: 'publish-exam' })
            const req = await engExService.createEnglishExam(examData)
            if (req.ok) {
                toast.success('Đã tạo bài thi thành công!')
                setOpen(false) // Close the dialog after publishing
            }
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            toast.dismiss('publish-exam') // Dismiss the loading toast
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="h-[90vh] p-3 md:p-6 w-full md:max-w-7xl">
                <div className="min-h-[500px]  md:min-h-[600px] overflow-y-scroll space-y-3">
                    <div className="">
                        <h1 className="text-xl font-semibold">{examData.title || 'Chưa có tiêu đề'}</h1>
                        <div className="dark:text-white/80 text-sm space-y-1">
                            <p>{examData.description || 'Chưa có mô tả'}</p>
                            {examData.skills.map((skill, index) => (
                                <Badge variant="secondary" key={index} className="mr-2 mb-2">
                                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                </Badge>
                            ))}
                            <p>Thời gian làm bài: {examData.timeLimit}p</p>
                        </div>
                    </div>
                    {examData.questions.map((question: any, index) => (
                        <div className="" key={index}>
                            {renderQuestion(question)}
                        </div>
                    ))}
                </div>
                <div className={`flex gap-3 justify-end ${examData.title === 'test-ai-english' ? 'hidden' : ''}`}>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        <X />
                        Đóng
                    </Button>
                    {isEdit && (
                        <Button className="text-white bg-linear-to-r from-purple-500 to-pink-500" onClick={handlePublish}>
                            <FolderUp /> Xuất bản
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
