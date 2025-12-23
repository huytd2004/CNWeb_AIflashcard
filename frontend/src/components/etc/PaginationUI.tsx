import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination'
import { Button } from '../ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { IPagination } from '@/types/etc'

type PaginationUIProps = {
    pagination: IPagination
    onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number) {
    const pages: (number | '...')[] = []
    if (total <= 1) return [1]
    if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, 4, '...', total)
        } else if (current >= total - 2) {
            pages.push(1, '...', total - 3, total - 2, total - 1, total)
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total)
        }
    }
    return pages
}
export default function PaginationUI({ pagination, onPageChange }: PaginationUIProps) {
    const { currentPage, totalPages } = pagination
    const total = Math.max(1, Math.floor(totalPages) || 1)
    const pages = getPageNumbers(Math.min(currentPage, total), total)

    return (
        <div className="">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <Button variant={'outline'} disabled={currentPage == 1} onClick={() => onPageChange(currentPage - 1)}>
                            <ChevronLeftIcon />
                            <span className="hidden sm:block">Quay về</span>
                        </Button>
                    </PaginationItem>
                    {pages.map((page, idx) =>
                        page === '...' ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={`page-${page}-${idx}`}>
                                <Button
                                    variant={currentPage == page ? 'outline' : 'ghost'}
                                    disabled={page == currentPage}
                                    onClick={() => {
                                        if (page !== currentPage) onPageChange(Number(page))
                                    }}
                                >
                                    {page}
                                </Button>
                            </PaginationItem>
                        )
                    )}
                    <PaginationItem>
                        <Button variant={'outline'} disabled={currentPage >= total} onClick={() => onPageChange(currentPage + 1)}>
                            <span className="hidden sm:block">Tiến tới</span>
                            <ChevronRightIcon className="" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <div className="text-xs text-gray-600 text-center mt-4">
                Trang {currentPage} / {total}
            </div>
        </div>
    )
}
