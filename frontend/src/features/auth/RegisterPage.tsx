import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Loading from '@/components/ui/loading'
import { Checkbox } from '@/components/ui/checkbox'
import { Link, useNavigate } from 'react-router-dom'
import authService, { type RegisterForm, type RegisterRequest } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import ToastLogErrror from '@/components/etc/ToastLogErrror'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(false)
    const { login } = useAuth()
    const formik = useFormik<RegisterForm>({
        initialValues: {
            displayName: '',
            email: '',
            password: '',
            rePassword: '',
            terms: false,
        },
        validationSchema: Yup.object({
            displayName: Yup.string().required('Vui lòng nhập họ tên của bạn').min(2, 'Họ tên phải có ít nhất 2 ký tự').max(30, 'Họ tên không được vượt quá 30 ký tự'),
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
            password: Yup.string().required('Vui lòng nhập password').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
            rePassword: Yup.string()
                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
                .required('Vui lòng nhập lại mật khẩu'),
            terms: Yup.boolean().oneOf([true], 'Bạn cần đồng ý với điều khoản sử dụng'),
        }),
        onSubmit: (values) => {
            const profile = {
                displayName: values.displayName,
                email: values.email,
                password: values.password,
            }
            fetchRegister(profile)
        },
    })

    const fetchRegister = async (values: RegisterRequest) => {
        try {
            setLoading(true)
            const response = await authService.register(values)

            // Login successful - save to context
            login(response.user, response.accessToken, response.refreshToken)

            // Navigate to dashboard or home
            navigate('/')
        } catch (error) {
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
        <div className="min-h-screen flex items-center justify-center p-4 my-10">
            <div className="dark:bg-slate-800/80 bg-white border dark:border-white/10 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackRouter}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Link to="/" className="qwigley-font text-5xl  text-primary font-medium ">
                        Quizzet
                    </Link>
                </div>

                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Tạo tài khoản</h1>
                    <p className="text-gray-600 dark:text-gray-400">Tham gia Quizzet để khám phá thế giới kiến thức</p>
                </div>

                {/* Google Login - Highlighted */}
                <div className="space-y-4">
                    <Button
                        variant="outline"
                        onClick={handleLoginGoogle}
                        className="relative group overflow-hidden w-full h-12 bg-linear-to-r from-red-800/90 via-yellow-800/90 to-blue-800/90 text-white border-0 shadow-md transform hover:scale-105 transition-all duration-200 "
                    >
                        <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="" width={30} height={30} className="mr-3"></img>
                        Đăng ký bằng Google
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/80  dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
                    </Button>

                    <div className="text-center">
                        <span className="text-xs text-gray-500 bg-white px-3 dark:bg-slate-800/80 dark:text-gray-400">Tạo tài khoản trong 1 giây</span>
                    </div>
                </div>

                {/* Separator */}
                <div className="relative">
                    <Separator />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white px-4 text-sm text-gray-500 dark:bg-slate-800/80 dark:text-gray-400">Hoặc</span>
                    </div>
                </div>
                <form className="" onSubmit={formik.handleSubmit}>
                    {/* Email/Password Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Họ và tên
                            </Label>
                            <Input
                                id="displayName"
                                type="displayName"
                                placeholder="Nguyễn Văn A."
                                className="h-11"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.displayName}
                            />
                            {formik.touched.displayName && formik.errors.displayName ? <div className="text-red-500  mt-1 mb-3 mx-5 text-sm dark:text-red-400">{formik.errors.displayName}</div> : null}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </Label>
                            <Input id="email" type="email" placeholder="Nhập email của bạn..." className="h-11" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 dark:text-red-400 mt-1 mb-3 mx-5 text-sm">{formik.errors.email}</div> : null}
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
                            {formik.touched.password && formik.errors.password ? <div className="text-red-500 dark:text-red-400 mt-1 mb-3 mx-5 text-sm">{formik.errors.password}</div> : null}{' '}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rePassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nhập lại mật khẩu
                            </Label>
                            <Input
                                id="rePassword"
                                type="password"
                                placeholder="Nhập lại mật khẩu của bạn"
                                className="h-11"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.rePassword}
                            />
                            {formik.touched.rePassword && formik.errors.rePassword ? <div className="text-red-500 dark:text-red-400 mt-1 mb-3 mx-5 text-sm">{formik.errors.rePassword}</div> : null}
                        </div>
                        <div className="flex items-start space-x-2">
                            <Checkbox id="terms" className="mt-1" checked={formik.values.terms} onCheckedChange={(checked) => formik.setFieldValue('terms', checked)} />
                            <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Tôi đồng ý với{' '}
                                <Link to="/terms" className="text-primary hover:underline">
                                    Điều khoản sử dụng
                                </Link>{' '}
                                và{' '}
                                <Link to="/privacy" className="text-primary hover:underline">
                                    Chính sách bảo mật
                                </Link>
                            </Label>
                        </div>
                        {formik.touched.terms && formik.errors.terms ? <div className="text-red-500 dark:text-red-400 mt-1 mb-3 mx-5 text-sm">{formik.errors.terms}</div> : null}

                        <Button className="relative group overflow-hidden w-full h-11 bg-primary  text-white hover:scale-105 transition-all duration-200" disabled={loading}>
                            {loading && <Loading />}
                            Đăng ký
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/80  dark:via-white/10 to-transparent transition-all duration-500 -translate-x-full group-hover:translate-x-full"></div>
                        </Button>
                    </div>
                </form>

                {/* Footer Links */}
                <div className="flex justify-between items-center text-sm">
                    <Link to="/auth/login" className="text-primary hover:underline">
                        Đăng nhập
                    </Link>
                    <Link to="/auth/forgot-password" className="text-primary hover:underline">
                        Quên mật khẩu?
                    </Link>
                </div>

                {/* Additional CTA */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Đăng ký bằng Google để truy cập nhanh chóng và an toàn</p>
                </div>
            </div>
        </div>
    )
}
