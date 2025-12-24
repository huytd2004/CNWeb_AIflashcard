import { useState, type ReactNode } from 'react'
import { Settings, Play, StopCircle } from 'lucide-react'
import BubblesConfigModal from '../effects/bubble-effect/BubblesConfigModal'
import LeavesConfigModal from '../effects/leaf-effect/LeavesConfigModal'
import FireworksConfigModal from '../effects/firework-effect/FireworksConfigModal'
import MouseTrailConfigModal from '../effects/mouse-effect/MouseTrailConfigModal'
import SnowConfigModal from '../effects/snow-effect/SnowConfigModal'
import { useEffects, type EffectType } from '../context/EffectContext'
import ConfettiConfigModal from '../effects/confetti-effect/ConfettiConfigModal'

interface ToolCardProps {
    tool: {
        id: string
        icon: ReactNode
        enabled: boolean
        effectType?: EffectType
        externalLink?: string
    }
    name: string
    description: string
}

export default function ToolCard({ tool, name, description }: ToolCardProps) {
    const [showConfigModal, setShowConfigModal] = useState(false)
    const { toggleEffect, isEffectEnabled } = useEffects()

    const isActive = tool.effectType ? isEffectEnabled(tool.effectType) : false

    const handleToolClick = () => {
        if (!tool.enabled) return

        if (tool.effectType) {
            if (!isActive) {
                setShowConfigModal(true)
            } else {
                toggleEffect(tool.effectType)
            }
        } else if (tool.externalLink) {
            window.open(tool.externalLink, '_blank')
        }
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (tool.effectType) {
            toggleEffect(tool.effectType)
        }
    }

    const renderConfigModal = () => {
        if (!tool.effectType) return null

        const commonProps = {
            isOpen: showConfigModal,
            onClose: () => setShowConfigModal(false),
        }

        switch (tool.effectType) {
            case 'snow':
                return <SnowConfigModal {...commonProps} />
            case 'confetti':
                return <ConfettiConfigModal {...commonProps} />
            case 'bubbles':
                return <BubblesConfigModal {...commonProps} />
            case 'leaves':
                return <LeavesConfigModal {...commonProps} />
            case 'fireworks':
                return <FireworksConfigModal {...commonProps} />
            case 'mouse-trail':
                return <MouseTrailConfigModal {...commonProps} />
            default:
                return null
        }
    }
    return (
        <>
            <div
                className={`bg-white dark:bg-gray-800 rounded-xl shadow p-5 transition-all duration-300 ${
                    tool.enabled ? 'hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400' : 'opacity-50 cursor-not-allowed'
                } ${isActive ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20' : ''}`}
                onClick={handleToolClick}
            >
                <div className="flex items-start justify-between mb-3">
                    <div
                        className={`p-3 rounded-xl ${
                            isActive
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : tool.enabled
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                    >
                        {tool.icon}
                    </div>

                    {tool.effectType && (
                        <button
                            onClick={handleToggle}
                            className={`p-2 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40'
                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            title={isActive ? 'Tắt' : 'Bật'}
                        >
                            {isActive ? <StopCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                    )}
                </div>

                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>

                    <div className="flex items-center justify-between">
                        {!tool.enabled ? (
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full">Các tính năng khác sẽ sớm có</span>
                        ) : tool.effectType ? (
                            <div className="flex items-center gap-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{isActive ? 'Kích hoạt' : 'Chưa kích hoạt'}</span>
                            </div>
                        ) : (
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Các tools khác</span>
                        )}

                        {/* Show settings button only for effects that have config modals */}
                        {tool.effectType && tool.enabled && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowConfigModal(true)
                                }}
                                className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                title="Cài đặt"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showConfigModal && renderConfigModal()}
        </>
    )
}
