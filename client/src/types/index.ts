export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface TaskUser {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  dueDate?: string | null
  createdAt: string
  updatedAt: string
  ownerId: string
  assigneeId?: string | null
  pendingAssigneeEmail?: string | null
  owner: TaskUser
  assignee?: TaskUser | null
}

export interface CreateTaskInput {
  title: string
  description?: string
  dueDate?: string
  assigneeEmail?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  dueDate?: string | null
}