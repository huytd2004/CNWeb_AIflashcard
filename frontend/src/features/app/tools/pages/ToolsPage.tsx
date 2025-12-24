import { Wand2 } from 'lucide-react'
import ToolCategory from '../components/ToolCategory'
import { HyperText } from '../ui/hyper-text'

export default function ToolsPage() {
    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl min-h-screen">
            {/* --- HEADER --- */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Wand2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <span>
                            <HyperText duration={1500} delay={500}>
                                Kho công cụ & Hiệu ứng
                            </HyperText>
                        </span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Tùy chỉnh giao diện và trải nghiệm học tập của bạn với các hiệu ứng thú vị.</p>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="space-y-4">
                <ToolCategory category="websiteEffects" />
                <ToolCategory category="comingSoon" />
            </div>
        </div>
    )
}
