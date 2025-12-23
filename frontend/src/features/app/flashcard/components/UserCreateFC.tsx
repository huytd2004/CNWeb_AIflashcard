import handleCompareDate from '@/lib/handleCompareDate'
import { IoCopyOutline } from 'react-icons/io5'
import { MdPublic } from 'react-icons/md'
import { RiGitRepositoryPrivateFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'

export default function UserCreateFC({ item }: any) {
    return (
        <Link
            to={`/flashcard/${item?._id}`}
            className="relative group overflow-hidden w-full h-[181px] bg-gray-200/80 dark:bg-slate-800/50 rounded-xl block shadow-sm p-3 border-white/10 border hover:shadow-md transition-all duration-300"
            key={item._id}
        >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
            <h1 className="font-bold line-clamp-1" title={item.title}>
                {item.title}
            </h1>
            <h1 className="flex items-center gap-1">
                <IoCopyOutline />
                {item?.flashcards?.length} từ
            </h1>
            <p className="text-sm line-clamp-2 italic h-[40px]" title={item.desc}>
                {item.desc || 'Không có mô tả'}
            </p>
            <div className="flex gap-2 items-center">
                <p className="text-sm line-clamp-2 italic">Ngôn ngữ: </p>
                <img src={`/flag/${item.language}.svg`} alt="" width={25} height={15} className="rounded-sm border border-gray-400"></img>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-[40px] h-[40px] overflow-hidden relative">
                    <img src={item?.userId?.profilePicture} alt="" className="rounded-full w-full h-full absolute object-cover" />
                </div>
                <div className="">
                    <p title={item.userId.displayName} className="line-clamp-1">
                        {item.userId.displayName}
                    </p>
                    <div className="flex gap-1 items-center text-xs text-gray-500 " title={new Date(item.created_at).toLocaleString()}>
                        {item.public ? <MdPublic /> : <RiGitRepositoryPrivateFill />}
                        <p className="line-clamp-1">{handleCompareDate(item?.created_at)}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
