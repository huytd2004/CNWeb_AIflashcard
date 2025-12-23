import axiosInstance from './axiosInstance'
import type { IListFlashcard } from '@/types/flashcard'

class FlashcardService {
    async getListFlashcardPublic({ currentPage, itemsPerPage, language }: { currentPage?: number; itemsPerPage?: number; language?: string }) {
        //&search=${search}
        const response = await axiosInstance.get<any>(`/list-flashcards/public?page=${currentPage}&limit=${itemsPerPage}&language=${language}`)
        return response.data
    }

    async getListFlashcardUser(): Promise<IListFlashcard[]> {
        const response = await axiosInstance.get<any>('/list-flashcards')
        return response.data.listFlashCards
    }

    async getSummary() {
        const response = await axiosInstance.get<any>('/flashcard/summary')
        return response.data
    }

    async createListFlashcards(data: any) {
        const response = await axiosInstance.post<any>('/list-flashcards', data)
        return response.data
    }

    async getFlashcardPractice() {
        const response = await axiosInstance.get<any>(`/flashcards/practice`)
        return response.data
    }
    async getFlashcard(id: string) {
        const response = await axiosInstance.get<any>(`/flashcards/${id}`)
        return response.data
    }
    async createFlashcard(data: any) {
        const response = await axiosInstance.post<any>('/flashcards', data)
        return response.data
    }

    async updatedFlashcard(list_flashcard_id: string, data: any) {
        const response = await axiosInstance.put<any>(`/flashcards/${list_flashcard_id}`, data)
        return response.data
    }

    async createManyFlashcardsWithAI(data: any) {
        const response = await axiosInstance.post<any>('/flashcards/create-ai-list', data)
        return response.data
    }

    async createFlashcardWithAI(data: any) {
        const response = await axiosInstance.post<any>('/flashcards/create-ai', data)
        return response.data
    }

    async getFlashcardDetail(id_flashcard: string) {
        const response = await axiosInstance.get<any>(`/flashcards/${id_flashcard}`)
        return response.data
    }

    // async updateById(userId: string, data: Partial<IUser>) {
    //     const response = await axiosInstance.patch<IUser>(`/profile/${userId}`, data)
    //     return response.data.data
    // }

    async updatedListFlashcards(userId: string, data: any) {
        const response = await axiosInstance.patch<any>(`/list-flashcards/${userId}`, data)
        return response.data
    }

    async removeListFlashcards(userId: string) {
        const response = await axiosInstance.delete<any>(`/list-flashcards/${userId}`)
        return response.data
    }

    async deleteFlashcardFromList(flashcardId: string, list_flashcard_id: string) {
        const response = await axiosInstance.delete<any>(`/flashcards/${flashcardId}`, { data: { list_flashcard_id } })
        return response.data
    }

    async batchRateFlashcards(cards: any[]) {
        const response = await axiosInstance.put<any>(`/flashcards/batch-rate`, { cards })
        return response.data
    }
}

export default new FlashcardService()
