'use client'
import { useState, useEffect } from 'react'
import { X, Check, MousePointer, Activity, Sparkles, Zap, RotateCcw } from 'lucide-react'
import { useEffects, type MouseTrailSettings, type MouseTrailStyle } from '../../context/EffectContext'

const DEFAULTS: Partial<MouseTrailSettings> = {
    trailType: 'string',
    color: '#00ffff',
    length: 15,
    size: 4,
}

export default function MouseTrailConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { activeEffects, updateEffectSettings } = useEffects()
    const settings = activeEffects['mouse-trail'] as MouseTrailSettings
    const [temp, setTemp] = useState<Partial<MouseTrailSettings>>({})

    useEffect(() => {
        if (isOpen) setTemp({ ...settings })
    }, [isOpen, settings])

    const handleReset = () => setTemp({ ...DEFAULTS })

    if (!isOpen) return null

    const STYLES: { id: MouseTrailStyle; label: string; icon: any }[] = [
        { id: 'string', label: 'Dây Lụa', icon: Activity },
        { id: 'particle', label: 'Hạt Bụi', icon: Sparkles },
        { id: 'comet', label: 'Sao Chổi', icon: Zap },
    ]

    const isStringStyle = temp.trailType === 'string'

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <MousePointer className="w-6 h-6 text-yellow-500" />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">Cấu hình Chuột</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Style Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-3 dark:text-gray-300">Kiểu hiệu ứng</label>
                        <div className="grid grid-cols-3 gap-3">
                            {STYLES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setTemp({ ...temp, trailType: s.id })}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                        temp.trailType === s.id
                                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                                            : 'border-gray-100 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    <s.icon className={`w-6 h-6 mb-2 ${temp.trailType === s.id ? 'fill-current' : ''}`} />
                                    <span className="text-xs font-medium">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Màu sắc</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="color"
                                value={temp.color || '#00ffff'}
                                onChange={(e) => setTemp({ ...temp, color: e.target.value })}
                                className="w-12 h-12 rounded-lg cursor-pointer border-0 p-1 bg-gray-100 dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-500 font-mono uppercase">{temp.color}</span>
                        </div>
                    </div>

                    {/* Length Slider - DISABLED WHEN CHOOSE STRING */}
                    <div className={`transition-opacity duration-200 ${isStringStyle ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium dark:text-gray-300">
                                Độ dài đuôi {isStringStyle && <span className="text-xs font-normal italic ml-2">(Tự động theo tốc độ)</span>}
                            </label>
                            <span className="text-sm font-bold text-yellow-500">{temp.length}</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            disabled={isStringStyle} // Disable input
                            value={temp.length || 15}
                            onChange={(e) => setTemp({ ...temp, length: Number(e.target.value) })}
                            className={`w-full accent-yellow-500 h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700 ${isStringStyle ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                    </div>

                    {/* Size Slider */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium dark:text-gray-300">Kích thước</label>
                            <span className="text-sm font-bold text-yellow-500">{temp.size}</span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={temp.size || 4}
                            onChange={(e) => setTemp({ ...temp, size: Number(e.target.value) })}
                            className="w-full accent-yellow-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t flex justify-between gap-3 dark:border-gray-700">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" /> <span>Mặc định</span>
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => {
                                updateEffectSettings('mouse-trail', temp)
                                onClose()
                            }}
                            className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-yellow-200 dark:shadow-none"
                        >
                            <Check className="w-4 h-4" /> Áp dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
