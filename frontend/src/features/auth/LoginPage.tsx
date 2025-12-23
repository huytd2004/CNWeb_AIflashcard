import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Loading from '@/components/ui/loading'
// import ChangePassword from '@/components/ChangePassword'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import authService, { type LoginRequest } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import ToastLogErrror from '@/components/etc/ToastLogErrror'

export default function LoginPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(false)
    // const [isOpen, setIsOpen] = React.useState(false)
    const location = useLocation()

    const searchParams = new URLSearchParams(location.search)
    const redirectPath = searchParams.get('redirect') || '/'
    const { login, loginWithoutUser } = useAuth()

    const formik = useFormik<LoginRequest>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
            password: Yup.string().required('Vui lòng nhập password'),
        }),
        onSubmit: (values) => {
            fetchLogin(values)
        },
    })

    useEffect(() => {
        const accessToken = searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')

        const fetchLogin = async () => {
            if (accessToken && refreshToken) {
                await loginWithoutUser(accessToken, refreshToken)
                window.history.replaceState({}, document.title, window.location.pathname)
                navigate('/', { replace: true })
            }
        }
        fetchLogin()
    }, [])

    const fetchLogin = async (values: LoginRequest) => {
        try {
            setLoading(true)
            const response = await authService.login(values)

            // Login successful - save to context
            login(response.user, response.accessToken, response.refreshToken)

            // Navigate to dashboard or home
            navigate(redirectPath, { replace: true })
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }

    const handleBackRouter = (e: any) => {
        e.preventDefault()
        navigate(-1)
    }

    const handleLoginGoogle = async (e: any) => {
        e.preventDefault()
        if (loading) return // Prevent multiple clicks
        window.location.href = import.meta.env.VITE_API_ENDPOINT + '/auth/google'
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="dark:bg-slate-800/80 bg-white border dark:border-white/10 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
                {/* Header */}
                {/* <ChangePassword isOpen={isOpen} setIsOpen={setIsOpen} /> */}
                <div className="flex items-center">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackRouter}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Link to="/" className="qwigley-font text-5xl  text-primary font-medium ">
                        Quizzet
                    </Link>
                </div>

                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Đăng nhập</h1>
                    <p className="text-gray-600 dark:text-gray-400">Đăng nhập để trải nghiệm Quizzet tốt hơn nhé</p>
                </div>

                {/* Google Login - Highlighted */}
                <div className="space-y-4">
                    <Button
                        variant="outline"
                        onClick={handleLoginGoogle}
                        className="relative group overflow-hidden w-full h-12 bg-linear-to-r from-red-800/90 via-yellow-800/90 to-blue-800/90 text-white border-0 shadow-md transform hover:scale-105 transition-all duration-200 "
                    >
                        <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="" width={30} height={30} className="mr-3"></img>
                        Đăng nhập bằng Google
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/80  dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
                    </Button>

                    <div className="text-center">
                        <span className="text-xs text-gray-500 bg-white px-3 dark:bg-[#1e2737] dark:text-gray-400">Nhanh chóng & Bảo mật</span>
                    </div>
                </div>

                {/* Separator */}
                <div className="relative">
                    <Separator />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white px-4 text-sm text-gray-500 dark:bg-[#1e2737] dark:text-gray-400">Hoặc</span>
                    </div>
                </div>
                <form className="" onSubmit={formik.handleSubmit}>
                    {/* Email/Password Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </Label>
                            <Input id="email" type="email" placeholder="Nhập email của bạn..." className="h-11" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 mt-1 mb-3 mx-5 text-sm">{formik.errors.email}</div> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mật khẩu
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Nhập mật khẩu của bạn"
                                className="h-11"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                        </div>

                        <Button type="submit" className="relative group overflow-hidden w-full h-11 bg-primary  text-white hover:scale-105 transition-all duration-200" disabled={loading}>
                            {loading && <Loading />}
                            Đăng nhập
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/80  dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
                        </Button>
                    </div>
                </form>
                {/* Footer Links */}
                <div className="flex justify-between items-center text-sm">
                    <Link to="/auth/register" className="text-primary hover:underline">
                        Đăng ký
                    </Link>
                    <Link to="/auth/forgot-password" className="text-primary hover:underline">
                        Quên mật khẩu?
                    </Link>
                </div>

                {/* Additional CTA */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Đăng nhập bằng Google để truy cập nhanh chóng và an toàn</p>
                </div>
            </div>
        </div>
    )
}
