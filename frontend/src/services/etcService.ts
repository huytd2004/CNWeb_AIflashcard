import { convertBlobToBase64 } from '@/lib/utils'
import axios from 'axios'
import { toast } from 'sonner'
import axiosInstance from './axiosInstance'

class etcService {
    async getGamification() {
        const response = await axiosInstance.get<any>('/gamification')
        return response.data
    }
    async getTopGamification({ currentPage, itemsPerPage, user_id }: { currentPage?: number; itemsPerPage?: number; user_id?: string }) {
        const response = await axiosInstance.get<any>(`/gamification/top?page=${currentPage}&limit=${itemsPerPage}&user_id=${user_id}`)
        return response.data
    }
    async getTask() {
        const response = await axiosInstance.get<any>('/task')
        return response.data
    }
    async getHistoryUser() {
        const response = await axiosInstance.get<any>('/history')
        return response.data
    }

    async getHistoryDetail(id: string) {
        const response = await axiosInstance.get<any>(`/history/${id}`)
        return response.data
    }
    async markReadNotify(id: string) {
        const response = await axiosInstance.get<any>(`/notify/${id}`)
        return response.data
    }

    async findByName(input: string) {
        const response = await axiosInstance.get<any>(`/profile/findbyname/${input}`)
        return response.data
    }

    async getChatById(id: string) {
        const response = await axiosInstance.get<any>(`/chat/${id}`)
        return response.data
    }
    async createHistory(data: any) {
        const response = await axiosInstance.post<any>(`/history`, data)
        return response.data
    }
    async createAndCheckExitChat(data: any) {
        const response = await axiosInstance.post<any>(`/chat/create-chat`, data)
        return response.data
    }

    async createCommentQuiz(data: any) {
        const response = await axiosInstance.post<any>(`/quiz/comment`, data)
        return response.data
    }

    async createReportQuiz(data: any) {
        const response = await axiosInstance.post<any>(`/report`, data)
        return response.data
    }
    async uploadImage(data: any) {
        const response = await axiosInstance.post<any>(`/upload`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    }
    async convertEngToIPA(text: string) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_ENG_TO_IPA}/convert`, { text: text })
            return response.data
        } catch (error: any) {
            console.error('Failed to fetch categories:', error)
            toast.error(error.message)
            throw error
        }
    }

    async getAccurencyFromAudio(referenceText: string, audioBlob: Blob) {
        const res = await axios.post(
            `${import.meta.env.VITE_API_STS}/GetAccuracyFromRecordedAudio`,
            {
                title: referenceText,
                base64Audio: await convertBlobToBase64(audioBlob),
                language: 'en',
            },
            {
                headers: { 'X-Api-Key': import.meta.env.VITE_STS_KEY },
            }
        )
        return res.data
    }
}

export default new etcService()
