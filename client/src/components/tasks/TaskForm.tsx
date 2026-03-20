import { useState } from 'react'
import type { CreateTaskInput, UpdateTaskInput, Task } from '../../types'
import { Loader2 } from 'lucide-react'

interface TaskFormProps {
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void
  isLoading: boolean
  initialData?: Task
  onClose: () => void
}

export default function TaskForm({ onSubmit, isLoading, initialData, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
  )
  const [assigneeEmail, setAssigneeEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      ...(!initialData && { assigneeEmail: assigneeEmail.trim() || undefined }),
    })
  }

  const inputClass = `w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5
    text-white placeholder-slate-500 focus:outline-none focus:border-brand-500
    transition-colors text-sm`

  const labelClass = 'block text-sm font-medium text-slate-300 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className={labelClass}>Title <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={inputClass}
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Due Date */}
      <div>
        <label className={labelClass}>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className={`${inputClass} [color-scheme:dark]`}
        />
      </div>

      {/* Assignee Email — only on create */}
      {!initialData && (
        <div>
          <label className={labelClass}>Assign To (Email)</label>
          <input
            type="email"
            value={assigneeEmail}
            onChange={e => setAssigneeEmail(e.target.value)}
            placeholder="colleague@example.com"
            className={inputClass}
          />
          <p className="text-xs text-slate-500 mt-1">
            If they haven't joined yet, they'll see it when they do.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300
                     rounded-xl text-sm font-medium transition-colors border border-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50
                     disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium
                     transition-colors flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          {initialData ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}