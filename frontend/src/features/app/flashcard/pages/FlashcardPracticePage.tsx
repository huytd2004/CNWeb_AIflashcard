import flashcardService from '@/services/flashcardService'
import { useFetching } from '@/hooks/useFetching'
import FlashcardPractice from '../components/FlashcardPractice'
import LoadingScreen from '@/components/etc/LoadingScreen'
import DataEmptyNoti from '@/components/etc/DataEmptyNoti'

export default function FlashcardPracticePage() {
    const { data, loading } = useFetching(() => flashcardService.getFlashcardPractice())
    if (loading && data === null) return LoadingScreen()
    if (data?.listFlashCards.length === 0) {
        return <DataEmptyNoti title="Không có thẻ ghi nhớ nào để luyện tập." message="Vui lòng tạo hoặc thêm thẻ ghi nhớ để bắt đầu luyện tập." />
    }
    return <FlashcardPractice flashcardData={data?.listFlashCards} />
}
