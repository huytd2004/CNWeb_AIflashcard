import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronRight, Users } from 'lucide-react'
import type { ISO } from '@/types/so'
import soService from '@/services/soService'

import ToastLogErrror from '@/components/etc/ToastLogErrror'
import type { IPagination } from '@/types/etc'
import DeCuongTypeText from '@/features/app/subject-outline/components/DeCuongTypeText'
import PaginationUI from '@/components/etc/PaginationUI'
import { debounce } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function SubjectOutline({ isShowDetail = false }: { isShowDetail?: boolean }) {
    const [loading, setLoading] = useState(false)

    const [SOPublic, setSOPublic] = useState<ISO[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    const [pagination, setPagination] = useState<IPagination>({ currentPage: 1, totalPages: 1, itemsPerPage: 8, totalItems: 0, hasNextPage: false, hasPrevPage: false })
    const [searchSO, setSearchSO] = useState<string>('')
    const navigate = useNavigate()
    const [itemsPerPage] = useState(() => {
        const mobile = window.innerWidth < 768
        return mobile ? 4 : 8
    })
    const searchRef = useRef<string>('')
    const fetchSOUser = useCallback(async () => {
        try {
            setLoading(true)
            const resSOPublic = await soService.getPublicSO({ currentPage: currentPage, itemsPerPage: itemsPerPage, search: searchRef.current })
            console.log(resSOPublic)
            if (resSOPublic.ok) {
                setSOPublic(resSOPublic.publicSO)
                setPagination(resSOPublic.pagination)
            }
        } catch (error) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }, [currentPage, itemsPerPage])

    useEffect(() => {
        fetchSOUser()
    }, [fetchSOUser])

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }
    const debouncedSearch = useCallback(debounce(fetchSOUser, 500), [])

    const handleSearchSO = (value: string) => {
        setSearchSO(value)
        searchRef.current = value
        debouncedSearch(value)
    }
    return (
        <div>
            <div className="flex items-center gap-3 ">
                <div className="w-1/6 h-14 md:w-14  flex items-center justify-center bg-linear-to-r from-blue-500/80 to-purple-500/80 rounded-lg text-white">
                    <Users className="h-8 w-8" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">Đề cương</h1>
                        <p>Tổng hợp những đề cương được upload từ cộng đồng Quizzet</p>
                    </div>
                    {isShowDetail && (
                        <Button className="" variant="outline" onClick={() => navigate('/decuong')}>
                            <span className="hidden md:block"> Xem chi tiết</span> <ChevronRight />
                        </Button>
                    )}
                </div>
            </div>

            <DeCuongTypeText findText={SOPublic} searchSO={searchSO} loading={loading} handleSearchSO={handleSearchSO} />
            <div className="mt-10"></div>
            <PaginationUI pagination={pagination} onPageChange={handlePageChange} />
        </div>
    )
}
