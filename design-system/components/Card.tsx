import { tokens } from '../tokens'

interface Props {
  children: React.ReactNode
  padding?: number
  style?: React.CSSProperties
}

export default function Card({ children, padding = tokens.space.md, style }: Props) {
  return (
    <div style={{
      background: tokens.color.surface,
      border: `1px solid ${tokens.color.border}`,
      borderRadius: tokens.radius.lg,
      padding,
      boxShadow: tokens.shadow.sm,
      ...style,
    }}>
      {children}
    </div>
  )
}
