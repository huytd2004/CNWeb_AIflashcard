import axiosInstance from './axiosInstance'

class ChatComService {
    async getPublicChat({ currentPage, itemsPerPage }: { currentPage?: number; itemsPerPage?: number }) {
        //&search=${search}
        const response = await axiosInstance.get<any>(`/chatcommu?page=${currentPage}&limit=${itemsPerPage}`)
        return response.data
    }
    async getChatByUser() {
        const response = await axiosInstance.get<any>('/chatcommu/getquizbyuser')
        return response.data
    }
}

export default new ChatComService()
