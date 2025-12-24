import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CheckCircle, Lock, Mail } from 'lucide-react'
import { Label } from '@/components/ui/label'
import Loading from '@/components/ui/loading'
import { toast } from 'sonner'
import authService from '@/services/authService'
import ChristmasLayout from '@/components/layout/ChristmasLayout'
import ReindeerCursor from '@/components/effects/ReindeerCursor'

export default function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        }),
        onSubmit: (values) => {
            fetchForgotPassword(values)
        },
    })

    const fetchForgotPassword = async (values: any) => {
        setLoading(true)
        try {
            const res = await authService.forgotPassword({ email: values.email })
            if (res) {
                toast.success('Yêu cầu đặt lại mật khẩu thành công', {
                    description: 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu',
                    position: 'top-center',
                })
                setIsEmailSent(true)
                formik.resetForm()
            }
        } catch (error) {
            toast.warning((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleBackRouter = (e: any) => {
        e.preventDefault()
        navigate(-1)
    }

    if (isEmailSent) {
        return (
            <ChristmasLayout title="Merry Christmas">
                    <form className="dark:bg-slate-800/95 bg-white/95 backdrop-blur-md border dark:border-white/10 border-red-200 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 w-full max-w-md" style={{ boxShadow: '0 0 30px rgba(255, 0, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.2)' }} onSubmit={formik.handleSubmit}>
                        {/* Success Icon */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-200" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Email đã được gửi!</h1>
                            <p className="text-gray-600 dark:text-gray-400">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.</p>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 dark:bg-blue-800/50 rounded-lg p-4 text-left space-y-2">
                            <h3 className="font-medium text-gray-900 dark:text-white/80">Bước tiếp theo:</h3>
                            <ul className="text-sm text-gray-600 space-y-1 dark:text-blue-400">
                                <li>• Kiểm tra hộp thư đến của bạn</li>
                                <li>• Tìm email từ My FlashCard</li>
                                <li>• Nhấp vào liên kết trong email</li>
                                <li>• Tạo mật khẩu mới</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full" onClick={() => setIsEmailSent(false)}>
                                Gửi lại email
                            </Button>

                            <Link to="/auth/login" className="block">
                                <Button className="w-full bg-primary hover:bg-primary/80 text-white">Quay lại đăng nhập</Button>
                            </Link>
                        </div>
                    </form>
            </ChristmasLayout>
        )
    }

    return (
        <>
        <ReindeerCursor />
        
        <ChristmasLayout title="Merry Christmas">
                <form className="dark:bg-slate-800/95 bg-white/95 backdrop-blur-md border dark:border-white/10 border-red-200 rounded-2xl shadow-2xl p-8 space-y-6 w-full max-w-md" style={{ boxShadow: '0 0 30px rgba(255, 0, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.2)' }} onSubmit={formik.handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center space-x-4">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackRouter}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Link to="/" className="qwigley-font text-5xl  text-primary font-medium ">
                            My FlashCard
                        </Link>
                        <span className="ml-2 text-2xl">🎅</span>
                    </div>
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 " />
                        </div>
                    </div>
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Quên mật khẩu?</h1>
                        <p className="text-gray-600 w-full md:w-[400px] mx-auto dark:text-gray-400">Không sao cả! Nhập email và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.</p>
                    </div>

                    {/* Email/Password Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nhập email đã đăng ký
                            </Label>
                            <Input id="email" type="email" placeholder="email@example.com" className="h-11" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 mt-1 mb-3 mx-5 text-sm">{formik.errors.email}</div> : null}
                        </div>

                        <Button className="relative group overflow-hidden w-full h-11 bg-primary  text-white hover:scale-105 transition-all duration-200" disabled={loading}>
                            {loading && <Loading />}
                            Gửi yêu cầu đặt lại mật khẩu
                            <Lock />
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/80  dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
                        </Button>

                        {/* Help Text */}
                        <div className="bg-gray-50 dark:bg-gray-700  rounded-lg p-4 w-full md:w-[400px] mx-auto">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Lưu ý:</strong> Nếu bạn không nhận được email trong vòng 5 phút, hãy kiểm tra thư mục spam hoặc thử lại.
                            </p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center text-sm space-y-2">
                        <div>
                            <span className="text-gray-600 dark:text-gray-400">Nhớ lại mật khẩu? </span>
                            <Link to="/auth/login" className="text-primary hover:underline font-medium">
                                Đăng nhập
                            </Link>
                        </div>
                        <div>
                            <span className="text-gray-600 dark:text-gray-400">Chưa có tài khoản? </span>
                            <Link to="/auth/register" className="text-primary hover:underline font-medium">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>
                </form>
        </ChristmasLayout>
        </>
    )

}
