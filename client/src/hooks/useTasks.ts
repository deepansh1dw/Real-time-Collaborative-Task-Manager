import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi, userApi } from '../lib/api'
import type { CreateTaskInput, UpdateTaskInput } from '../types'
import toast from 'react-hot-toast'

export function useTasks(enabled = true) {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
    enabled,
    retry: false,
  })
}

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
    enabled,
    //retry: false,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskApi.create(data),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (newTask.pendingAssigneeEmail) {
        toast.success(`Task created — ${newTask.pendingAssigneeEmail} will be notified when they join!`)
      } else {
        toast.success('Task created successfully!')
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to create task')
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      taskApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task updated!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to update task')
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task deleted!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to delete task')
    },
  })
}