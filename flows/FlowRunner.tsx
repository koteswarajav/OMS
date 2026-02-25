import { useState } from 'react'
import { tokens } from '../design-system/tokens'

interface ScreenComponent {
  (props: { onNext?: () => void; onBack?: () => void }): JSX.Element
}

interface Props {
  flow: ScreenComponent[]
  name?: string
}

export default function FlowRunner({ flow, name }: Props) {
  const [step, setStep] = useState(0)
  const Screen = flow[step]

  return (
    <div>
      {/* Step indicator */}
      {flow.length > 1 && (
        <div style={{
          display: 'flex',
          gap: 4,
          padding: `${tokens.space.sm}px ${tokens.space.md}px`,
          background: tokens.color.surface,
          borderBottom: `1px solid ${tokens.color.divider}`,
        }}>
          {flow.map((_, i) => (
            <div key={i} style={{
              flex: 1,
              height: 3,
              borderRadius: tokens.radius.full,
              background: i <= step ? tokens.color.primary : tokens.color.placeholder,
              transition: tokens.transition,
            }} />
          ))}
        </div>
      )}

      <Screen
        onNext={step < flow.length - 1 ? () => setStep(s => s + 1) : undefined}
        onBack={step > 0 ? () => setStep(s => s - 1) : undefined}
      />

      {/* Dev helper: step counter */}
      <div style={{
        position: 'fixed', bottom: 12, right: 12,
        background: 'rgba(0,0,0,0.6)', color: '#fff',
        padding: '4px 10px', borderRadius: tokens.radius.full,
        fontSize: tokens.font.size.xs, fontFamily: tokens.font.family,
      }}>
        {name ? `${name} · ` : ''}{step + 1} / {flow.length}
      </div>
    </div>
  )
}
