'use client'

import type { ReactNode } from 'react'
import ToolCard from './ToolCard'
import { Snowflake, Sparkles, Volume2, FileText, Image, Music, Code, Calculator, PartyPopper, Droplets, Leaf, MousePointer } from 'lucide-react'
import type { EffectType } from '../context/EffectContext'
import { Highlighter } from '../ui/highlighter'

export interface ToolItem {
    id: string
    icon: ReactNode
    enabled: boolean
    effectType?: EffectType
    externalLink?: string
    desc: string
}

const toolsData: ToolItem[] = [
    {
        id: 'snow-effect',
        icon: <Snowflake className="w-6 h-6" />,
        enabled: true,
        effectType: 'snow' as EffectType,
        desc: 'Tạo không khí Giáng sinh với hiệu ứng tuyết rơi',
    },
    {
        id: 'confetti',
        icon: <PartyPopper className="w-6 h-6" />,
        enabled: true,
        effectType: 'confetti' as EffectType,
        desc: 'Confetti rơi cho các dịp kỷ niệm',
    },
    {
        id: 'bubbles',
        icon: <Droplets className="w-6 h-6" />,
        enabled: true,
        effectType: 'bubbles' as EffectType,
        desc: 'Bong bóng bay lên nhẹ nhàng',
    },
    {
        id: 'leaves',
        icon: <Leaf className="w-6 h-6" />,
        enabled: true,
        effectType: 'leaves' as EffectType,
        desc: 'Lá rơi mùa thu hoặc mùa xuân',
    },
    {
        id: 'fireworks',
        icon: <Sparkles className="w-6 h-6" />,
        enabled: true,
        effectType: 'fireworks' as EffectType,
        desc: 'Pháo hoa nổ rực rỡ',
    },
    {
        id: 'mouse-trail',
        icon: <MousePointer className="w-6 h-6" />,
        enabled: true,
        effectType: 'mouse-trail' as EffectType,
        desc: 'Vệt sáng theo con trỏ chuột',
    },
    {
        id: 'text-to-speech',
        icon: <Volume2 className="w-6 h-6" />,
        enabled: false,
        desc: 'Chuyển đổi văn bản thành âm thanh với giọng đọc tự nhiên',
    },
    {
        id: 'docx-to-pdf',
        icon: <FileText className="w-6 h-6" />,
        enabled: false,
        desc: 'Chuyển đổi tài liệu Word sang định dạng PDF',
    },
    {
        id: 'image-converter',
        icon: <Image className="w-6 h-6" />,
        enabled: false,
        desc: 'Chuyển đổi giữa các định dạng hình ảnh khác nhau',
    },
    {
        id: 'music-player',
        icon: <Music className="w-6 h-6" />,
        enabled: false,
        desc: 'Trình phát nhạc trực tuyến với nhiều tính năng',
    },
    {
        id: 'code-formatter',
        icon: <Code className="w-6 h-6" />,
        enabled: false,
        desc: 'Mã nguồn đẹp và dễ đọc hơn với công cụ định dạng mã',
    },
    {
        id: 'calculator',
        icon: <Calculator className="w-6 h-6" />,
        enabled: false,
        desc: 'Công cụ tính toán nhanh với các chức năng nâng cao',
    },
]

interface ToolCategoryProps {
    category: 'websiteEffects' | 'utilityTools' | 'availableTools' | 'comingSoon'
    description?: string
}

export default function ToolCategory({ category, description }: ToolCategoryProps) {
    // Filter tools follow category
    const getFilteredTools = () => {
        switch (category) {
            case 'websiteEffects':
                return toolsData.filter((tool) => tool.effectType)
            case 'utilityTools':
                return toolsData.filter((tool) => !tool.effectType && !tool.enabled)
            case 'availableTools':
                return toolsData.filter((tool) => !tool.effectType && tool.enabled)
            case 'comingSoon':
                return toolsData.filter((tool) => !tool.enabled)
            default:
                return toolsData
        }
    }

    const tools = getFilteredTools()

    return (
        <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-blue-500 mb-6">
                <Highlighter action="highlight" color="#b2c7ad">
                    {description}
                </Highlighter>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} name={tool.id} description={tool.desc} />
                ))}
            </div>
        </div>
    )
}

export { toolsData }
