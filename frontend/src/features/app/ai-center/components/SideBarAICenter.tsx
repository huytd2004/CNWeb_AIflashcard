import { Bot, FileText, Save, Sparkle, ListTodo, Hand, ChevronLeft } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function SideBarAICenter() {
    const menuItems = [
        {
            title: 'Tạo bằng AI',
            icon: Sparkle,
            id: 'create-with-ai',
            subMenu: [
                {
                    title: 'Quiz AI',
                    icon: Bot,
                    id: 'quiz-ai',
                    description: 'Ra lệnh cho AI thực hiện',
                    isHot: true,
                },
                {
                    title: 'English Exam AI',
                    icon: ListTodo,
                    id: 'english-ai',
                    description: 'Tạo đề thi tiếng anh',
                },
            ],
        },
        {
            title: 'Thủ công',
            icon: Hand,
            id: 'create-with-hand',
            subMenu: [
                {
                    title: 'Tạo Quiz từ file',
                    icon: FileText,
                    id: 'manual-quiz-file',
                    description: 'Tạo quiz từ file docx',
                },
                // {
                //     title: "Nhập câu hỏi từ file",
                //     icon: Upload,
                //     id: "file-import-questions",
                //     description: "Nhập câu hỏi từ file đã nhập",
                // },
            ],
        },
    ]

    const navigate = useNavigate()

    return (
        <div className="">
            <Sidebar variant="floating" className="mt-20 w-64 h-[calc(100vh-200px)]">
                <SidebarHeader className="p-4">
                    <Button variant={'outline'} onClick={() => navigate(-1)}>
                        <ChevronLeft />
                        Quay về
                    </Button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-linear-to-r from-primary to-purple-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <span className="font-bold text-lg">AI Center</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => (
                                    <Collapsible defaultOpen className="group/collapsible" key={item.id}>
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton onClick={() => navigate(`/ai-center/${item.id}`)} className="w-full justify-start h-10 px-3">
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <SidebarMenuSub>
                                                {item.subMenu.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.id}>
                                                        <SidebarMenuSubButton onClick={() => navigate(`/ai-center/${item.id}/${subItem.id}`)} className="w-full justify-start h-14 px-3 cursor-pointer">
                                                            <subItem.icon className="mr-2 h-4 w-4" />
                                                            <div className="flex flex-col items-start">
                                                                <span>{subItem.title}</span>
                                                                <span className="text-xs text-muted-foreground">{subItem.description}</span>
                                                            </div>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => navigate(`/ai-center/drafts`)} className="w-full justify-start h-14 px-3">
                                        <Save className="mr-2 h-4 w-4" />
                                        <div className="flex flex-col items-start">
                                            <span>Nháp</span>
                                            <span className="text-xs text-muted-foreground">Lưu nháp lại các bài quiz </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                {/* <SidebarFooter>
                    <SidebarMenu>
                        {bottomItems.map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton onClick={() => navigate(`/quiz/themcauhoi/${bottomItems[1].id}`)}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarFooter> */}
            </Sidebar>
        </div>
    )
}
