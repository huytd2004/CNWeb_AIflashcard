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
                                <div 
                                    onClick={() => handleRouter(item)} 
                                    key={index} 
                                    className={`p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center gap-3 cursor-pointer rounded-xl transition-all duration-200 mb-2 ${
                                        !item?.is_read ? 'bg-red-50/50 dark:bg-slate-800/50 border border-red-200 dark:border-red-900/30' : ''
                                    }`}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl shadow-lg flex-shrink-0">
                                        <IoCloseSharp size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">{item?.content}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md flex-shrink-0"></div>}
                                </div>
                            )
                        case 'approve':
                            return (
                                <div 
                                    onClick={() => handleRouter(item)} 
                                    key={index} 
                                    className={`p-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center gap-3 cursor-pointer rounded-xl transition-all duration-200 mb-2 ${
                                        !item?.is_read ? 'bg-green-50/50 dark:bg-slate-800/50 border border-green-200 dark:border-green-900/30' : ''
                                    }`}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg flex-shrink-0">
                                        <FaCheck size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">{item?.content}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md flex-shrink-0"></div>}
                                </div>
                            )
                        case 'system':
                            return (
                                <div 
                                    onClick={() => handleRouter(item)} 
                                    key={index} 
                                    className={`p-3 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center gap-3 cursor-pointer rounded-xl transition-all duration-200 mb-2 ${
                                        !item?.is_read ? 'bg-cyan-50/50 dark:bg-slate-800/50 border border-cyan-200 dark:border-cyan-900/30' : ''
                                    }`}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg flex-shrink-0">
                                        <GrSystem size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">{item?.content}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md flex-shrink-0"></div>}
                                </div>
                            )
                        case 'report':
                            return (
                                <div 
                                    onClick={() => handleRouter(item)} 
                                    key={index} 
                                    className={`p-3 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center gap-3 cursor-pointer rounded-xl transition-all duration-200 mb-2 ${
                                        !item?.is_read ? 'bg-yellow-50/50 dark:bg-slate-800/50 border border-yellow-200 dark:border-yellow-900/30' : ''
                                    }`}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl shadow-lg flex-shrink-0">
                                        <MdOutlineReport size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">{item?.content}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md flex-shrink-0"></div>}
                                </div>
                            )
                        default:
                            return (
                                <div 
                                    onClick={() => handleRouter(item)} 
                                    key={index} 
                                    className={`p-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 dark:hover:from-slate-800 dark:hover:to-slate-700 flex items-center gap-3 cursor-pointer rounded-xl transition-all duration-200 mb-2 ${
                                        !item?.is_read ? 'bg-teal-50/50 dark:bg-slate-800/50 border border-teal-200 dark:border-teal-900/30' : ''
                                    }`}
                                >
                                    <div className="w-12 h-12 relative flex-shrink-0">
                                        <img
                                            src={item?.sender?.profilePicture || '/avatar.png'}
                                            alt=""
                                            className="object-cover w-full h-full rounded-full ring-2 ring-white dark:ring-slate-700 shadow-md"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {item.type === 'comment' && (
                                            <div className="absolute z-10 -right-1 -bottom-1 w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-lg">
                                                <FaComment className="text-white text-xs" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
                                            <span className="font-bold text-teal-600 dark:text-teal-400">
                                                {item?.sender?.displayName}
                                            </span>{' '}
                                            {item?.content}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item?.created_at && handleCompareDate(item?.created_at)}</p>
                                    </div>
                                    {!item?.is_read && <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md flex-shrink-0"></div>}
                                </div>
                            )
                    }
                })
            ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center px-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mb-4">
                        <GrSystem className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Không có thông báo</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bạn chưa có thông báo mới nào</p>
                </div>
            )}
        </>
    )
}
