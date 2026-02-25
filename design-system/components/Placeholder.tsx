import { tokens } from '../tokens'

interface Props {
  width?: number | string
  height?: number | string
  label?: string
}

export default function Placeholder({ width = '100%', height = 120, label }: Props) {
  return (
    <div style={{
      width,
      height,
      background: tokens.color.placeholder,
      borderRadius: tokens.radius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: tokens.color.textSecondary,
      fontSize: tokens.font.size.sm,
      fontFamily: tokens.font.family,
      border: `1px dashed ${tokens.color.border}`,
    }}>
      {label || '[ placeholder ]'}
    </div>
  )
}
