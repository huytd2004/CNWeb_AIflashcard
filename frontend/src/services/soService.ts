import axiosInstance from './axiosInstance'

class SOService {
    async getPublicSO({ currentPage, itemsPerPage, search }: { currentPage?: number; itemsPerPage?: number; search?: string }) {
        //&search=${search}
        const response = await axiosInstance.get<any>(`/so?page=${currentPage}&limit=${itemsPerPage}&search=${search || ''}`)
        return response.data
    }
    async getSOByUser() {
        const response = await axiosInstance.get<any>('/so/user')
        return response.data
    }
    async getSOBySlug(slug: string) {
        const response = await axiosInstance.get<any>(`/so/${slug}`)
        return response.data
    }
    async getSOAdmin() {
        const response = await axiosInstance.get<any>('/so/admin')
        return response.data
    }
    async deleteSOAdmin(id: string) {
        const response = await axiosInstance.delete<any>('/so', { data: { id } })
        return response.data
    }
    async createSO(data: { title: string; content?: string; image?: string; type: string; link?: string; quest?: any[]; file_size?: number }) {
        const response = await axiosInstance.post<any>('/so', data)
        return response.data
    }
}

export default new SOService()
