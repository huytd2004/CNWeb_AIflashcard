import LoadingGrid from '@/components/etc/LoadingGrid'
import PaginationUI from '@/components/etc/PaginationUI'
import { Button } from '@/components/ui/button'
import flashcardService from '@/services/flashcardService'
import type { IPagination } from '@/types/etc'
import type { IListFlashcard } from '@/types/flashcard'
import { BookOpen, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicFC from './PublicFC'

export default function FlashcardHome() {
    const navigate = useNavigate()
    const [dataPublicFC, setDataPublicFC] = useState<IListFlashcard[]>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(() => {
        const mobile = window.innerWidth < 768
        return mobile ? 4 : 8
    })
    const [pagination, setPagination] = useState<IPagination>({ currentPage: 1, totalPages: 1, itemsPerPage: itemsPerPage, totalItems: 0, hasNextPage: false, hasPrevPage: false })

    console.log(itemsPerPage)
    useEffect(() => {
        const initData = async () => {
            setLoading(true)

            const param = new URLSearchParams(location.search)
            const language = param.get('language') || 'all'
            const res = await flashcardService.getListFlashcardPublic({ currentPage, itemsPerPage: itemsPerPage, language: language })
            setDataPublicFC(res.publicFlashcards || [])
            setPagination(res.pagination)

            setLoading(false)
        }
        initData()
    }, [currentPage, itemsPerPage])

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    return (
        <div>
            <div className="flex items-center gap-3 ">
                <div className="w-1/6 h-14 md:w-14  flex items-center justify-center bg-linear-to-r from-blue-500/80 to-purple-500/80 rounded-lg text-white">
                    <BookOpen className="h-8 w-8" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">Flashcard</h1>
                        <p>Tổng hợp những flashcard được chia sẻ từ cộng đồng</p>
                    </div>

                    <Button className="" variant="outline" onClick={() => navigate('/flashcard?tab=community&page=1')}>
                        <span className="hidden md:block"> Xem chi tiết</span> <ChevronRight />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mb-10 mt-5">
                {!loading && dataPublicFC && dataPublicFC.map((item) => <PublicFC item={item} key={item?._id} />)}

                {dataPublicFC && dataPublicFC?.length <= 0 && <div className="h-[350px] col-span-full flex items-center justify-center text-gray-700 dark:text-gray-300">Không có dữ liệu...</div>}
                {loading && <LoadingGrid />}
            </div>
            <PaginationUI pagination={pagination} onPageChange={handlePageChange} />
        </div>
    )
}
