import axiosInstance from './axiosInstance'

export interface IToolUser {
    _id: string
    username: string
    password: string
    status: boolean
    role: string
    failed_login_attempts: number
    count_login: number
    note?: string
    active_date?: Date
    created_at: Date
}

export interface IToolHistory {
    _id: string
    username: string
    password: string
    header: any[]
    status: boolean
    count_login: number
    subject?: string
    message?: string
    created_at: Date
}

export interface CreateToolUserDto {
    username: string
    password: string
    note?: string
}

export interface UpdateToolUserDto {
    username?: string
    password?: string
    status?: boolean
    count_login?: number
    failed_login_attempts?: number
    note?: string
}

class ToolService {
    // Get all users
    async getUsers(): Promise<IToolUser[]> {
        const response = await axiosInstance.get<IToolUser[]>('/tool/user')
        return response.data
    }

    // Get all history
    async getHistory(): Promise<IToolHistory[]> {
        const response = await axiosInstance.get<IToolHistory[]>('/tool/history')
        return response.data
    }

    // Create new user
    async createUser(data: CreateToolUserDto): Promise<{ message: string }> {
        const response = await axiosInstance.post<{ message: string }>('/tool/user', data)
        return response.data
    }

    // Update user
    async updateUser(id: string, data: UpdateToolUserDto): Promise<{ message: string; ok: boolean }> {
        const response = await axiosInstance.patch<{ message: string; ok: boolean }>(`/tool/user/${id}`, data)
        return response.data
    }

    // Delete user
    async deleteUser(id: string): Promise<{ message: string }> {
        const response = await axiosInstance.delete<{ message: string }>('/tool/user', {
            data: { id }
        })
        return response.data
    }
}

export default new ToolService()
