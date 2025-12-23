import { useLocation } from 'react-router-dom'
import flashcardService from '@/services/flashcardService'
import { useFetching } from '@/hooks/useFetching'
import FlashcardPractice from '../components/FlashcardPractice'
import LoadingScreen from '@/components/etc/LoadingScreen'
import DataEmptyNoti from '@/components/etc/DataEmptyNoti'

export default function FlashcardPracticeDetailPage() {
    const location = useLocation()
    const id_flashcard = location.pathname.split('/')[3]
    const { data, loading } = useFetching(() => flashcardService.getFlashcard(id_flashcard))
    if (loading && data === null) return LoadingScreen()
    if (data?.listFlashCards?.flashcards.length === 0) {
        return <DataEmptyNoti title="Không có thẻ ghi nhớ nào để luyện tập." message="Vui lòng tạo hoặc thêm thẻ ghi nhớ để bắt đầu luyện tập." />
    }
    return <FlashcardPractice flashcardData={data?.listFlashCards?.flashcards} />
}
