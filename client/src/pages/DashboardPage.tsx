import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, LogOut, CheckSquare } from 'lucide-react'
import { setAuthToken } from '../lib/api'
import { useTasks, useCreateTask, useUpdateTask } from '../hooks/useTasks'
import { useSocket } from '../hooks/useSocket'
import type { Task, TaskStatus } from '../types'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import TaskSkeleton from '../components/skeletons/TaskSkeletons'
import Modal from '../components/ui/Modal'


const FILTERS: { label: string; value: TaskStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
]

export default function DashboardPage() {
  const { getToken, signOut } = useAuth()
  const { user } = useUser()
  const [dbUserId, setDbUserId] = useState<string | undefined>()
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const { data: tasks, isLoading } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  useSocket(dbUserId)

  useEffect(() => {
    const attachToken = async () => {
      const token = await getToken()
      setAuthToken(token)
    }
    attachToken()
  }, [getToken])

  const filteredTasks = tasks?.filter(t =>
    filter === 'ALL' ? true : t.status === filter
  )

  const stats = {
    total: tasks?.length || 0,
    done: tasks?.filter(t => t.status === 'DONE').length || 0,
    inProgress: tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0,
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <CheckSquare size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">TaskFlow</span>
          </div>

          <div className="flex items-center gap-3">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.firstName || ''}
                className="w-8 h-8 rounded-full border-2 border-slate-700"
              />
            )}
            <span className="text-slate-300 text-sm hidden sm:block">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={() => signOut()}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400
                         hover:text-white"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good {getTimeOfDay()}, {user?.firstName} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {stats.done} of {stats.total} tasks completed
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700
                       text-white rounded-xl text-sm font-medium transition-colors
                       shadow-lg shadow-brand-600/20"
          >
            <Plus size={16} />
            <span className="hidden sm:block">New Task</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: stats.total, color: 'text-white' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-brand-400' },
            { label: 'Completed', value: stats.done, color: 'text-emerald-400' },
          ].map(stat => (
            <div key={stat.label}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                transition-colors ${filter === f.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <TaskSkeleton key={i} />)}
          </div>
        ) : filteredTasks?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center
                            justify-center mx-auto mb-4">
              <CheckSquare size={28} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">No tasks here</p>
            <p className="text-slate-600 text-sm mt-1">
              {filter === 'ALL' ? 'Create your first task!' : `No ${filter.toLowerCase()} tasks`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks?.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  currentUserId={task.owner.id}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={(data) => {
            createTask.mutate(data as any, {
              onSuccess: () => setIsCreateOpen(false),
            })
          }}
          isLoading={createTask.isPending}
          onClose={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={(data) => {
              updateTask.mutate(
                { id: editingTask.id, data: data as any },
                { onSuccess: () => setEditingTask(null) }
              )
            }}
            isLoading={updateTask.isPending}
            onClose={() => setEditingTask(null)}
          />
        )}
      </Modal>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}