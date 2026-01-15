'use client'

import type { AnnotationColor } from '@/types'

interface ColorPickerProps {
  currentColor: AnnotationColor
  onColorChange: (color: AnnotationColor) => void
}

const colors: { value: AnnotationColor; label: string; bgClass: string }[] = [
  { value: '#EF4444', label: 'Red (Urgent)', bgClass: 'bg-red-500' },
  { value: '#F59E0B', label: 'Yellow (Attention)', bgClass: 'bg-amber-500' },
  { value: '#3B82F6', label: 'Blue (Info)', bgClass: 'bg-blue-500' },
]

export default function ColorPicker({
  currentColor,
  onColorChange,
}: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          onClick={() => onColorChange(color.value)}
          className={`w-8 h-8 rounded-full ${color.bgClass} transition-all ${
            currentColor === color.value
              ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-800 scale-110'
              : 'opacity-70 hover:opacity-100'
          }`}
          title={color.label}
        />
      ))}
    </div>
  )
}
