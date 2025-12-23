import axiosInstance from './axiosInstance'

class EngExService {
    async getPublicEngEx({ currentPage, itemsPerPage }: { currentPage?: number; itemsPerPage?: number }) {
        //&search=${search}
        const response = await axiosInstance.get<any>(`/quiz?page=${currentPage}&limit=${itemsPerPage}`)
        return response.data
    }
    async createEnglishExam(data: any) {
        const response = await axiosInstance.post<any>('/english-exam', data)
        return response.data
    }
}

export default new EngExService()
