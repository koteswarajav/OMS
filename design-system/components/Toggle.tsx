interface Props {
  on: boolean
  onToggle: () => void
  disabled?: boolean
  title?: string
}

export default function Toggle({ on, onToggle, disabled = false, title }: Props) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      title={title}
      className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${on ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}
