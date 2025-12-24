import { CiTimer } from 'react-icons/ci'
import { IoArrowForwardCircleOutline } from 'react-icons/io5'
import { FaRegEye } from 'react-icons/fa'
import type { IQuiz } from '@/types/etc'
import { Link } from 'react-router-dom'
import handleCompareDate from '@/lib/handleCompareDate'
import { Button } from '@/components/ui/button'

export default function QuizItem({ item }: { item: IQuiz }) {
    return (
        <div key={item._id} className="group hover:shadow-md transition-all duration-300  rounded-xl border border-white/10 shadow-md h-[400px]">
            <div className="overflow-hidden relative h-full rounded-xl">
                <Link className="block" to={`/quiz/detail/${item.slug}`}>
                    <img src={item.img} alt={item.title} className="absolute h-full w-full object-cover group-hover:scale-105 duration-300  brightness-90" />
                </Link>
                <div className="p-3 absolute z-1 text-white bottom-0 w-full bg-linear-item">
                    <h1 className="text-lg font-bold line-clamp-2 ">{item.title}</h1>
                    <p className="line-clamp-2 text-sm text-[#D9D9D9]">{item.content}</p>
                    <div className="flex justify-end items-center gap-1 mb-px text-[10px]">
                        <FaRegEye />
                        <p className="">Lượt làm: {item.noa}</p>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                        <Link to={`/profile/${item.uid._id}`} className="flex items-center gap-2">
                            <div className="relative w-10 h-10 md:w-[35px] md:h-[35px] rounded-full overflow-hidden">
                                <img src={item.uid.profilePicture} alt={item.uid.displayName} className="absolute object-cover h-full" />
                            </div>
                            <div className="">
                                <div className="flex items-center gap-1">
                                    <h2 className="text-sm line-clamp-1 w-[100px] overflow-hidden">{item.uid.displayName}</h2>
                                </div>
                                <p className="text-[#D9D9D9] text-[10px] flex gap-1 items-center">
                                    <CiTimer color="#D9D9D9" /> {handleCompareDate(item.date)}
                                </p>
                            </div>
                        </Link>

                        <Link to={`/quiz/${item.slug}`} className="">
                            <Button className="text-white">
                                Làm bài <IoArrowForwardCircleOutline />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
