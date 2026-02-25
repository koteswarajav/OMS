import { useState } from 'react'
import { NavBar, Card } from '../design-system/components'
import { tokens } from '../design-system/tokens'

interface Props {
  onNext?: () => void
  onBack?: () => void
}

export default function FulfillmentLocation({ onBack }: Props) {
  const [selected, setSelected] = useState('')

  return (
    <div style={{ fontFamily: tokens.font.family, background: tokens.color.bg, minHeight: '100vh' }}>
      <NavBar title="Fulfillment Location" onBack={onBack} />

      <div style={{ padding: `0 ${tokens.space.md}px` }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space.xs }}>
            <label style={{
              fontSize: tokens.font.size.sm,
              fontWeight: tokens.font.weight.medium,
              color: tokens.color.text,
            }}>
              Fulfillment Location
            </label>
            <select
              value={selected}
              onChange={e => setSelected(e.target.value)}
              style={{
                padding: '10px 12px',
                border: `1px solid ${tokens.color.border}`,
                borderRadius: tokens.radius.md,
                fontSize: tokens.font.size.md,
                fontFamily: tokens.font.family,
                color: selected ? tokens.color.text : tokens.color.textSecondary,
                background: tokens.color.surface,
                outline: 'none',
                width: '100%',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>Select location</option>
              <option value="wms1">WMS 1</option>
              <option value="wms2">WMS 2</option>
            </select>
          </div>
        </Card>
      </div>
    </div>
  )
}
