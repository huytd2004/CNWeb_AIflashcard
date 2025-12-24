import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, ListTodo } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function CreateWithAIHomePage() {
    const navigate = useNavigate()
    const options = [
        {
            id: 'quiz-ai',
            title: 'Quiz AI',
            description: 'Ra lệnh cho AI thực hiện',
            icon: Bot,
            link: '/ai-center/create-with-ai/quiz-ai',
            gradient: 'from-primary/80 to-purple-800/70',
            features: ['Tạo nhanh chóng', 'Đa dạng chủ đề', 'Tự động tối ưu'],
        },
        {
            id: 'english-ai',
            title: 'English Exam AI',
            description: 'Tạo đề thi tiếng anh với AI',
            icon: ListTodo,
            link: '/ai-center/create-with-ai/english-ai',
            gradient: 'from-primary/80 to-purple-800/70',
            features: ['Hỗ trợ nhiều dạng câu hỏi như:', ' Tự luận, Trắc nghiệm, Điền từ,...', 'Tùy chỉnh độ khó và chủ đề'],
        },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                    <SidebarTrigger />

                    <h1 className="text-3xl font-bold ">Tạo bằng AI</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Chọn phương thức tạo phù hợp với nhu cầu của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {options.map((option) => (
                    <Card
                        key={option.id}
                        className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => navigate(`/ai-center/create-with-ai/${option.id}`)}
                    >
                        <div className={`absolute inset-0 bg-linear-to-br ${option.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                        <CardHeader className="text-center space-y-4">
                            <div className={`w-16 h-16 mx-auto rounded-2xl bg-linear-to-br ${option.gradient} flex items-center justify-center`}>
                                <option.icon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{option.title}</CardTitle>
                                <CardDescription className="mt-2">{option.description}</CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <ul className="space-y-2">
                                {option.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${option.gradient} mr-2`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full bg-linear-to-r dark:text-white ${option.gradient} hover:opacity-90 transition-opacity`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/quiz/themcauhoi/${option.id}`)
                                }}
                            >
                                Bắt đầu tạo
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
