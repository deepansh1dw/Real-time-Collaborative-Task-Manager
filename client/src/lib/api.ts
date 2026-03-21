import axios from 'axios'
import type { CreateTaskInput, UpdateTaskInput, Task } from '../types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const res = await api.get('/tasks')
    return res.data
  },
  create: async (data: CreateTaskInput): Promise<Task> => {
    const res = await api.post('/tasks', data)
    return res.data
  },
  update: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    const res = await api.patch(`/tasks/${id}`, data)
    return res.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}

export const userApi = {
  getMe: async (): Promise<{ id: string }> => {
    const res = await api.get('/tasks/me')  // ← /tasks/me not /users/me
    return res.data
  },
}