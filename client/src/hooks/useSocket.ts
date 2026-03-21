import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '../lib/socket'


export function useSocket(userId: string | undefined) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) return

    const socket = getSocket()

    // Join personal room
    socket.emit('join', userId)

    // Listen for real-time events
    socket.on('task:assigned', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })

    socket.on('task:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })

    socket.on('task:deleted', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })

    return () => {
      socket.off('task:assigned')
      socket.off('task:updated')
      socket.off('task:deleted')
    }
  }, [userId, queryClient])
}