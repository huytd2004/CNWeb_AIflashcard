import type { APIResponse } from '@/types/etc'
import axiosInstance from './axiosInstance'
import type { IUser } from '@/types/user'

class ProfileService {
    async getProfile() {
        const response = await axiosInstance.get<any>('/profile')
        return response.data
    }

    async getProfileAnything() {
        const response = await axiosInstance.get<any>('/profile/anything')
        return response.data
    }

    async getProfileById(userId: string) {
        const response = await axiosInstance.get<any>(`/profile/${userId}`)
        return response.data
    }

    async findProfileById(userId: string) {
        const response = await axiosInstance.get<any>(`/profile/find/${userId}`)
        return response.data
    }

    async updateProfile(userId: string, data: Partial<IUser>) {
        const response = await axiosInstance.patch<APIResponse<IUser>>(`/profile/${userId}`, data)
        return response.data.data
    }

    async updateProfilePicture(data: any) {
        const response = await axiosInstance.patch<any>(`/profile/`, data)
        return response.data.data
    }
}

export default new ProfileService()
