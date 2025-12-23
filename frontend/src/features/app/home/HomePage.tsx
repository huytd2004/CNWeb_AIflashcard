import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Check, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import IntroductExtension from './components/IntroductExtension'
import SubjectOutline from '../subject-outline/components/SubjectOutline'
import FlashcardHome from '../flashcard/components/FlashcardHome'

export default function HomePage() {
    const { user } = useAuth()

    const introductPage = [
        {
            title: 'Flashcard - Học hiệu quả với thẻ nhớ thông minh',
            image: '/intro/intro1.png',
            items: [
                'Tạo flashcard từ vựng đa ngôn ngữ nhanh chóng với sự trợ giúp của AI.',
                'AI tự động điền loại từ, ghi chú và ví dụ sinh động về cách sử dụng.',
                'Tăng cường khả năng ghi nhớ từ vựng với phương pháp học linh hoạt.',
            ],
        },
        {
            title: 'Ôn Tập Flashcard - Khắc Sâu Kiến Thức',
            image: '/intro/intro2.png',
            items: [
                'Cung cấp các tính năng ôn tập đa dạng để ghi nhớ từ vựng hiệu quả.',
                'Phát triển phản xạ nhanh với từ vựng trong các tình huống thực tế.',
                'Theo dõi tiến độ học tập và cải thiện dần khả năng ghi nhớ.',
            ],
        },
        {
            title: 'Chọn Giọng Nói - Cá Nhân Hóa Trải Nghiệm Học Tập',
            image: '/intro/intro3.png',
            items: [
                'Lựa chọn từ nhiều giọng nói khác nhau phù hợp với sở thích học tập.',
                'Cải thiện kỹ năng nghe thông qua các giọng nói đa dạng.',
                'Tạo ra môi trường học tập gần gũi và hấp dẫn hơn.',
            ],
        },
        // {
        //     title: 'Tài Liệu Đề Cương - Kho Tàng Tri Thức Từ Cộng Đồng',
        //     items: [
        //         'Truy cập nguồn tài liệu chuyên ngành phong phú từ cộng đồng.',
        //         'Công cụ hỗ trợ ghi nhớ câu hỏi và đáp án nhanh chóng.',
        //         'Nâng cao khả năng phản xạ trả lời câu hỏi trong các kỳ thi.',
        //     ],
        // },
    ]
    return (
        <div className=" my-5 md:my-10  dark:text-slate-300">
            <div className="space-y-20 w-full md:max-w-7xl mx-auto px-3 md:px-0">
                {/* {import.meta.env.VITE_MAINTAINANCE_MODE === 'true' && (
                    <div className=" font-medium text-center">
                        <h1 className="text-xl md:text-2xl xl:text-4xl">⚠️ Chào bạn, trang web chúng tôi đang bảo trì ⚠️</h1>
                        <p className="mt-5">Chúng tôi đang nỗ lực nâng cấp hệ thống để phục vụ bạn tốt hơn. Cảm ơn bạn đã kiên nhẫn chờ đợi!</p>
                        <p>Quá trình này có thể sẽ mất 2 3 ngày</p>
                        <p className="mt-2">
                            Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua email:{' '}
                            <a className="underline text-primary" href="mailto:trongandev@gmail.com">
                                trongandev@gmail.com
                            </a>
                        </p>
                        <p className="mt-2">
                            Hoặc facebook:{' '}
                            <a href="https://www.facebook.com/trongandev" className="underline text-primary">
                                trongandev
                            </a>
                        </p>
                    </div>
                )} */}
                <div className="">
                    <h1 className="text-2xl xl:text-4xl font-bold text-center bg-linear-to-br from-primary/80 to-purple-700/80 dark:from-primary dark:to-purple-500/80 text-transparent bg-clip-text">
                        Quizzet - Nền tảng học tập thông minh cho sinh viên
                    </h1>
                    <p className="mt-3 text-md md:text-lg text-center max-w-6xl mx-auto text-gray-600 dark:text-slate-300">
                        Quizzet là người bạn đồng hành đáng tin cậy trên hành trình học tập của bạn. Với sự hỗ trợ từ công nghệ AI tiên tiến, chúng tôi mang đến cho bạn một trải nghiệm học tập độc đáo
                        và hiệu quả hơn bao giờ hết. Khám phá ngay các tính năng nổi bật của Quizzet để tối ưu hóa quá trình học hỏi và phát triển kiến thức của bạn.
                    </p>
                    <div
                        style={{
                            position: 'relative',
                            paddingBottom: 'calc(50.520833333333336% + 41px)',
                            height: 0,
                            width: '100%',
                        }}
                    >
                        <iframe
                            src="https://demo.arcade.software/VEOX7fL248JaEgeFmRtK?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
                            title="Tạo bộ flashcard mới để học từ vựng"
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
                </div>
                <SubjectOutline isShowDetail={true} />
                <FlashcardHome />

                <div className="max-w-5xl mx-auto space-y-7">
                    {introductPage.map((section, index) => (
                        <div className="flex gap-5 md:gap-32  flex-col md:flex-row" key={index}>
                            <div className="flex-1">
                                <h2 className="text-2xl font-medium mb-5">{section.title}</h2>
                                <ul>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-center gap-2 mb-3 text-gray-700 dark:text-slate-300">
                                            <Check size={16} className="text-primary dark:text-blue-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="hidden md:flex bg-gray-300 dark:bg-gray-700 relative w-[400px] h-[350px] items-center justify-center rounded-md">
                                <div className="p-5">
                                    <img src={section.image} alt="" className="object-cover w-full h-full rounded-md" />
                                </div>
                                <div className={`absolute h-full w-20 -left-12 -z-10  ${index % 2 === 0 ? 'triangle-down-shape' : 'triangle-up-shape'}`}></div>
                            </div>
                            <img className="block md:hidden" src={section.image} alt="" />
                        </div>
                    ))}
                </div>
                <IntroductExtension />
            </div>
            {!user && (
                <div className="mt-20 h-72 bg-linear-to-br from-primary/80 to-purple-700/80  flex items-center justify-center flex-col gap-3 text-center md:text-left">
                    <h1 className=" text-2xl md:text-4xl text-white font-bold">Sẵn sàng bắt đầu hành trình học tập?</h1>
                    <p className="text-md md:text-lg text-white/80">Tham gia cộng đồng hơn 300 học viên đang học tập hiệu quả cùng Quizzet</p>
                    <div className="flex items-center gap-5">
                        <Link to="/login" className="block ">
                            <Button className=" h-12 text-xl bg-linear-to-r from-primary/80 to-purple-700/80 dark:text-gray-300">
                                <Zap className=" group-hover:text-yellow-200   rotate-0 group-hover:rotate-180 transition-all duration-300" /> Bắt đầu miễn phí
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
