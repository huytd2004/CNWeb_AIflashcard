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
    async getSOAdmin({ currentPage, itemsPerPage, search, type }: { currentPage?: number; itemsPerPage?: number; search?: string; type?: string } = {}) {
        const params = new URLSearchParams()
        if (currentPage) params.set('page', String(currentPage))
        if (itemsPerPage) params.set('limit', String(itemsPerPage))
        if (search) params.set('search', search)
        if (type) params.set('type', type)
        const qs = params.toString()
        const response = await axiosInstance.get<any>(`/so/admin${qs ? `?${qs}` : ''}`)
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
    async updateSO(data: { id: string; title: string; image?: string; lenght?: number; quest?: any[]; so_id?: string; link?: string; type?: string }) {
        const response = await axiosInstance.patch<any>('/so', data)
        return response.data
    }
}

export default new SOService()
