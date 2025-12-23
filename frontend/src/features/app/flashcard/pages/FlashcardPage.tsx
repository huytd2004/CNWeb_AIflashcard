import flashcardService from '@/services/flashcardService'
import { useCallback, useEffect, useState } from 'react'
import { Globe, Info, Plus, Search, Users, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import CDataWordsFC from '../components/CDataWordsFC'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/ui/loading'
import UserFC from '../components/UserFC'
import { CreateFlashcardModal } from '../components/CreateFlashcardModal'
import { Input } from '@/components/ui/input'
import { languages } from '@/lib/languageOption'
import PublicFC from '../components/PublicFC'
import { type IListFlashcard } from '@/types/flashcard'
// import PaginationUI from '@/components/etc/PaginationUI'
import type { IPagination, ISummary } from '@/types/etc'
import PaginationUI from '@/components/etc/PaginationUI'
import ToastLogErrror from '@/components/etc/ToastLogErrror'
import LoadingGrid from '@/components/etc/LoadingGrid'

export default function FlashcardPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [language, setLanguage] = useState('all')
    const [searchFC, setSearchFC] = useState('')
    const [dataUserFC, setDataUserFC] = useState<IListFlashcard[]>([])
    const [filterDataUserFC, setFilterDataUserFC] = useState<IListFlashcard[]>([])
    const [dataPublicFC, setDataPublicFC] = useState<IListFlashcard[]>([])
    const [summary, setSummary] = useState<ISummary | null>(null)
    // const [successFC, setSuccessFC] = useState<IListFlashcard[]>([])
    const { user } = useAuth()
    const [tabFlashcard, setTabFlashcard] = useState('my-sets') // my-sets | community | success-fc
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    // const [itemsPerPage, setItemsPerPage] = useState(8)
    const [pagination, setPagination] = useState<IPagination>({ currentPage: 1, totalPages: 1, itemsPerPage: 8, totalItems: 0, hasNextPage: false, hasPrevPage: false })

    const [isOpen, setIsOpen] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const initData = async () => {
            setLoading(true)
            const sessionPublicFC = sessionStorage.getItem('publicFlashcards|')
            if (sessionPublicFC && JSON.parse(sessionPublicFC).length > 0) {
                setDataPublicFC(JSON.parse(sessionPublicFC))
            } else {
                const res = await flashcardService.getListFlashcardPublic({ currentPage, itemsPerPage: pagination.itemsPerPage })
                setDataPublicFC(res.publicFlashcards || [])
                setPagination(res.pagination)
                // sessionStorage.setItem('publicFlashcards', JSON.stringify(res.publicFlashcards || []))
            }

            if (user) {
                const res = await flashcardService.getListFlashcardUser()
                const summa = await flashcardService.getSummary()
                setSummary(summa)

                setDataUserFC(res)
                setFilterDataUserFC(res)
            }
            setLoading(false)
        }
        initData()
    }, [user])

    useEffect(() => {
        const fetchPublicFC = async () => {
            const param = new URLSearchParams(location.search)
            const language = param.get('language') || 'all'
            // const search = param.get('search') || ''
            const res = await flashcardService.getListFlashcardPublic({ currentPage, itemsPerPage: pagination.itemsPerPage, language: language })
            setDataPublicFC(res.publicFlashcards || [])
            setPagination(res.pagination)
        }
        try {
            setLoading(true)
            fetchPublicFC()
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }, [currentPage, location.search, pagination.itemsPerPage])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('tutorialFC', 'true') // Lưu trạng thái đã xem
    }

    const updateURL = useCallback(
        (tab: string, page: number, lang: string, search: string) => {
            if (tab !== 'community') {
                // ✅ Nếu không phải community tab, chỉ set tab
                const params = new URLSearchParams()
                params.set('tab', tab)
                navigate(`/flashcard?${params.toString()}`, { replace: true })
                return
            }
            const params = new URLSearchParams()
            params.set('tab', tab)
            params.set('page', page.toString())

            if (lang !== 'all') {
                params.set('language', lang)
            }
            if (search.trim()) {
                params.set('search', search)
            }

            navigate(`/flashcard?${params.toString()}`)
        },
        [navigate]
    )

    const handleTabChange = (newTab: string) => {
        setTabFlashcard(newTab)
        setCurrentPage(1) // Reset về trang 1 khi đổi tab
        updateURL(newTab, 1, language, searchFC)
    }

    // ✅ Handle page change với URL update
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        updateURL(tabFlashcard, newPage, language, searchFC)
    }

    // ✅ Sync với URL params khi component mount
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const urlTab = params.get('tab')
        const urlPage = params.get('page')
        const urlLanguage = params.get('language')
        const urlSearch = params.get('search')

        if (urlTab && urlTab !== tabFlashcard) {
            setTabFlashcard(urlTab)
        }

        if (urlPage) {
            const p = parseInt(urlPage, 10)
            if (!isNaN(p) && p !== currentPage) {
                setCurrentPage(p)
            }
        }

        if (urlLanguage && urlLanguage !== language) {
            setLanguage(urlLanguage)
        }

        if (urlSearch && urlSearch !== searchFC) {
            setSearchFC(urlSearch)
        }
    }, [])

    // useEffect(() => {
    //     if (tabFlashcard === 'community') {
    //         const filtered = filterData(language, searchFC) || []
    //         setFilterDataPublicFC(filtered)
    //     }
    // }, [language, searchFC, tabFlashcard, filterData])

    // // ✅ Handle language filter với URL update
    const handleLanguageFilter = (langCode: string) => {
        setLanguage(langCode)
        setCurrentPage(1) // Reset về trang 1
        // if (langCode === 'all') {
        //     setFilterDataPublicFC(dataPublicFC || [])
        // } else {
        //     const filtered = dataPublicFC?.filter((item) => item.language === langCode) || []
        //     setFilterDataPublicFC(filtered)
        // }
        updateURL(tabFlashcard, 1, langCode, searchFC)
    }

    // // ✅ Handle search với URL update
    const handleSearchFC = (value: string) => {
        setSearchFC(value)
        setCurrentPage(1) // Reset về trang 1

        // if (tabFlashcard === 'community') {
        //     const search = dataPublicFC?.filter((item) => item.title.toLowerCase().includes(value.toLowerCase())) || []
        //     setFilterDataUserFC(search)
        // } else {
        //     const search = dataUserFC.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
        //     setFilterDataPublicFC(search)
        // }

        // updateURL(tabFlashcard, 1, language, value)
    }

    useEffect(() => {
        const tutorialFC = localStorage.getItem('tutorialFC')
        if (!tutorialFC) {
            setIsOpen(true)
        }
    }, [])

    return (
        <div className="my-8 w-full md:max-w-7xl mx-auto px-3 md:px-0 min-h-screen">
            <div className="">
                <div className="flex flex-col gap-10">
                    <div className="relative">
                        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                            <AlertDialogTrigger>
                                <Button size="sm" className="dark:text-white absolute right-0 top-0 mt-2 mr-2" variant="secondary">
                                    <Info />
                                    <p className="hidden md:block"> Hướng dẫn</p>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-full md:max-w-7xl">
                                <div
                                    style={{
                                        position: 'relative',
                                        paddingBottom: 'calc(50.520833333333336% + 41px)',
                                        height: 0,
                                        width: '100%',
                                    }}
                                >
                                    <iframe
                                        src="https://demo.arcade.software/A449C0bQB21B0b7c2r6C?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
                                        title="Tạo bộ flashcard mới để học từ vựng"
                                        frameBorder="0"
                                        loading="lazy"
                                        allowFullScreen
                                        allow="clipboard-write"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            colorScheme: 'light',
                                        }}
                                    />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogAction className="text-white" onClick={handleClose}>
                                        <X /> Đóng
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    {/* Statistics Cards with Dynamic Layout */}
                    {user && summary && <CDataWordsFC summary={summary} />}
                </div>
                <Tabs defaultValue="my-sets" className="mt-8" value={tabFlashcard} onValueChange={handleTabChange}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-gray-100 dark:bg-slate-600">
                            <TabsTrigger value="my-sets" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                <span className="hidden md:block"> Bộ flashcard của tôi</span>
                                <span className="block md:hidden"> Của tôi</span>
                            </TabsTrigger>
                            <TabsTrigger value="community" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                <span className="hidden md:block">Khám phá cộng đồng</span>
                                <span className="block md:hidden"> Cộng đồng</span>
                            </TabsTrigger>
                            <TabsTrigger value="success-fc" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-primary">
                                <span className="hidden md:block"> Bộ thẻ đã học xong</span>
                                <span className="block md:hidden"> Đã học xong</span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center flex-col md:flex-row gap-3">
                            <div className="relative w-full ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input placeholder="Tìm kiếm flashcard..." className="pl-10 w-full md:w-64 " value={searchFC} onChange={(e) => handleSearchFC(e.target.value)} />
                            </div>
                            <CreateFlashcardModal
                                open={open}
                                setOpen={setOpen}
                                dataUserFC={dataUserFC}
                                setDataUserFC={setDataUserFC}
                                filterDataUserFC={filterDataUserFC}
                                setFilterDataUserFC={setFilterDataUserFC}
                                setTabFlashcard={setTabFlashcard}
                            >
                                <Button className="text-white w-full md:w-auto" disabled={user === null}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {user === null ? 'Đăng nhập để tạo bộ flashcard' : 'Tạo bộ flashcard mới'}
                                </Button>
                            </CreateFlashcardModal>
                        </div>
                    </div>
                    <TabsContent value="my-sets">
                        <div>
                            {user !== null ? (
                                <div className="mt-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3  mb-10">
                                        {filterDataUserFC && filterDataUserFC.map((item) => <UserFC item={item} key={item._id} />)}
                                        {loading && (
                                            <div className="flex items-center justify-center col-span-4 h-[500px]">
                                                <Loading className="h-12 w-12" />{' '}
                                            </div>
                                        )}
                                        {!loading && dataUserFC?.length === 0 && (
                                            <div className="h-[350px] col-span-12 flex items-center justify-center flex-col gap-3">
                                                <p className="dark:text-gray-400">Bạn chưa tạo bộ flashcard nào :(</p>
                                                <Button className="text-white" onClick={() => setOpen(true)}>
                                                    <Plus />
                                                    Tạo bộ flashcard mới thôi!
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {/* <PaginationUI currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} /> */}
                                </div>
                            ) : (
                                <div className=" text-gray-700 mt-10 dark:text-gray-300 h-[350px] flex flex-col gap-3 items-center justify-center">
                                    <p>Bạn cần đăng nhập để có thể thêm flashcard hoặc</p>
                                    <Button className="dark:text-white" onClick={() => setTabFlashcard('community')} variant="secondary">
                                        <Users className="h-4 w-4" /> Xem tab cộng đồng của chúng tôi
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="community">
                        <div className="flex items-center flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-700/80 rounded-lg shadow-sm border">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Globe className="w-5 h-5 " />
                                <span className="font-medium text-gray-700 dark:text-white/80">Lọc theo ngôn ngữ:</span>
                            </div>{' '}
                            <div className="flex flex-wrap gap-2">
                                <Button variant={language === 'all' ? 'default' : 'outline'} size="sm" className="h-8 dark:text-white " onClick={() => handleLanguageFilter('all')}>
                                    <Globe className="w-4 h-4" /> <span className="hidden md:block">Tất cả</span>
                                </Button>
                                {languages.map((lang) => (
                                    <Button
                                        key={lang.value}
                                        variant={language === lang.value ? 'default' : 'outline'}
                                        size="sm"
                                        className="h-8 dark:text-white"
                                        onClick={() => handleLanguageFilter(lang.value)}
                                    >
                                        <span>{lang.flag}</span>
                                        <span className="hidden md:block">{lang.language}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
                                {!loading && dataPublicFC && dataPublicFC.map((item) => <PublicFC item={item} key={item?._id} />)}

                                {dataPublicFC && dataPublicFC?.length <= 0 && (
                                    <div className="h-[350px] col-span-full flex items-center justify-center text-gray-700 dark:text-gray-300">Không có dữ liệu...</div>
                                )}
                                {loading && <LoadingGrid />}
                            </div>
                            <PaginationUI pagination={pagination} onPageChange={handlePageChange} />
                        </div>
                    </TabsContent>
                    <TabsContent value="success-fc">
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 ">
                            {successFC && successFC.map((item) => <UserFC item={item} key={item._id} />)}
                            {loading && (
                                <div className="flex items-center justify-center col-span-4 h-[500px]">
                                    <Loading className="h-12 w-12" />{' '}
                                </div>
                            )}
                            {user && !loading && successFC?.length === 0 && (
                                <div className="h-[350px] col-span-12 flex items-center justify-center flex-col gap-3">
                                    <p className="dark:text-gray-400">Bạn chưa hoàn thành bộ flashcard nào :(</p>
                                    <Button className="text-white" onClick={() => setTabFlashcard('my-sets')}>
                                        <Eye />
                                        Hãy học xong 1 bộ thẻ nhé, cố gắng lên nào!
                                    </Button>
                                </div>
                            )}
                        </div> */}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
