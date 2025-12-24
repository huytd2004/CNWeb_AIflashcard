import { useState, useEffect } from 'react'
import { X, Check, Snowflake } from 'lucide-react'
import { defaultSettings, useEffects, type SnowSettings } from '../../context/EffectContext'

interface SnowConfigModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SnowConfigModal({ isOpen, onClose }: SnowConfigModalProps) {
    const { activeEffects, updateEffectSettings } = useEffects()

    // Get current settings
    const currentSettings = activeEffects.snow as SnowSettings

    // State local
    const [localSettings, setLocalSettings] = useState<SnowSettings>(defaultSettings.snow as SnowSettings)

    // Sync state when open modal
    useEffect(() => {
        if (isOpen && currentSettings) {
            setLocalSettings({ ...currentSettings })
        }
    }, [isOpen, currentSettings])

    if (!isOpen) return null

    // Handler toggle ground safe
    const handleToggleGround = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setLocalSettings((prev) => ({
            ...prev,
            showGround: !prev.showGround,
        }))
    }

    const handleReset = () => {
        setLocalSettings({
            ...(defaultSettings.snow as SnowSettings),
            enabled: localSettings.enabled,
        })
    }

    const handleApply = () => {
        updateEffectSettings('snow', localSettings)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <Snowflake className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hiệu ứng Tuyết rơi</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Tùy chỉnh không gian mùa đông</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* 1. Density */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mật độ ({localSettings.count})</label>
                        <input
                            type="range"
                            min="10"
                            max="200"
                            step="10"
                            value={localSettings.count}
                            onChange={(e) =>
                                setLocalSettings({
                                    ...localSettings,
                                    count: Number(e.target.value),
                                })
                            }
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    {/* 2. Grid Speed and Size */}
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Tốc độ rơi</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['slow', 'medium', 'fast'] as const).map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setLocalSettings({ ...localSettings, speed: option })}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                            localSettings.speed === option
                                                ? 'bg-blue-500 border-blue-500 text-white'
                                                : 'border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {option === 'slow' ? 'Chậm' : option === 'medium' ? 'Vừa' : 'Nhanh'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Kích thước</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['small', 'medium', 'large'] as const).map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setLocalSettings({ ...localSettings, size: option })}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                            localSettings.size === option
                                                ? 'bg-blue-500 border-blue-500 text-white'
                                                : 'border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {option === 'small' ? 'Nhỏ' : option === 'medium' ? 'Vừa' : 'Lớn'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    <div className="space-y-4">
                        {/* Color */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Màu sắc tuyết</label>
                            <input
                                type="color"
                                value={localSettings.color}
                                onChange={(e) => setLocalSettings({ ...localSettings, color: e.target.value })}
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                        </div>

                        {/* Toggle Switch Toggle Ground */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group"
                            onClick={handleToggleGround}
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Hiệu ứng tích tụ dưới đất</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Hiển thị lớp tuyết mờ ở cuối trang</span>
                            </div>

                            {/* Visual Switch */}
                            <div
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out border-2 border-transparent ${
                                    localSettings.showGround ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            >
                                <div
                                    className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                                        localSettings.showGround ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4 rounded-b-xl flex gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Mặc định
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
                    >
                        <Check className="w-4 h-4" />
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    )
}
