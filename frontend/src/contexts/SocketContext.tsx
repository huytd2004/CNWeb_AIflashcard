import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

interface ProviderProps {
    children: ReactNode
}

// Tạo Context
interface SocketContextType {
    socket: Socket | null
    onlineUsers: any[]
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

// Provider Component
export const SocketProvider: React.FC<ProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [onlineUsers, setOnlineUsers] = useState<any[]>([])

    const { user } = useAuth()
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_SOCKET, {
            transports: ['websocket'],
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [user])

    useEffect(() => {
        if (socket === null) return
        socket.emit('newUser', user)
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res)
        })
        return () => {
            socket.off('getOnlineUsers')
        }
    }, [socket, user])

    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
}
// Hook để sử dụng socket dễ dàng
export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}
