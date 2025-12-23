import type { IUser } from '@/types/user'
import axiosInstance from './axiosInstance'

// Types for auth requests
export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterForm {
    displayName: string
    email: string
    password: string
    rePassword: string
    terms: boolean
}

export interface RegisterRequest {
    displayName: string
    email: string
    password: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ChangePasswordRequest {
    password: string
    confirmPassword: string
}

export interface RefreshTokenRequest {
    refreshToken: string
}

// Response types
export interface AuthResponse {
    user: IUser
    accessToken: string
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: string
}

class AuthService {
    // Login user
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', data)
        return response.data
    }

    // Register user
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>('/auth/register', data)
        return response.data
    }

    // Forgot password
    async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
        const response = await axiosInstance.post<{ message: string }>('/auth/forget-password', data)
        return response.data
    }

    // Change password (requires authentication)
    async changePassword(data: ChangePasswordRequest) {
        const response = await axiosInstance.post('/auth/update-password', data)
        return response.data
    }

    // Refresh token
    async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh-token', data)
        return response.data
    }

    // Logout user
    async logout(refreshToken: string): Promise<{ message: string }> {
        const response = await axiosInstance.post<{ message: string }>('/auth/logout', {
            refreshToken,
        })
        return response.data
    }

    // Get current user profile (requires authentication)
    async getProfile(): Promise<IUser> {
        const response = await axiosInstance.get<IUser>('/auth/profile')
        return response.data
    }
}

export default new AuthService()
