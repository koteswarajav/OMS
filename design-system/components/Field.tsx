interface Props {
  label: string
  hint?: string
  children: React.ReactNode
  required?: boolean
}

export default function Field({ label, hint, children, required }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>}
    </div>
  )
}
