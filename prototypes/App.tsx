import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import FlowRunner from '../flows/FlowRunner'
import { TemplateFlow } from '../flows/_template-flow'
import { tokens } from '../design-system/tokens'
import FulfillmentLocation from '../screens/FulfillmentLocation'

// REGISTER NEW FLOWS HERE:
// import { CheckoutFlow } from '../flows/CheckoutFlow'
// import { OnboardingFlow } from '../flows/OnboardingFlow'

const flows = [
  { path: '/template', name: 'Template Flow', flow: TemplateFlow },
  // { path: '/checkout', name: 'Checkout Flow', flow: CheckoutFlow },
  // { path: '/onboarding', name: 'Onboarding Flow', flow: OnboardingFlow },
]

const screens = [
  { path: '/fulfillment-location', name: 'Fulfillment Location', component: FulfillmentLocation },
]

function Index() {
  return (
    <div style={{
      fontFamily: tokens.font.family,
      padding: tokens.space.xl,
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <h1 style={{ fontSize: tokens.font.size.xxl, fontWeight: tokens.font.weight.bold, marginBottom: tokens.space.sm }}>
        OMS Prototypes
      </h1>
      <p style={{ color: tokens.color.textSecondary, marginBottom: tokens.space.xl, fontSize: tokens.font.size.md }}>
        Select a flow to preview
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space.sm }}>
        {[...flows.map(f => ({ path: f.path, name: f.name })), ...screens.map(s => ({ path: s.path, name: s.name }))].map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'block',
              padding: `${tokens.space.md}px`,
              background: tokens.color.surface,
              border: `1px solid ${tokens.color.border}`,
              borderRadius: tokens.radius.md,
              color: tokens.color.primary,
              textDecoration: 'none',
              fontWeight: tokens.font.weight.medium,
              fontSize: tokens.font.size.md,
              boxShadow: tokens.shadow.sm,
            }}
          >
            → {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {flows.map(f => (
          <Route
            key={f.path}
            path={f.path}
            element={<FlowRunner flow={f.flow} name={f.name} />}
          />
        ))}
        {screens.map(s => (
          <Route
            key={s.path}
            path={s.path}
            element={<s.component />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
