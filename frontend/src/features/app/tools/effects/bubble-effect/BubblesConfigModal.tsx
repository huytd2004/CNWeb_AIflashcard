import { useState, useEffect } from 'react'
import { X, Check, Droplets } from 'lucide-react'
import { defaultSettings, useEffects, type BubblesSettings } from '../../context/EffectContext'

export default function BubblesConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { activeEffects, updateEffectSettings } = useEffects()
    const currentSettings = activeEffects.bubbles as BubblesSettings

    const [localSettings, setLocalSettings] = useState<BubblesSettings>(defaultSettings.bubbles as BubblesSettings)

    useEffect(() => {
        if (isOpen && currentSettings) {
            setLocalSettings({ ...currentSettings })
        }
    }, [isOpen, currentSettings])

    if (!isOpen) return null

    const handleApply = () => {
        updateEffectSettings('bubbles', localSettings)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Droplets className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Cấu hình Bong bóng</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hiệu ứng xà phòng bay</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Mật độ ({localSettings.count})</label>
                        <input
                            type="range"
                            min="10"
                            max="50"
                            step="5"
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

                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Kích thước</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['small', 'medium', 'large'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setLocalSettings({ ...localSettings, size: s })}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                        localSettings.size === s
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {s === 'small' ? 'Nhỏ' : s === 'medium' ? 'Vừa' : 'To'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Speed */}
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Tốc độ bay lên</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['slow', 'medium', 'fast'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setLocalSettings({ ...localSettings, speed: s })}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                        localSettings.speed === s
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-gray-200 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {s === 'slow' ? 'Lững lờ' : s === 'medium' ? 'Vừa' : 'Nhanh'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggle Pop */}
                    <div
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() =>
                            setLocalSettings({
                                ...localSettings,
                                popOnClick: !localSettings.popOnClick,
                            })
                        }
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Vỡ khi chạm</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Click chuột vào bong bóng để làm vỡ</span>
                        </div>
                        <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${localSettings.popOnClick ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                            <div
                                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out ${
                                    localSettings.popOnClick ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t flex gap-3 dark:border-gray-700">
                    <button
                        onClick={() => setLocalSettings(defaultSettings.bubbles as BubblesSettings)}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Mặc định
                    </button>
                    <button onClick={handleApply} className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                        <Check className="w-4 h-4" /> Áp dụng
                    </button>
                </div>
            </div>
        </div>
    )
}
