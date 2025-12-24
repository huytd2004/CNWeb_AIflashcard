import { useCallback, useState } from 'react'
import { FaRegEye, FaRegQuestionCircle } from 'react-icons/fa'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Eye, Grid2X2, Grid3x3, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ISO } from '@/types/so'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AvatarCircle from '@/components/etc/AvatarCircle'
import handleCompareDate from '@/lib/handleCompareDate'
import { useNavigate } from 'react-router-dom'
import LoadingGrid from '@/components/etc/LoadingGrid'

interface Props {
    findText: ISO[]
    searchSO: string
    handleSearchSO: (value: string) => void
    loading?: boolean
}
export default function DeCuongTypeText({ findText, loading, searchSO, handleSearchSO }: Props) {
    const [toggleBtnSortNumber, setToggleBtnSortNumber] = useState(true)
    const [sortOrder, setSortOrder] = useState('asc') // "asc" or "desc"
    const [viewMode, setViewMode] = useState(4) // "grid 4x2" or "grid3x2"
    const [data, setData] = useState(findText)

    const navigate = useNavigate()

    const handleSortByNumber = useCallback(
        (key: keyof ISO, direction = 'asc') => {
            setToggleBtnSortNumber(!toggleBtnSortNumber)
            const sortedData = [...data].sort((a, b) => {
                if (direction === 'asc') return Number(a[key]) - Number(b[key])
                return Number(b[key]) - Number(a[key])
            })
            setData(sortedData)
        },
        [data]
    )

    return (
        <div className=" mt-5 flex flex-col gap-5  ">
            <div className="flex md:items-center gap-3 justify-between flex-col md:flex-row md:gap-10 ">
                <div className="flex-1 flex md:items-center gap-3 justify-between flex-col md:flex-row">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm tên câu hỏi mà bạn cần..."
                            value={searchSO}
                            onChange={(e) => handleSearchSO(e.target.value)}
                            className="pl-10 h-11 border-gray-400/50 dark:border-gray-600"
                        />
                    </div>
                    <div className="w-[0.4px] h-10 bg-gray-400/50 dark:bg-gray-600 hidden md:block"></div>
                    <div className="hidden md:flex items-center gap-2 justify-between md:justify-start">
                        <div className="flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}
                                        onClick={() => {
                                            setSortOrder('asc')
                                            handleSortByNumber('view', 'asc')
                                        }}
                                    >
                                        <ArrowUpNarrowWide className="w-4 h-4  " />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Sắp xếp theo số lượt làm tăng dần</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}
                                        onClick={() => {
                                            setSortOrder('desc')
                                            handleSortByNumber('view', 'desc')
                                        }}
                                    >
                                        <ArrowDownNarrowWide className="w-4 h-4  " />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Sắp xếp theo số lượt làm giảm dần</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="hidden md:flex items-center border border-gray-400/50 dark:border-white/10 rounded-s-md rounded-r-md overflow-hidden">
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            viewMode === 4 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}
                                        onClick={() => setViewMode(4)}
                                    >
                                        <Grid3x3 className="w-4 h-4  " />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Dạng lưới 4x2</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger>
                                    <div
                                        className={`h-11 w-10  flex items-center justify-center dark:hover:text-gray-300 cursor-pointer ${
                                            viewMode === 3 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}
                                        onClick={() => setViewMode(3)}
                                    >
                                        <Grid2X2 className="w-4 h-4  " />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Dạng lưới 3x2</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 ${viewMode === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} `}>
                {!loading &&
                    findText?.map((item: any, index: any) => (
                        <div
                            className="bg-white dark:bg-slate-800/50 hover:shadow-md rounded-xl h-[350px] md:h-[250px] flex flex-col md:flex-row overflow-hidden shadow-sm border border-white/10 group "
                            key={index}
                        >
                            <div className="relative overflow-hidden flex-1  h-full">
                                <img src={item.image} alt={item.title} className="object-cover absolute w-full h-full   hover:scale-105 transition-all duration-300" />
                                <div className="absolute z-1 bottom-0 bg-linear-item w-full text-white text-[10px] p-2 font-bold ">
                                    <p className="flex gap-1 items-center">
                                        <FaRegQuestionCircle />
                                        Số câu hỏi: {item.lenght}
                                    </p>
                                    <p className="flex gap-1 items-center">
                                        <FaRegEye />
                                        Lượt xem: {item.view}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between flex-col p-3 flex-1">
                                <h1 className="font-bold line-clamp-2 h-[48px]">{item.title}</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{item.content || 'Không có mô tả...'}</p>
                                <div className="">
                                    {item?.user_id && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <AvatarCircle user={item.user_id} className="w-8 h-8" />
                                            <div className="">
                                                <span className="text-slate-400 text-sm">{item.user_id.displayName}</span>
                                                <p className="text-xs text-gray-600 dark:text-gray-500">{handleCompareDate(item.date)}</p>
                                            </div>
                                        </div>
                                    )}

                                    <Button onClick={() => navigate(`/decuong/${item.slug}`)} variant="outline" className="w-full dark:text-white">
                                        <Eye /> Xem ngay
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                {!loading && findText.length === 0 && (
                    <div className="col-span-12 h-[500px] flex flex-col gap-3 items-center justify-center ">
                        <p className="dark:text-gray-400">Chưa có đề cương nào...</p>
                    </div>
                )}
                {loading && <LoadingGrid />}
            </div>
        </div>
    )
}
