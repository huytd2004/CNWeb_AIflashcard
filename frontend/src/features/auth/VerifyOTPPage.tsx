import React, { useEffect, useRef, useState } from 'react'

import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'
// import { toast } from 'sonner'
// import type authService from '@/services/authService'

export default function VerifyOTPPage() {
    const navigate = useNavigate()
    const [otp, setOtp] = useState(['', '', '', '', '', ''])

    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        } else {
            setCanResend(true)
        }
    }, [timer])

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto submit when all fields are filled
        if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === 6) {
            handleSubmit(newOtp.join(''))
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (otpCode?: string) => {
        const code = otpCode || otp.join('')
        if (code.length !== 6) return

        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            setIsSuccess(true)
        }, 2000)
    }

    const handleResend = () => {
        setTimer(60)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
    }

    // const fetchForgotPassword = async (values: any) => {
    //     setLoading(true)
    //     try {
    //         const res = await authService.forgotPassword({ email: values.email })
    //         const res = await POST_API('/auth/forget', { email: values.email }, 'POST', token)
    //         if (res) {
    //             const data = await res.json()
    //             if (res.ok) {
    //                 toast.success('Yêu cầu đặt lại mật khẩu thành công', {
    //                     description: 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu',
    //                     position: 'top-center',
    //                 })
    //                 setIsSuccess(true)
    //             } else if (res.status === 500) {
    //                 toast.info('Tính năng lấy lại mật khẩu bị đóng', {
    //                     description: 'Do chúng tôi chưa gia hạn refesh-token của google nên bị lỗi này, xin lỗi vì sự bất tiện này',
    //                     position: 'top-center',
    //                     duration: 7000,
    //                 })
    //             } else {
    //                 toast.warning(data.message, {
    //                     position: 'top-center',
    //                 })
    //             }
    //         }
    //     } catch (error) {
    //         toast.warning((error as Error).message)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleBackRouter = (e: any) => {
        e.preventDefault()
        navigate(-1)
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="">
                    <div className="bg-slate-800/80 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
                        {/* Success Icon */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-200" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Xác thực thành công!</h1>
                            <p className="text-gray-600 dark:text-gray-400 w-full md:w-[400px] mx-auto">Bạn đã đăng nhập thành công vào Quizzet. Chào mừng bạn trở lại!</p>
                        </div>

                        <Link to="/" className="block">
                            <Button className="w-full bg-primary hover:bg-primary/80 text-white">Về trang chủ</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="">
                <div className="dark:bg-slate-800/80 bg-white border dark:border-white/10 rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center space-x-4">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackRouter}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Link to="/">
                            <img alt="" width={150} height={150} src="/logo.png"></img>
                        </Link>
                    </div>
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-blue-500 dark:text-blue-200" />
                        </div>
                    </div>
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white/80">Kích hoạt tài khoản</h1>
                        <p className="text-gray-600 w-full md:w-[400px] mx-auto dark:text-gray-400">
                            Chúng tôi đã gửi mã xác thực 6 số đến email <span className="font-medium text-gray-900 dark:text-gray-200">trongandev@gmail.com</span>
                        </p>
                    </div>

                    {/* Email/Password Form */}
                    <div className="space-y-4">
                        {/* OTP Input */}
                        <div className="space-y-4">
                            <div className="flex justify-center space-x-3">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <Button onClick={() => handleSubmit()} disabled={otp.some((digit) => !digit) || loading} className="w-full h-11 bg-primary hover:bg-primary/80 text-white">
                                {loading ? 'Đang xác thực...' : 'Xác thực'}
                            </Button>
                        </div>

                        {/* Resend */}
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Không nhận được mã?</p>
                            {canResend ? (
                                <Button variant="ghost" onClick={handleResend} className="text-primary hover:text-primary/80">
                                    Gửi lại mã
                                </Button>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">Gửi lại sau {timer}s</p>
                            )}
                        </div>

                        {/* Help */}
                        <div className="bg-yellow-50 rounded-lg p-4 w-full md:w-[400px] mx-auto dark:bg-yellow-800/50">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Lưu ý:</strong> Mã xác thực có hiệu lực trong 5 phút. Kiểm tra thư mục spam nếu không thấy email.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Help */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Cần hỗ trợ? Liên hệ{' '}
                        <Link to="https://www.facebook.com/trongandev" target="_blank" className="text-primary hover:underline">
                            Đội ngũ hỗ trợ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
