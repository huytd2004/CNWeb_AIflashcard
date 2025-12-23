import { useEffect, useState } from 'react'
import { FaRegCreditCard } from 'react-icons/fa'
import PublicFC from './PublicFC'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function PublicFCHome({ publicFlashcards }: any) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [isMobile, setIsMobile] = useState(false)

    const totalItems = publicFlashcards?.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = publicFlashcards?.slice(startIndex, endIndex)
    const displayFC = currentItems

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            setItemsPerPage(mobile ? 4 : 8)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1)
        }
    }

    // ✅ Mobile-friendly page numbers
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = isMobile ? 3 : 5 // Ít hơn trên mobile

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (isMobile) {
                // ✅ Logic đơn giản hơn cho mobile
                if (currentPage === 1) {
                    pages.push(1, 2, '...', totalPages)
                } else if (currentPage === totalPages) {
                    pages.push(1, '...', totalPages - 1, totalPages)
                } else {
                    pages.push(1, '...', currentPage, '...', totalPages)
                }
            } else {
                // Logic cũ cho desktop
                if (currentPage <= 3) {
                    for (let i = 1; i <= 4; i++) {
                        pages.push(i)
                    }
                    pages.push('...')
                    pages.push(totalPages)
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1)
                    pages.push('...')
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(i)
                    }
                } else {
                    pages.push(1)
                    pages.push('...')
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i)
                    }
                    pages.push('...')
                    pages.push(totalPages)
                }
            }
        }

        return pages
    }

    return (
        <div className="mt-10 mb-5 dark:text-white flex flex-col gap-5 ">
            <div className="flex items-center gap-3">
                <div className="w-1/6 h-14 md:w-14 flex items-center justify-center bg-linear-to-r from-pink-500/80 to-yellow-500/80 rounded-lg text-white">
                    <FaRegCreditCard size={21} />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Flashcard</h1>
                    <p>Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 h-[340px] overflow-y-scroll">
                {displayFC && displayFC.map((item: any) => <PublicFC item={item} key={item?._id} />)}
                {publicFlashcards?.length <= 0 && <div className="h-[340px] col-span-12 flex items-center justify-center text-gray-700">Không có dữ liệu...</div>}
            </div>

            {/* ✅ Responsive Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col gap-2">
                    <Pagination>
                        <PaginationContent className="flex-wrap gap-1">
                            {/* Previous Button */}
                            <PaginationItem>
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentPage === 1}
                                    className={cn(
                                        'gap-1 px-2 md:px-3',
                                        buttonVariants({
                                            variant: 'ghost',
                                            size: isMobile ? 'sm' : 'default',
                                        }),
                                        currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                                    )}
                                >
                                    <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                    <span className="sm:hidden">Prev</span>
                                </button>
                            </PaginationItem>

                            {/* Page Numbers */}
                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === '...' ? (
                                        <PaginationEllipsis className="h-6 w-6 md:h-8 md:w-8" />
                                    ) : (
                                        <button
                                            onClick={() => handlePageChange(page as number)}
                                            className={cn(
                                                buttonVariants({
                                                    variant: currentPage === page ? 'outline' : 'ghost',
                                                    size: isMobile ? 'sm' : 'default',
                                                }),
                                                'cursor-pointer min-w-[32px] md:min-w-[40px] h-8 md:h-10'
                                            )}
                                            aria-current={currentPage === page ? 'page' : undefined}
                                        >
                                            {page}
                                        </button>
                                    )}
                                </PaginationItem>
                            ))}

                            {/* Next Button */}
                            <PaginationItem>
                                <button
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className={cn(
                                        'gap-1 px-2 md:px-3',
                                        buttonVariants({
                                            variant: 'ghost',
                                            size: isMobile ? 'sm' : 'default',
                                        }),
                                        currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                                    )}
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <span className="sm:hidden">Next</span>
                                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                                </button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    {/* ✅ Responsive Pagination Info */}
                    <div className="flex justify-center">
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center">
                            {isMobile ? (
                                // Mobile: Text ngắn gọn
                                <span>
                                    {currentPage}/{totalPages} ({totalItems} items)
                                </span>
                            ) : (
                                // Desktop: Text đầy đủ
                                <span>
                                    Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} trên tổng {totalItems} Flashcard | Trang {currentPage} / {totalPages}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
