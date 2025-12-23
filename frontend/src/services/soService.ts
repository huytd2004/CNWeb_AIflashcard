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
}

export default new SOService()
