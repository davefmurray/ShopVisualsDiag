'use client'

import { useState } from 'react'
import type { Inspection, InspectionTask } from '@/types'

interface InspectionTaskListProps {
  inspections: Inspection[]
  onTaskSelect: (inspection: Inspection, task: InspectionTask) => void
}

export default function InspectionTaskList({
  inspections,
  onTaskSelect,
}: InspectionTaskListProps) {
  const [expandedInspections, setExpandedInspections] = useState<Set<number>>(
    new Set(inspections.map((i) => i.id))
  )

  function toggleInspection(inspectionId: number) {
    setExpandedInspections((prev) => {
      const next = new Set(prev)
      if (next.has(inspectionId)) {
        next.delete(inspectionId)
      } else {
        next.add(inspectionId)
      }
      return next
    })
  }

  if (inspections.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No inspections found for this repair order.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {inspections.map((inspection) => (
        <InspectionGroup
          key={inspection.id}
          inspection={inspection}
          expanded={expandedInspections.has(inspection.id)}
          onToggle={() => toggleInspection(inspection.id)}
          onTaskSelect={(task) => onTaskSelect(inspection, task)}
        />
      ))}
    </div>
  )
}

interface InspectionGroupProps {
  inspection: Inspection
  expanded: boolean
  onToggle: () => void
  onTaskSelect: (task: InspectionTask) => void
}

function InspectionGroup({
  inspection,
  expanded,
  onToggle,
  onTaskSelect,
}: InspectionGroupProps) {
  const tasks = inspection.tasks || []

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors touch-target"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {inspection.name}
          </span>
        </div>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </button>

      {/* Tasks */}
      {expanded && tasks.length > 0 && (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onSelect={() => onTaskSelect(task)} />
          ))}
        </div>
      )}

      {expanded && tasks.length === 0 && (
        <div className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
          No tasks in this inspection.
        </div>
      )}
    </div>
  )
}

interface TaskRowProps {
  task: InspectionTask
  onSelect: () => void
}

function TaskRow({ task, onSelect }: TaskRowProps) {
  const mediaCount = task.media?.length || 0
  const conditionColors: Record<string, string> = {
    OK: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    NEEDS_ATTENTION: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="px-4 py-3 flex items-center justify-between gap-4 bg-white dark:bg-zinc-800">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {task.name}
          </span>
          {task.condition && (
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                conditionColors[task.condition] || 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {task.condition.replace('_', ' ')}
            </span>
          )}
        </div>
        {mediaCount > 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {mediaCount} existing media
          </p>
        )}
      </div>
      <button
        onClick={onSelect}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors touch-target whitespace-nowrap"
      >
        Create Report
      </button>
    </div>
  )
}
