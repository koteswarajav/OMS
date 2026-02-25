import { NavBar, Button, Placeholder, Card } from '../design-system/components'
import { tokens } from '../design-system/tokens'

// VARIANT: Only write what's DIFFERENT from the base screen.
// Rename this file to match the screen: e.g. Dashboard-v2.tsx
// Keep the same Props interface so FlowRunner can swap variants in.

interface Props {
  onNext?: () => void
  onBack?: () => void
}

export default function ScreenTemplateV2({ onNext, onBack }: Props) {
  return (
    <div style={{ fontFamily: tokens.font.family, background: tokens.color.bg, minHeight: '100vh' }}>
      <NavBar title="Screen Title (Variant 2)" onBack={onBack} />

      <div style={{ padding: `0 ${tokens.space.md}px`, display: 'flex', flexDirection: 'column', gap: tokens.space.md }}>

        {/* This layout differs from v1: e.g. horizontal card layout */}
        <div style={{ display: 'flex', gap: tokens.space.md }}>
          <Card style={{ flex: 1 }}>
            <Placeholder height={150} label="Option A" />
          </Card>
          <Card style={{ flex: 1 }}>
            <Placeholder height={150} label="Option B" />
          </Card>
        </div>

        <Placeholder height={80} label="Additional section" />

        {onNext && (
          <Button label="Continue" onClick={onNext} variant="primary" fullWidth />
        )}

      </div>
    </div>
  )
}
