import UserProfile from '../components/UserProfile'
import { useFetching } from '@/hooks/useFetching'
import profileService from '@/services/profileService'
import LoadingScreen from '@/components/etc/LoadingScreen'
import { useLocation } from 'react-router-dom'

export default function ProfileByIdPage() {
    const location = useLocation()
    const userId = location.pathname.split('/')[2]
    const { data, loading } = useFetching(() => profileService.getProfileById(userId), {})

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
