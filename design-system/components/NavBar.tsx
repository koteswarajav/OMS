import { tokens } from '../tokens'

interface Props {
  title: string
  onBack?: () => void
  rightLabel?: string
  onRight?: () => void
}

export default function NavBar({ title, onBack, rightLabel, onRight }: Props) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${tokens.space.md}px`,
      background: tokens.color.surface,
      borderBottom: `1px solid ${tokens.color.border}`,
      fontFamily: tokens.font.family,
      marginBottom: tokens.space.md,
    }}>
      {/* Left: back button */}
      <div style={{ width: 60 }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: tokens.color.primary, fontSize: tokens.font.size.md,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            ← Back
          </button>
        )}
      </div>

      {/* Center: title */}
      <span style={{
        fontSize: tokens.font.size.lg,
        fontWeight: tokens.font.weight.semibold,
        color: tokens.color.text,
      }}>
        {title}
      </span>

      {/* Right: optional action */}
      <div style={{ width: 60, textAlign: 'right' }}>
        {rightLabel && onRight && (
          <button onClick={onRight} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: tokens.color.primary, fontSize: tokens.font.size.md,
          }}>
            {rightLabel}
          </button>
        )}
      </div>
    </div>
  )
}
