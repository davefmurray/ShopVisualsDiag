'use client'

import type { AnnotationTool, LineThickness } from '@/types'

interface ToolPaletteProps {
  currentTool: AnnotationTool
  onToolChange: (tool: AnnotationTool) => void
  currentThickness: LineThickness
  onThicknessChange: (thickness: LineThickness) => void
}

const tools: { id: AnnotationTool; label: string; icon: string }[] = [
  { id: 'select', label: 'Select', icon: 'cursor' },
  { id: 'arrow', label: 'Arrow', icon: 'arrow' },
  { id: 'circle', label: 'Circle', icon: 'circle' },
  { id: 'rectangle', label: 'Rectangle', icon: 'rectangle' },
  { id: 'text', label: 'Text', icon: 'text' },
  { id: 'freehand', label: 'Draw', icon: 'pencil' },
]

const thicknesses: { value: LineThickness; label: string }[] = [
  { value: 2, label: 'Thin' },
  { value: 4, label: 'Medium' },
  { value: 6, label: 'Thick' },
]

export default function ToolPalette({
  currentTool,
  onToolChange,
  currentThickness,
  onThicknessChange,
}: ToolPaletteProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Tools */}
      <div className="flex gap-1 flex-wrap">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`p-2 rounded-lg transition-colors ${
              currentTool === tool.id
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
            }`}
            title={tool.label}
          >
            <ToolIcon name={tool.icon} />
          </button>
        ))}
      </div>

      {/* Thickness */}
      {currentTool !== 'select' && currentTool !== 'text' && (
        <div className="flex gap-1">
          {thicknesses.map((t) => (
            <button
              key={t.value}
              onClick={() => onThicknessChange(t.value)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                currentThickness === t.value
                  ? 'bg-zinc-500 text-white'
                  : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ToolIcon({ name }: { name: string }) {
  const iconClass = 'w-5 h-5'

  switch (name) {
    case 'cursor':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    case 'arrow':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )
    case 'circle':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
        </svg>
      )
    case 'rectangle':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="1" strokeWidth={2} />
        </svg>
      )
    case 'text':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    case 'pencil':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    default:
      return null
  }
}
