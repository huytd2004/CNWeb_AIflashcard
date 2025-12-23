import { FaFileAlt, FaRegCreditCard } from 'react-icons/fa'
import { SiQuizlet } from 'react-icons/si'
import { FaPeopleGroup } from 'react-icons/fa6'
import { Book, Bug, Github, MessageCircleQuestionMark, Scroll } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function CFooter() {
    return (
        <footer className="bg-white  border-t border-gray-200 dark:border-white/10 dark:bg-gray-900 text-slate-800 dark:text-white  py-12 pb-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h1 className="text-4xl font-medium qwigley-font text-primary ">Quizzet</h1>
                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">Nền tảng học tập thông minh giúp bạn phát triển kiến thức một cách hiệu quả và bền vững.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 col-span-3">
                        <div>
                            <h3 className="font-medium mb-4">Sản phẩm</h3>
                            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                                <li>
                                    <Link to="/flashcard" className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <FaRegCreditCard />
                                        Flashcard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/quiz" className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <SiQuizlet /> Quiz
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/decuong" className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <FaFileAlt />
                                        Đề cương
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/congdong" className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <FaPeopleGroup />
                                        Cộng đồng
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Hỗ trợ</h3>
                            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                                <li>
                                    <Link to="/help-center" target="_blank" className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <MessageCircleQuestionMark size={18} />
                                        Trung tâm trợ giúp
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/baoloi" className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <Bug size={18} />
                                        Báo lỗi
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gopy" className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <Scroll size={18} /> Góp ý
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Liên hệ</h3>
                            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                                <li>
                                    <Link
                                        to="https://www.facebook.com/trongandev"
                                        target="_blank"
                                        className="hover:text-gray-800 dark:hover:text-white transition-colors inline-flex gap-2 items-center"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fab"
                                            data-icon="facebook"
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 320 512"
                                            className="size-4"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M279.14 288l14.22-92.66h-88.91V141.09c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.26 0 225.36 0c-73.22 0-121.36 44.38-121.36 124.72V195.3H22.89V288h81.11v224h100.2V288z"
                                            ></path>
                                        </svg>{' '}
                                        Facebook
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://github.com/trongandev" target="_blank" className="hover:text-gray-800 dark:hover:text-white transition-colors inline-flex gap-2 items-center">
                                        <Github size={16} /> Github
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://discord.gg/Uy7Kvyy9FC" target="_blank" className="hover:text-gray-800 dark:hover:text-white transition-colors inline-flex gap-2 items-center">
                                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="size-4">
                                            <title>Discord</title>
                                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                                        </svg>{' '}
                                        Cộng đồng Discord
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" target="_blank" className=" inline-flex gap-2 items-center hover:text-gray-800 dark:hover:text-white transition-colors">
                                        <Book size={16} />
                                        Về chúng tôi
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-400/50 dark:border-gray-800 mt-5 pt-5 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; 2025 Quizzet. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
