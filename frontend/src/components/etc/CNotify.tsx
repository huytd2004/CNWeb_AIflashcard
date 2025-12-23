import handleCompareDate from '@/lib/handleCompareDate'
import { FaCheck, FaComment } from 'react-icons/fa'
import { GrSystem } from 'react-icons/gr'
import { IoCloseSharp } from 'react-icons/io5'
import { MdOutlineReport } from 'react-icons/md'

export default function CNotify({ notify, handleRouter }: any) {
    return (
        <>
            {notify?.length > 0 ? (
                notify?.map((item: any, index: number) => {
                    switch (item.type) {
                        case 'reject':
                            return (
                                <div onClick={() => handleRouter(item)} key={index} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer rounded-lg h-20">
                                    <div className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-full">
                                        <IoCloseSharp size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs line-clamp-2">{item?.content}</p>
                                        <p className="dark:text-gray-400 text-gray-500 text-xs">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                </div>
                            )
                        case 'approve':
                            return (
                                <div onClick={() => handleRouter(item)} key={index} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer rounded-lg h-20">
                                    <div className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-full">
                                        <FaCheck size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs line-clamp-2">{item?.content}</p>
                                        <p className="dark:text-gray-400 text-gray-500 text-xs">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                </div>
                            )
                        case 'system':
                            return (
                                <div onClick={() => handleRouter(item)} key={index} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer rounded-lg h-20">
                                    <div className="w-12 h-12 flex items-center justify-center bg-cyan-500 text-white rounded-full">
                                        <GrSystem size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs line-clamp-2">{item?.content}</p>
                                        <p className="dark:text-gray-400 text-gray-500 text-xs">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                </div>
                            )
                        case 'report':
                            return (
                                <div onClick={() => handleRouter(item)} key={index} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer rounded-lg h-20">
                                    <div className="w-12 h-12 flex items-center justify-center bg-yellow-500 text-white rounded-full">
                                        <MdOutlineReport size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs line-clamp-2">{item?.content}</p>
                                        <p className="dark:text-gray-400 text-gray-500 text-xs">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                </div>
                            )
                        default:
                            return (
                                <div onClick={() => handleRouter(item)} key={index} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer rounded-lg h-20">
                                    <div className="w-12 h-12 relative">
                                        <img
                                            src={item?.sender?.profilePicture || '/avatar.png'}
                                            alt=""
                                            className="object-cover h-full absolute overflow-hidden rounded-full"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {item.type === 'comment' && <FaComment className="absolute z-1 right-0 bottom-0 text-primary" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs line-clamp-2">
                                            <label htmlFor="" className="font-bold">
                                                {item?.sender?.displayName}
                                            </label>{' '}
                                            {item?.content}
                                        </p>
                                        <p className="dark:text-gray-400 text-gray-500 text-xs">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                </div>
                            )
                    }
                })
            ) : (
                <div className="p-2">Không có thông báo...</div>
            )}
        </>
    )
}
