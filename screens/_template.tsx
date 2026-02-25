import { NavBar, Button, Placeholder, Card } from '../design-system/components'
import { tokens } from '../design-system/tokens'

// USAGE: Copy this file, rename it, and update the component name + content.
// Props: onNext moves to the next screen in a flow; onBack goes back.
// Never hardcode navigation here — let FlowRunner handle it.

interface Props {
  onNext?: () => void
  onBack?: () => void
}

export default function ScreenTemplate({ onNext, onBack }: Props) {
  return (
    <div style={{ fontFamily: tokens.font.family, background: tokens.color.bg, minHeight: '100vh' }}>
      <NavBar title="Screen Title" onBack={onBack} />

      <div style={{ padding: `0 ${tokens.space.md}px`, display: 'flex', flexDirection: 'column', gap: tokens.space.md }}>

        {/* Replace with your actual content */}
        <Card>
          <Placeholder height={200} label="Main content area" />
        </Card>

        <Card>
          <Placeholder height={100} label="Secondary area" />
        </Card>

        {/* Action button — only show if there's a next screen */}
        {onNext && (
          <Button label="Continue" onClick={onNext} variant="primary" fullWidth />
        )}

      </div>
    </div>
  )
}
