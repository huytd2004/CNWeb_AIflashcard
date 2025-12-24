'use client'

import type { ReactNode } from 'react'
import ToolCard from './ToolCard'
import { Snowflake, Sparkles, Volume2, FileText, Image, Music, Code, Calculator, PartyPopper, Droplets, Leaf, MousePointer } from 'lucide-react'
import type { EffectType } from '../context/EffectContext'

export interface ToolItem {
    id: string
    icon: ReactNode
    enabled: boolean
    effectType?: EffectType
    externalLink?: string
}

const toolsData: ToolItem[] = [
    {
        id: 'snow-effect',
        icon: <Snowflake className="w-6 h-6" />,
        enabled: true,
        effectType: 'snow' as EffectType,
    },
    {
        id: 'confetti',
        icon: <PartyPopper className="w-6 h-6" />,
        enabled: true,
        effectType: 'confetti' as EffectType,
    },
    {
        id: 'bubbles',
        icon: <Droplets className="w-6 h-6" />,
        enabled: true,
        effectType: 'bubbles' as EffectType,
    },
    {
        id: 'leaves',
        icon: <Leaf className="w-6 h-6" />,
        enabled: true,
        effectType: 'leaves' as EffectType,
    },
    {
        id: 'fireworks',
        icon: <Sparkles className="w-6 h-6" />,
        enabled: true,
        effectType: 'fireworks' as EffectType,
    },
    {
        id: 'mouse-trail',
        icon: <MousePointer className="w-6 h-6" />,
        enabled: true,
        effectType: 'mouse-trail' as EffectType,
    },
    {
        id: 'text-to-speech',
        icon: <Volume2 className="w-6 h-6" />,
        enabled: false,
    },
    {
        id: 'docx-to-pdf',
        icon: <FileText className="w-6 h-6" />,
        enabled: false,
    },
    {
        id: 'image-converter',
        icon: <Image className="w-6 h-6" />,
        enabled: false,
    },
    {
        id: 'music-player',
        icon: <Music className="w-6 h-6" />,
        enabled: false,
    },
    {
        id: 'code-formatter',
        icon: <Code className="w-6 h-6" />,
        enabled: false,
    },
    {
        id: 'calculator',
        icon: <Calculator className="w-6 h-6" />,
        enabled: false,
    },
]

interface ToolCategoryProps {
    category: 'websiteEffects' | 'utilityTools' | 'availableTools' | 'comingSoon'
}

export default function ToolCategory({ category }: ToolCategoryProps) {
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} name={tool.id} description={`${tool.id}Desc`} />
                ))}
            </div>
        </div>
    )
}

export { toolsData }
