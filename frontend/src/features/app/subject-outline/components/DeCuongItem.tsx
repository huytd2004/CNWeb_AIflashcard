import AvatarCircle from '@/components/etc/AvatarCircle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import handleCompareDate from '@/lib/handleCompareDate'
import type { ISO } from '@/types/so'
import { Database, Download, Eye, FileDigit, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DeCuongItem({ item }: { item: ISO }) {
    const getFileTypeColor = (type: string) => {
        switch (type) {
            case 'pdf':
                return ' bg-red-100 text-red-700 dark:text-white dark:bg-red-500'
            case 'docx':
                return 'bg-blue-100 text-blue-700 dark:text-white dark:bg-blue-500 '
            case 'xlsx':
                return 'bg-green-100 text-green-700 dark:text-white dark:bg-green-500 '
            default:
                return 'bg-gray-100 text-gray-700 dark:text-white dark:bg-gray-500 '
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    return (
        <Card className="bg-white dark:bg-slate-800/50 transition-colors">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-slate-900 dark:text-white font-semibold text-lg line-clamp-1" title={item.title}>
                                {item.title}
                            </h3>
                            <Badge className={`${getFileTypeColor(item.type)}  text-xs px-2 py-1`}>
                                <FileText className="w-4 h-4  mr-1" />
                                {item.type.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-1" title={item.content}>
                            {item.content || 'Không có nội dung'}
                        </p>
                        <div className="flex items-center gap-2">
                            <AvatarCircle />
                            <span className="text-slate-400 text-sm">Chia sẻ bởi {item.user_id.displayName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-slate-500  dark:text-slate-400 text-sm">
                                {item.type === 'txt' ? (
                                    <>
                                        <div className="flex items-center gap-1">
                                            <FileDigit className="w-4 h-4" />
                                            <span>{item?.lenght} Câu hỏi</span>
                                        </div>
                                        <div className="flex items-center  gap-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{item.view}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-1">
                                            <Database className="w-4 h-4" />
                                            <span>{formatFileSize(item?.lenght)}</span>
                                        </div>
                                        <div className="flex items-center  gap-1">
                                            <Download className="w-4 h-4" />
                                            <span>{item.view}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-slate-400 text-sm">{handleCompareDate(item?.date)}</span>
                            {item.type === 'txt' ? (
                                <Link to={`/decuong/${item.slug}`}>
                                    <Button variant="outline" className="text-slate-600 dark:text-white px-4 py-2">
                                        <Eye />
                                        Xem
                                    </Button>
                                </Link>
                            ) : (
                                <Link to={item.link || ''} download>
                                    <Button variant="outline" disabled={!item.link} className="text-slate-600  dark:text-white px-4 py-2">
                                        <Download />
                                        {!item.link ? 'Không có link tải' : 'Tải về'}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
