type Variant = 'primary' | 'success' | 'warning' | 'neutral' | 'info' | 'brand' | 'danger'

interface Props {
  children: React.ReactNode
  variant?: Variant
}

const cls: Record<Variant, string> = {
  primary: 'bg-blue-50 text-blue-700 border border-blue-100',
  brand:   'bg-blue-50 text-blue-600 border border-blue-100',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
  info:    'bg-sky-50 text-sky-700 border border-sky-100',
  danger:  'bg-red-50 text-red-700 border border-red-100',
}

export default function Badge({ children, variant = 'neutral' }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls[variant]}`}>
      {children}
    </span>
  )
}
