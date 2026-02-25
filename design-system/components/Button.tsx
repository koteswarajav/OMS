import { tokens } from '../tokens'

interface Props {
  label: string
  variant?: 'primary' | 'ghost' | 'danger' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: tokens.color.primary,
    color: tokens.color.primaryText,
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: tokens.color.primary,
    border: `1px solid ${tokens.color.primary}`,
  },
  danger: {
    background: tokens.color.error,
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: tokens.color.surface,
    color: tokens.color.text,
    border: `1px solid ${tokens.color.border}`,
  },
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: tokens.font.size.sm },
  md: { padding: '10px 20px', fontSize: tokens.font.size.md },
  lg: { padding: '14px 28px', fontSize: tokens.font.size.lg },
}

export default function Button({
  label, variant = 'primary', size = 'md', onClick, disabled, fullWidth
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: tokens.radius.md,
        fontWeight: tokens.font.weight.medium,
        fontFamily: tokens.font.family,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: tokens.space.xs,
        transition: tokens.transition,
      }}
    >
      {label}
    </button>
  )
}
