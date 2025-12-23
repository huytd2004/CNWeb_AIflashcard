import axiosInstance from './axiosInstance'

class QuizService {
    async getPublicQuizzes({ currentPage, itemsPerPage }: { currentPage?: number; itemsPerPage?: number }) {
        //&search=${search}
        const response = await axiosInstance.get<any>(`/quiz?page=${currentPage}&limit=${itemsPerPage}`)
        return response.data
    }
    async getQuizByUser() {
        const response = await axiosInstance.get<any>('/quiz/getquizbyuser')
        return response.data
    }

    async getQuizBySlug(slug: string) {
        const response = await axiosInstance.get<any>(`/quiz/${slug}`)
        return response.data
    }

    async updateContentQuiz(slug: string, data: any) {
        const response = await axiosInstance.patch<any>(`/quiz/update/${slug}`, data)
        return response.data
    }

    async createQuiz(data: any) {
        const response = await axiosInstance.post<any>(`/quiz`, data)
        return response.data
    }
}

export default new QuizService()
