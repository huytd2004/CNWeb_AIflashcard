import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, ArrowRight, Camera, Save } from 'lucide-react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import Loading from '@/components/ui/loading'
import axios from 'axios'
import type { IUser } from '@/types/user'
import profileService from '@/services/profileService'
import { Link } from 'react-router-dom'
interface Props {
    isSettingsOpen: boolean
    setIsSettingsOpen: (open: boolean) => void
    user?: IUser | null // Optional user prop to reset tempProfile
}
export default function UpdateProfile({ isSettingsOpen, setIsSettingsOpen, user }: Props) {
    const [tempProfile, setTempProfile] = useState<IUser | null>(user || null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a PNG, JPG, or GIF file.')
            return
        }

        // Validate file size (3MB)
        const maxSize = 3 * 1024 * 1024 // 10MB in bytes
        if (file.size > maxSize) {
            alert('Kích thước tập tin phải nhỏ hơn 3MB.')
            return
        }
        setSelectedFile(file)
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileSelect(file)
            const reader = new FileReader()
            reader.readAsDataURL(file)
        }
    }
    const token = Cookies.get('token') || ''
    const handleSaveSettings = async () => {
        if (user?.displayName === tempProfile?.displayName && user?.profilePicture === tempProfile?.profilePicture) {
            setIsSettingsOpen(false)
        }
        try {
            setLoading(true)
            let imageUrl = user?.profilePicture
            if (selectedFile) {
                const formData = new FormData()

                formData.append('image', selectedFile)
                const uploadResponse = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                })
                imageUrl = uploadResponse?.data?.url
            }
            const res = await profileService.updateProfilePicture({ ...tempProfile, profilePicture: imageUrl })
            const data = await res?.json()
            if (res?.ok) {
                toast.success('Cập nhật thành công', {
                    position: 'top-center',
                    duration: 5000,
                    id: 'update-profile',
                })
                setIsSettingsOpen(false)
            } else {
                toast.error('Đã có lỗi xảy ra', {
                    description: data?.message,
                    position: 'top-center',
                    duration: 5000,
                    id: 'update-profile',
                })
            }
        } catch (error: any) {
            console.error('Error uploading image:', error)
            toast.error('Đã có lỗi xảy ra', {
                description: error.message,
                position: 'top-center',
                duration: 5000,
                id: 'upload-image',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
                <div className=" flex justify-end">
                    <Button className="dark:text-white" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Cập nhật
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cài đặt thông tin cá nhân</DialogTitle>
                    <DialogDescription>Cập nhật thông tin hồ sơ của bạn tại đây.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="space-y-4">
                        <Label>Ảnh đại diện</Label>
                        <div className="flex justify-center">
                            <Avatar className="w-20 h-20 relative group cursor-pointer">
                                <AvatarImage
                                    src={selectedFile ? URL.createObjectURL(selectedFile) : tempProfile?.profilePicture}
                                    alt="Preview"
                                    className="object-cover group-hover:brightness-75 transition-all duration-300"
                                />
                                <AvatarFallback>
                                    {tempProfile?.displayName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </AvatarFallback>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center" onClick={handleButtonClick}>
                                    <Camera />
                                </div>
                                <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.gif" onChange={handleFileChange} className="hidden" />
                            </Avatar>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên hiển thị</Label>
                        <Input
                            id="name"
                            required
                            value={tempProfile?.displayName}
                            onChange={(e) =>
                                setTempProfile(
                                    tempProfile
                                        ? {
                                              ...tempProfile,
                                              displayName: e.target.value,
                                          }
                                        : null
                                )
                            }
                        />
                    </div>

                    {/* Email (disabled) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={tempProfile?.email} disabled className="" />
                        <p className="text-sm text-gray-500 dark:text-white/60">Email không thể thay đổi</p>
                    </div>

                    {/* Password Link */}
                    <div className="pt-2">
                        <Link to="/update-password" className="">
                            <Button variant="secondary">
                                Thay đổi mật khẩu <ArrowRight />
                            </Button>
                        </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setTempProfile(user || null)
                                setSelectedFile(null)
                                setIsSettingsOpen(false)
                            }}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleSaveSettings} className="flex-1 text-white" disabled={loading}>
                            {loading ? <Loading /> : <Save />}
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
