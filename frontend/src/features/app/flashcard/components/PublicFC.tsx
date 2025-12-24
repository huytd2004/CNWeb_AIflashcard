import handleCompareDate from '@/lib/handleCompareDate'
import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
        english: '🇺🇸',
        chinese: '🇨🇳',
        japan: '🇯🇵',
        korea: '🇰🇷',
        vietnamese: '🇻🇳',
        germany: '🇩🇪',
        france: '🇫🇷',
    }
    return flags[lang] || '🌐'
}
export default function PublicFC({ item }: any) {
    return (
        <Link
            to={`/flashcard/${item?._id}`}
            className="relative group overflow-hidden w-full   bg-white/80  dark:bg-slate-800/50   border border-white/10 rounded-xl shadow-sm px-2 md:px-5 hover:shadow-md transition-all duration-300 flex justify-center flex-col gap-3 h-40"
        >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
            <div className="flex items-start justify-between mt-0">
                <div className="">
                    <h1 className="font-bold line-clamp-1 text-gray-900 dark:text-white/80 text-lg group-hover:text-blue-600 duration-300" title={item.title}>
                        {item.title}
                    </h1>

                    <p className="text-md line-clamp-1 text-gray-600 dark:text-white/60" title={item.desc}>
                        {item.desc || 'Không có mô tả'}
                    </p>
                </div>
                <div className="">{getLanguageFlag(item.language)}</div>
            </div>
            <div className="flex items-center justify-between">
                <span className="px-3 py-[0.4px] rounded-lg bg-purple-200/80 text-purple-700 font-medium text-sm">{item?.flashcards?.length} từ</span>
                {/* <span className="inline-flex gap-1 items-center text-gray-600 dark:text-white/60">
                    <Bookmark size={16} className="text-yellow-400 fill-current" />
                </span> */}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-[30px] h-[30px] overflow-hidden relative">
                        <img src={item?.userId?.profilePicture} alt="" className="rounded-full w-full h-full absolute object-cover brightness-95 group-hover:brightness-100 duration-300" />
                    </div>
                    <div className="flex-1">
                        <p title={item.userId.displayName} className="line-clamp-1 text-xs font-medium text-gray-600 dark:text-white/60">
                            {item.userId.displayName}
                        </p>
                        <div className="text-xs text-gray-600 dark:text-white/60 " title={new Date(item.created_at).toLocaleString()}>
                            <p className="line-clamp-1">{handleCompareDate(item?.created_at)}</p>
                        </div>
                    </div>
                </div>
                <div className="inline-flex gap-1 items-center text-gray-600 dark:text-white/60 text-xs">
                    <Users size={12} /> 0
                </div>
            </div>
        </Link>
    )
}
