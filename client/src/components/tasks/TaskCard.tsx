import { motion } from 'framer-motion'
import { Pencil, Trash2, Calendar, User, CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import type { Task } from '../../types'
import Badge from '../ui/Badge'
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks'



interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  currentUserId: string
}

export default function TaskCard({ task, onEdit, currentUserId }: TaskCardProps) {
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const isOwner = task.owner.id === currentUserId
  const isAssignee = task.assignee?.id === currentUserId
  const isComplete = task.status === 'DONE'
  const isInProgress = task.status === 'IN_PROGRESS'
  const isTodo = task.status === 'TODO'


  console.log('TaskCard:', {
  taskId: task.id,
  currentUserId,
  ownerId: task.owner.id,
  assigneeId: task.assignee?.id,
  isOwner: task.owner.id === currentUserId,
  isAssignee: task.assignee?.id === currentUserId,
  })
  const handleStart = () => {
    updateTask.mutate({ id: task.id, data: { status: 'IN_PROGRESS' } })
  }

  const handleComplete = () => {
    updateTask.mutate({ id: task.id, data: { status: 'DONE' } })
  }

  const handleReopen = () => {
    updateTask.mutate({ id: task.id, data: { status: 'TODO' } })
  }

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTask.mutate(task.id)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'DONE'

  // What action button to show based on role + status
  const renderActionButton = () => {
    // Owner can reopen a completed task
    if (isComplete && isOwner) {
      return (
        <button
          onClick={handleReopen}
          title="Reopen task"
          className="mt-0.5 text-emerald-400 hover:text-slate-400 transition-colors flex-shrink-0"
        >
          <CheckCircle2 size={20} />
        </button>
      )
    }

    // Assignee sees Start button when TODO
    if (isTodo && isAssignee && !isOwner) {
      return (
        <button
          onClick={handleStart}
          title="Start task"
          className="mt-0.5 text-slate-500 hover:text-brand-400 transition-colors flex-shrink-0"
        >
          <PlayCircle size={20} />
        </button>
      )
    }

    // Assignee sees Complete button when IN_PROGRESS
    if (isInProgress && isAssignee && !isOwner) {
      return (
        <button
          onClick={handleComplete}
          title="Mark complete"
          className="mt-0.5 text-brand-400 hover:text-emerald-400 transition-colors flex-shrink-0"
        >
          <Circle size={20} />
        </button>
      )
    }

    // Owner sees complete toggle for their own unassigned tasks
    if (isOwner && !task.assigneeId) {
      if (isComplete) {
        return (
          <button
            onClick={handleReopen}
            title="Reopen task"
            className="mt-0.5 text-emerald-400 hover:text-slate-400 transition-colors flex-shrink-0"
          >
            <CheckCircle2 size={20} />
          </button>
        )
      }
      return (
        <button
          onClick={handleComplete}
          title="Mark complete"
          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0"
        >
          <Circle size={20} />
        </button>
      )
    }

    // Owner viewing assigned task — show status icon (not clickable)
    if (isOwner && task.assigneeId) {
      return (
        <div className="mt-0.5 flex-shrink-0">
          {isComplete
            ? <CheckCircle2 size={20} className="text-emerald-400" />
            : isInProgress
            ? <PlayCircle size={20} className="text-brand-400" />
            : <Circle size={20} className="text-slate-600" />
          }
        </div>
      )
    }

    // Default — readonly circle
    return (
      <div className="mt-0.5 flex-shrink-0">
        <Circle size={20} className="text-slate-600" />
      </div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-slate-900 border rounded-2xl p-5 transition-all duration-200
        hover:border-slate-600 group
        ${isComplete ? 'border-slate-800 opacity-75' : 'border-slate-800'}`}
    >
      {/* Top row */}
      <div className="flex items-start gap-3 mb-3">
        {renderActionButton()}

        {/* Title + Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-medium text-sm leading-snug
              ${isComplete ? 'line-through text-slate-500' : 'text-white'}`}>
              {task.title}
            </h3>
            <Badge status={task.status} />
          </div>

          {task.description && (
            <p className="text-slate-400 text-xs mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between ml-8">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Due date */}
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs
              ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
              <Calendar size={12} />
              {formatDate(task.dueDate)}
              {isOverdue && ' · Overdue'}
            </span>
          )}

          {/* Assignee */}
          {task.assignee && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <User size={12} />
              {task.assignee.name}
            </span>
          )}

          {/* Pending assignee */}
          {task.pendingAssigneeEmail && (
            <span className="flex items-center gap-1 text-xs text-amber-500">
              <User size={12} />
              {task.pendingAssigneeEmail} (pending)
            </span>
          )}

          {/* Assigned to me indicator */}
          {isAssignee && !isOwner && (
            <span className="text-xs text-brand-400 font-medium">
              Assigned to you
            </span>
          )}
        </div>

        {/* Edit/Delete — owner only */}
        {isOwner && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors
                         text-slate-400 hover:text-white"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors
                         text-slate-400 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}