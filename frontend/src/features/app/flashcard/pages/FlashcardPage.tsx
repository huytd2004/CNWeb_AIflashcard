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
            const search = param.get('search') || ''
            const res = await flashcardService.getListFlashcardPublic({ currentPage, itemsPerPage: pagination.itemsPerPage, language: language, search: search })
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

    // ✅ Handle search với URL update
    const handleSearchFC = (value: string) => {
        setSearchFC(value)
        setCurrentPage(1) // Reset về trang 1

        // Filter cho tab "my-sets" (flashcard của user)
        if (tabFlashcard === 'my-sets') {
            if (value.trim() === '') {
                setFilterDataUserFC(dataUserFC)
            } else {
                const filtered = dataUserFC.filter((item) => 
                    item.title.toLowerCase().includes(value.toLowerCase())
                )
                setFilterDataUserFC(filtered)
            }
        }

        // Cập nhật URL cho tab community
        if (tabFlashcard === 'community') {
            updateURL(tabFlashcard, 1, language, value)
        }
    }

    useEffect(() => {
        const tutorialFC = localStorage.getItem('tutorialFC')
        if (!tutorialFC) {
            setIsOpen(true)
        }
    }, [])

    return (
        <div className="my-8 w-full md:max-w-7xl mx-auto px-3 md:px-6 min-h-screen">
            <div className="space-y-8">
                {/* Header Section with Tutorial */}
                <div className="relative">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 text-transparent bg-clip-text">
                                Quản lý Flashcard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Tạo, quản lý và học tập với flashcard của bạn</p>
                        </div>
                        
                        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                            <AlertDialogTrigger asChild>
                                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Info className="w-5 h-5" />
                                    <span className="hidden md:inline ml-2">Hướng dẫn sử dụng</span>
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
                                    <AlertDialogAction className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white" onClick={handleClose}>
                                        <X /> Đóng
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Statistics Cards */}
                {user && summary && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 p-6 shadow-lg border border-teal-100 dark:border-teal-900/30">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-300/10 dark:bg-teal-600/5 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <CDataWordsFC summary={summary} />
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <Tabs defaultValue="my-sets" className="space-y-6" value={tabFlashcard} onValueChange={handleTabChange}>
                    {/* Tabs and Actions Bar */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <TabsList className="grid w-full lg:w-auto grid-cols-3 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl h-auto">
                                <TabsTrigger 
                                    value="my-sets" 
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg py-2.5 px-4 font-medium transition-all"
                                >
                                    <span className="hidden md:inline">Bộ flashcard của tôi</span>
                                    <span className="md:hidden">Của tôi</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="community" 
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg py-2.5 px-4 font-medium transition-all"
                                >
                                    <span className="hidden md:inline">Khám phá cộng đồng</span>
                                    <span className="md:hidden">Cộng đồng</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="success-fc" 
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg py-2.5 px-4 font-medium transition-all"
                                >
                                    <span className="hidden md:inline">Bộ thẻ đã học xong</span>
                                    <span className="md:hidden">Đã học xong</span>
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex items-center flex-col md:flex-row gap-3 lg:flex-1 lg:justify-end">
                                <div className="relative w-full md:w-auto md:min-w-[280px]">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input 
                                        placeholder="Tìm kiếm flashcard..." 
                                        className="pl-10 h-11 rounded-xl border-gray-300 dark:border-slate-600 focus-visible:ring-teal-500" 
                                        value={searchFC} 
                                        onChange={(e) => handleSearchFC(e.target.value)} 
                                    />
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
                                    <Button 
                                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white w-full md:w-auto h-11 px-6 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold" 
                                        disabled={user === null}
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        <span className="hidden lg:inline">{user === null ? 'Đăng nhập để tạo' : 'Tạo bộ flashcard mới'}</span>
                                        <span className="lg:hidden">Tạo mới</span>
                                    </Button>
                                </CreateFlashcardModal>
                            </div>
                        </div>
                    </div>
                    <TabsContent value="my-sets">
                        <div>
                            {user !== null ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                        {filterDataUserFC && filterDataUserFC.map((item) => <UserFC item={item} key={item._id} />)}
                                        {loading && (
                                            <div className="flex items-center justify-center col-span-full h-[500px]">
                                                <Loading className="h-12 w-12" />{' '}
                                            </div>
                                        )}
                                        {!loading && dataUserFC?.length === 0 && (
                                            <div className="h-[400px] col-span-full flex items-center justify-center">
                                                <div className="text-center space-y-4 max-w-md">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mx-auto">
                                                        <Plus className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chưa có flashcard nào</h3>
                                                    <p className="text-gray-600 dark:text-gray-400">Hãy tạo bộ flashcard đầu tiên để bắt đầu học tập!</p>
                                                    <Button 
                                                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg" 
                                                        onClick={() => setOpen(true)}
                                                    >
                                                        <Plus className="w-5 h-5 mr-2" />
                                                        Tạo bộ flashcard mới
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[400px] flex items-center justify-center">
                                    <div className="text-center space-y-4 max-w-md">
                                        <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mx-auto">
                                            <Users className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Cần đăng nhập</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Bạn cần đăng nhập để tạo và quản lý flashcard của riêng mình</p>
                                        <Button 
                                            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg" 
                                            onClick={() => setTabFlashcard('community')}
                                        >
                                            <Globe className="w-5 h-5 mr-2" />
                                            Khám phá cộng đồng
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="community">
                        <div className="space-y-6">
                            {/* Language Filter Section */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-slate-700">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <span className="font-semibold text-gray-800 dark:text-white">Lọc theo ngôn ngữ</span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        <Button 
                                            variant={language === 'all' ? 'default' : 'outline'} 
                                            size="sm" 
                                            className={`h-9 px-4 rounded-lg transition-all ${
                                                language === 'all' 
                                                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-md' 
                                                    : 'hover:border-teal-300 dark:hover:border-teal-700'
                                            }`}
                                            onClick={() => handleLanguageFilter('all')}
                                        >
                                            <Globe className="w-4 h-4 mr-1" /> 
                                            <span>Tất cả</span>
                                        </Button>
                                        {languages.map((lang) => (
                                            <Button
                                                key={lang.value}
                                                variant={language === lang.value ? 'default' : 'outline'}
                                                size="sm"
                                                className={`h-9 px-4 rounded-lg transition-all ${
                                                    language === lang.value 
                                                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-md' 
                                                        : 'hover:border-teal-300 dark:hover:border-teal-700'
                                                }`}
                                                onClick={() => handleLanguageFilter(lang.value)}
                                            >
                                                <span className="mr-1">{lang.flag}</span>
                                                <span className="hidden md:inline">{lang.language}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Flashcard Grid */}
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                                    {!loading && dataPublicFC && dataPublicFC.map((item) => <PublicFC item={item} key={item?._id} />)}

                                    {dataPublicFC && dataPublicFC?.length <= 0 && (
                                        <div className="h-[400px] col-span-full flex items-center justify-center">
                                            <div className="text-center space-y-4">
                                                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mx-auto">
                                                    <Search className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Không tìm thấy kết quả</h3>
                                                <p className="text-gray-600 dark:text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                            </div>
                                        </div>
                                    )}
                                    {loading && <LoadingGrid />}
                                </div>
                                <PaginationUI pagination={pagination} onPageChange={handlePageChange} />
                            </div>
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
