import UserProfile from '../components/UserProfile'
import { useFetching } from '@/hooks/useFetching'
import profileService from '@/services/profileService'
import LoadingScreen from '@/components/etc/LoadingScreen'

export default function ProfilePage() {
    const { data, loading } = useFetching(() => profileService.getProfile(), {})

    if (loading) {
        return LoadingScreen()
    }
    return (
        <UserProfile
            profile={data?.user}
            quiz={data?.quiz}
            flashcard={data?.flashcards}
            gamificationProfile={data?.gamificationProfile}
            achievements={data?.achievements}
            levels={data?.levels}
            activities={data?.activities}
            countFlashcard={data?.countFlashcard}
            isAnotherUser={true}
        />
    )
}
