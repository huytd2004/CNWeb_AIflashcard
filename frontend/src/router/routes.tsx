import AICenterPage from '@/features/app/ai-center/AICenterPage'
import { CreateWithAIHomePage } from '@/features/app/ai-center/create-with-ai/CreateWithAIHomePage'
import { DraftsPage } from '@/features/app/ai-center/create-with-ai/draft/DraftsPage'
import EnglishAIPage from '@/features/app/ai-center/create-with-ai/english-ai/EnglishAIPage'
import { QuizAIPage } from '@/features/app/ai-center/create-with-ai/quiz-ai/QuizAIPage'
import ChatCommunityPage from '@/features/app/community/ChatCommunityPage'
import TopUserPage from '@/features/app/community/components/TopUserPage'
import FlashcardDetailPage from '@/features/app/flashcard/pages/FlashcardDetailPage'
import FlashcardPage from '@/features/app/flashcard/pages/FlashcardPage'
import FlashcardPracticeDetailPage from '@/features/app/flashcard/pages/FlashcardPracticeDetailPage'
import FlashcardPracticePage from '@/features/app/flashcard/pages/FlashcardPracticePage'
import HistoryDetailPage from '@/features/app/history/HistoryDetailPage'
import HistoryPage from '@/features/app/history/HistoryPage'
import HomePage from '@/features/app/home/HomePage'
import ProfileByIdPage from '@/features/app/profile/pages/ProfileByIdPage'
import ProfilePage from '@/features/app/profile/pages/ProfilePage'
import DeCuongDetailPage from '@/features/app/subject-outline/pages/DeCuongDetailPage'
import QuizDetailPage from '@/features/app/quiz/pages/QuizDetailPage'
import QuizExamPage from '@/features/app/quiz/pages/QuizExamPage'
import QuizPage from '@/features/app/quiz/pages/QuizPage'
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import UpdatePasswordPage from '@/features/auth/UpdatePasswordPage'
import NotFound from '@/features/not-found/NotFound'
import AICenterLayout from '@/layouts/AICenterLayout'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'
import RootLayout from '@/layouts/RootLayout'
import type { RouteObject } from 'react-router-dom'
import SubjectOutlinePage from '@/features/app/subject-outline/pages/SubjectOutlinePage'
import SOFlashcardPage from '@/features/app/subject-outline/pages/SOFlashcardPage'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                    {
                        path: 'flashcard',
                        element: <FlashcardPage />,
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />,
                    },
                    {
                        path: 'profile/:userId',
                        element: <ProfileByIdPage />,
                    },
                    {
                        path: 'ai-center',
                        element: <AICenterPage />,
                    },
                    {
                        path: 'quiz',
                        element: <QuizPage />,
                    },
                    {
                        path: 'community',
                        element: <ChatCommunityPage />,
                    },
                    {
                        path: '/community/top',
                        element: <TopUserPage />,
                    },
                    {
                        path: '/history',
                        element: <HistoryPage />,
                    },
                    {
                        path: '/history/:id',
                        element: <HistoryDetailPage />,
                    },
                    {
                        path: '/decuong',
                        element: <SubjectOutlinePage />,
                    },
                ],
            },
            {
                path: 'quiz/:slug',
                element: <QuizExamPage />,
            },
            {
                path: 'quiz/detail/:slug',
                element: <QuizDetailPage />,
            },
            {
                path: 'decuong/:slug',
                element: <DeCuongDetailPage />,
            },
            {
                path: 'decuong/flashcard/:slug',
                element: <SOFlashcardPage />,
            },
            {
                path: 'flashcard/:id_flashcard',
                element: <FlashcardDetailPage />,
            },
            {
                path: 'flashcard/practice',
                element: <FlashcardPracticePage />,
            },
            {
                path: 'flashcard/practice/:id_flashcard',
                element: <FlashcardPracticeDetailPage />,
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />,
                    },
                    {
                        path: 'register',
                        element: <RegisterPage />,
                    },
                    {
                        path: 'forgot-password',
                        element: <ForgotPasswordPage />,
                    },
                    {
                        path: 'update-password',
                        element: <UpdatePasswordPage />,
                    },
                ],
            },
            {
                path: 'ai-center',
                element: <AICenterLayout />,
                children: [
                    {
                        index: true,
                        path: '',
                        element: <CreateWithAIHomePage />,
                    },
                    {
                        path: 'create-with-ai',
                        element: <CreateWithAIHomePage />,
                    },
                    {
                        path: 'create-with-ai/quiz-ai',
                        element: <QuizAIPage />,
                    },
                    {
                        path: 'create-with-ai/english-ai',
                        element: <EnglishAIPage />,
                    },
                    {
                        path: 'drafts',
                        element: <DraftsPage />,
                    },
                ],
            },

            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
