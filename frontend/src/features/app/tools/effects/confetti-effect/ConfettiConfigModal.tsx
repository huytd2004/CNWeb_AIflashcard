import { useState, useEffect } from 'react'
import { X, PartyPopper, Check } from 'lucide-react'
import { defaultSettings, useEffects, type ConfettiSettings } from '../../context/EffectContext'

interface ConfettiConfigModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ConfettiConfigModal({ isOpen, onClose }: ConfettiConfigModalProps) {
    const { activeEffects, updateEffectSettings } = useEffects()
    const currentSettings = activeEffects.confetti as ConfettiSettings

    const [localSettings, setLocalSettings] = useState<ConfettiSettings>(defaultSettings.confetti as ConfettiSettings)

    useEffect(() => {
        if (isOpen && currentSettings) {
            setLocalSettings({ ...currentSettings })
        }
    }, [isOpen, currentSettings])

    if (!isOpen) return null

    const handleSave = () => {
        updateEffectSettings('confetti', localSettings)
        onClose()
    }

    const handleReset = () => {
        setLocalSettings(defaultSettings.confetti as ConfettiSettings)
    }

    const handleColorChange = (index: number, color: string) => {
        const newColors = [...localSettings.colors]
        newColors[index] = color
        setLocalSettings({ ...localSettings, colors: newColors })
    }

    const addColor = () => {
        const newColors = [...localSettings.colors]
        const randomColor = `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0')}`
        newColors.push(randomColor)
        setLocalSettings({ ...localSettings, colors: newColors })
    }

    const removeColor = (index: number) => {
        const newColors = [...localSettings.colors]
        if (newColors.length > 1) {
            newColors.splice(index, 1)
            setLocalSettings({ ...localSettings, colors: newColors })
        }
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 rounded-t-xl flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                            <PartyPopper className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cấu hình Confetti</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hiệu ứng pháo giấy</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Density */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Mật độ</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['low', 'medium', 'high'] as const).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setLocalSettings({ ...localSettings, density: option })}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                        localSettings.density === option
                                            ? 'bg-pink-500 border-pink-500 text-white'
                                            : 'border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {option === 'low' ? 'Ít' : option === 'medium' ? 'Vừa' : 'Nhiều'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Kích thước</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['small', 'medium', 'large'] as const).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setLocalSettings({ ...localSettings, size: option })}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                        localSettings.size === option
                                            ? 'bg-pink-500 border-pink-500 text-white'
                                            : 'border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {option === 'small' ? 'Nhỏ' : option === 'medium' ? 'Vừa' : 'Lớn'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Màu sắc</label>
                        <div className="flex flex-wrap gap-2">
                            {localSettings.colors.map((color, index) => (
                                <div key={index} className="flex items-center gap-1 group relative">
                                    <input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} className="w-8 h-8 cursor-pointer rounded border-0 p-0" />
                                    {localSettings.colors.length > 1 && (
                                        <button
                                            onClick={() => removeColor(index)}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full shadow border flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addColor}
                                className="w-8 h-8 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded hover:border-pink-500 hover:text-pink-500 text-gray-400 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Shape */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Hình dạng</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['circle', 'rectangle', 'star'] as const).map((shape) => (
                                <button
                                    key={shape}
                                    onClick={() => {
                                        const currentShapes = localSettings.shapes
                                        const newShapes = currentShapes.includes(shape) ? currentShapes.filter((s) => s !== shape) : [...currentShapes, shape]
                                        if (newShapes.length > 0) setLocalSettings({ ...localSettings, shapes: newShapes })
                                    }}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all flex items-center justify-center gap-2 ${
                                        localSettings.shapes.includes(shape)
                                            ? 'bg-pink-500 border-pink-500 text-white'
                                            : 'border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {shape === 'circle' && '●'}
                                    {shape === 'rectangle' && '■'}
                                    {shape === 'star' && '★'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    {/* Physics */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Trọng lực ({localSettings.gravity})</label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={localSettings.gravity}
                            onChange={(e) =>
                                setLocalSettings({
                                    ...localSettings,
                                    gravity: parseFloat(e.target.value),
                                })
                            }
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Bay cao</span>
                            <span>Rơi nhanh</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-700 rounded-b-xl flex gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Mặc định
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
                    >
                        <Check className="w-4 h-4" />
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    )
}
