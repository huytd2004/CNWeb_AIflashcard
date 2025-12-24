import { useState, useEffect } from 'react'
import { X, Check, Leaf, RotateCcw } from 'lucide-react'
import { useEffects, type LeavesSettings } from '../../context/EffectContext'

const DEFAULTS: Partial<LeavesSettings> = {
    season: 'autumn',
    count: 40,
    windStrength: 0.5,
}

export default function LeavesConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { activeEffects, updateEffectSettings } = useEffects()
    const settings = activeEffects.leaves as LeavesSettings
    const [temp, setTemp] = useState<Partial<LeavesSettings>>({})

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
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">Cấu hình Hiệu ứng Lá rơi</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Season */}
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Mùa</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['autumn', 'spring'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setTemp({ ...temp, season: s as any })}
                                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                        temp.season === s
                                            ? 'bg-green-600 text-white border-green-600 shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {s === 'autumn' ? 'Mùa thu 🍂' : 'Mùa xuân 🍃'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium dark:text-gray-300">Số lượng</label>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">{temp.count}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={temp.count || 40}
                            onChange={(e) => setTemp({ ...temp, count: Number(e.target.value) })}
                            className="w-full accent-green-600 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>10</span>
                            <span>100</span>
                        </div>
                    </div>

                    {/* Wind power */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium dark:text-gray-300">Sức gió</label>
                            <span className="text-sm font-bold text-blue-500">{temp.windStrength}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="0.1"
                            value={temp.windStrength ?? 0.5}
                            onChange={(e) => setTemp({ ...temp, windStrength: Number(e.target.value) })}
                            className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>0 (Êm dịu)</span>
                            <span>3 (Bão)</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t flex justify-between gap-3 dark:border-gray-700">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                        title="Khôi phục mặc định"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Mặc định</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => {
                                updateEffectSettings('leaves', temp)
                                onClose()
                            }}
                            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-green-200 dark:shadow-none"
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
