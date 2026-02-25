import { tokens } from '../tokens'

interface Props {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  type?: string
  disabled?: boolean
  hint?: string
  error?: string
}

export default function Input({
  label, placeholder, value, onChange, type = 'text', disabled, hint, error
}: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space.xs, fontFamily: tokens.font.family }}>
      {label && (
        <label style={{
          fontSize: tokens.font.size.sm,
          fontWeight: tokens.font.weight.medium,
          color: tokens.color.text,
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        style={{
          padding: '10px 12px',
          border: `1px solid ${error ? tokens.color.error : tokens.color.border}`,
          borderRadius: tokens.radius.md,
          fontSize: tokens.font.size.md,
          fontFamily: tokens.font.family,
          color: tokens.color.text,
          background: disabled ? tokens.color.bg : tokens.color.surface,
          outline: 'none',
          width: '100%',
        }}
      />
      {(hint || error) && (
        <span style={{
          fontSize: tokens.font.size.xs,
          color: error ? tokens.color.error : tokens.color.textSecondary,
        }}>
          {error || hint}
        </span>
      )}
    </div>
  )
}
