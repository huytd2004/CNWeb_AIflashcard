import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowUpWideNarrow, History, ShipWheel, Waves } from 'lucide-react'
import handleCompareDate from '@/lib/handleCompareDate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
export default function HistoryViewModal({ history, isHistoryOpen, setIsHistoryOpen }: any) {
    // Calculate average quality
    const avg = Math.floor(history.reduce((acc: number, item: any) => acc + item.quality, 0) / history.length || 0)

    const handleCheck = () => {
        if (avg >= 4) {
            return (
                <span className="font-medium text-green-600 dark:text-green-400 ml-2 flex items-center gap-2">
                    <ArrowUpWideNarrow size={18} /> Có cải thiện
                </span>
            )
        } else if (avg <= 2) {
            return (
                <span className="font-medium text-red-600 dark:text-red-400 ml-2 flex items-center gap-2">
                    <ShipWheel size={18} /> Cần cải thiện
                </span>
            )
        } else {
            return (
                <span className="font-medium text-yellow-600 dark:text-yellow-400 ml-2 flex items-center gap-2">
                    <Waves size={18} /> Ổn định
                </span>
            )
        }
    }

    return (
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="w-8 h-8 text-blue-600" />
                        <div className="text-left">
                            <h1> Lịch sử học tập</h1>
                            <p className="dark:text-gray-400 text-sm">Theo dõi tiến trình học tập của từ vựng này</p>
                        </div>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto">
                    <div className="space-y-3">
                        {/* Sample history data */}
                        {history.map((item: any) => {
                            const getQualityInfo = (quality: number) => {
                                const qualityMap = {
                                    0: { text: 'Quên hoàn toàn', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: '😵' },
                                    1: { text: 'Rất khó nhớ', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: '😰' },
                                    2: { text: 'Khó nhớ', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400', icon: '😅' },
                                    3: { text: 'Bình thường', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: '😐' },
                                    4: { text: 'Dễ nhớ', color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400', icon: '😊' },
                                    5: { text: 'Hoàn hảo', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: '🤩' },
                                }
                                return qualityMap[quality as keyof typeof qualityMap] || qualityMap[0]
                            }

                            const qualityInfo = getQualityInfo(item.quality)
                            const date = new Date(item.date)
                            const isToday = date.toDateString() === new Date().toDateString()
                            const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString()

                            const getRelativeTime = () => {
                                if (isToday) return 'Hôm nay'
                                if (isYesterday) return 'Hôm qua'
                                return date.toLocaleDateString('vi-VN')
                            }

                            return (
                                <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{qualityInfo.icon}</div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className={`text-xs ${qualityInfo.color}`}>{item.quality}/5</Badge>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{qualityInfo.text}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 ">
                                                {getRelativeTime()} •{' '}
                                                {date.toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Quality stars */}
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <div key={star} className={`w-3 h-3 rounded-full ${star <= item.quality ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {history.length === 0 && <div className="text-center text-sm dark:text-gray-400 h-[100px] flex items-center justify-center">Bạn chưa có lịch sử học của từ này...</div>}
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-6 p-4 rounded-lg border border-white/10">
                        <h4 className=" text-blue-900 dark:text-blue-500 mb-3 font-semibold">Thống kê tổng quan</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="">Tổng số lần học:</span>
                                <span className="  ml-2">{history?.length} lần</span>
                            </div>
                            <div>
                                <span className="">Điểm trung bình:</span>
                                <span className="  ml-2">{avg}/5</span>
                            </div>
                            <div>
                                <span className="">Lần học gần nhất:</span>

                                {history && <span className="  ml-2">{handleCompareDate(history[history.length - 1]?.date)}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="">Xu hướng:</span>
                                {handleCheck()}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsHistoryOpen(false)}>
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
