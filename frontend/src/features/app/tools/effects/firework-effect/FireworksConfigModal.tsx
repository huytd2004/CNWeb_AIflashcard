import { useState, useEffect } from 'react'
import { X, Check, Sparkles, RotateCcw } from 'lucide-react'
import { useEffects, type FireworksSettings } from '../../context/EffectContext'

const DEFAULTS: Partial<FireworksSettings> = {
    intensity: 30,
    explosion: 5,
    trace: 3,
    sound: false,
}

export default function FireworksConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { activeEffects, updateEffectSettings } = useEffects()
    const settings = activeEffects.fireworks as FireworksSettings
    const [temp, setTemp] = useState<Partial<FireworksSettings>>({})

    useEffect(() => {
        if (isOpen) setTemp({ ...settings })
    }, [isOpen, settings])

    const handleReset = () => {
        setTemp({ ...DEFAULTS })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Sparkles className="w-6 h-6 text-purple-500" />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">Cấu hình hiệu ứng Pháo hoa</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Intensity */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium dark:text-gray-300">Mật độ bắn</label>
                            <span className="text-sm font-bold text-purple-500">{temp.intensity}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="60"
                            value={temp.intensity || 30}
                            onChange={(e) => setTemp({ ...temp, intensity: Number(e.target.value) })}
                            className="w-full accent-purple-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Thưa</span>
                            <span>Dày đặc</span>
                        </div>
                    </div>

                    {/* Explosion Size */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium dark:text-gray-300">Độ lớn vụ nổ</label>
                            <span className="text-sm font-bold text-blue-500">{temp.explosion}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={temp.explosion || 5}
                            onChange={(e) => setTemp({ ...temp, explosion: Number(e.target.value) })}
                            className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Nhỏ</span>
                            <span>Khổng lồ</span>
                        </div>
                    </div>

                    {/* Trace Length */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium dark:text-gray-300">Độ dài vệt đuôi</label>
                            <span className="text-sm font-bold text-orange-500">{temp.trace}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={temp.trace ?? 3}
                            onChange={(e) => setTemp({ ...temp, trace: Number(e.target.value) })}
                            className="w-full accent-orange-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                    </div>

                    {/* Sound Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <span className="text-sm font-medium dark:text-gray-300">Âm thanh</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={temp.sound || false} onChange={(e) => setTemp({ ...temp, sound: e.target.checked })} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t flex justify-between gap-3 dark:border-gray-700">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Mặc định</span>
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
                                updateEffectSettings('fireworks', temp)
                                onClose()
                            }}
                            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium shadow-lg shadow-purple-200 dark:shadow-none"
                        >
                            <Check className="w-4 h-4" />
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
