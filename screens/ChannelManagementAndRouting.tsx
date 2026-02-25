import { useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Connection {
  id: string
  name: string
  app: string
  isCustom: boolean
}

interface Channel {
  id: string
  name: string
  initials: string
  subscriptions: number
  routingEnabled: number
  aggregationEnabled: number
  connections: Connection[]
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const channels: Channel[] = [
  {
    id: 'shopify', name: 'Shopify', initials: 'SH',
    subscriptions: 4, routingEnabled: 3, aggregationEnabled: 2,
    connections: [
      { id: 'c1', name: 'Shopify Store US', app: 'Shopify App', isCustom: false },
      { id: 'c2', name: 'Shopify Store IN', app: 'Shopify App', isCustom: true },
    ],
  },
  {
    id: 'bc', name: 'BigCommerce', initials: 'BC',
    subscriptions: 2, routingEnabled: 1, aggregationEnabled: 1,
    connections: [
      { id: 'c3', name: 'BC Store Global', app: 'BigCommerce App', isCustom: false },
    ],
  },
  {
    id: 'woo', name: 'WooCommerce', initials: 'WC',
    subscriptions: 3, routingEnabled: 2, aggregationEnabled: 2,
    connections: [
      { id: 'c4', name: 'WooCommerce Store EU', app: 'WooCommerce App', isCustom: false },
      { id: 'c5', name: 'WooCommerce Store UK', app: 'WooCommerce App', isCustom: false },
    ],
  },
]

// ─── Inline Components ────────────────────────────────────────────────────────

function Toggle({ on, onToggle, disabled = false }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      title={disabled ? 'Enable "Allow multiple fulfillment locations for an order" to change this setting.' : undefined}
      className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${on ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

function Badge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'info' | 'brand' }) {
  const cls = {
    primary: 'bg-blue-50 text-blue-700 border border-blue-100',
    brand:   'bg-blue-50 text-blue-600 border border-blue-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
    info:    'bg-sky-50 text-sky-700 border border-sky-100',
  }[variant]
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{children}</span>
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg border bg-sky-50 border-sky-200 text-sky-800 text-xs leading-5">
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>{children}</span>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>}
    </div>
  )
}

const selectCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400 pr-8"
const inputCls  = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-300 hover:border-gray-400"

function SelectField({ children, value, onChange, placeholder }: {
  children: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className={selectCls}>
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

// ─── Override Sub-Panel ───────────────────────────────────────────────────────

function OverridePanel({ connId: _connId }: { connId: string }) {
  const [tab, setTab] = useState<'routing' | 'aggregation'>('routing')
  const [defaultLocation, setDefaultLocation] = useState('')
  const [defaultCustomer, setDefaultCustomer]  = useState('')
  const [aggLocation, setAggLocation]           = useState('')

  const tabCls = (t: string) =>
    `px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
      tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`

  return (
    <div className="mt-3 border border-blue-100 rounded-lg overflow-hidden bg-blue-50/30">
      {/* Sub-tabs */}
      <div className="flex border-b border-blue-100 bg-white">
        <button className={tabCls('routing')}     onClick={() => setTab('routing')}>Order Routing</button>
        <button className={tabCls('aggregation')} onClick={() => setTab('aggregation')}>Order Aggregation</button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {tab === 'routing' && (
          <Field
            label="Default Fulfillment Location"
            hint="Overrides the global OMS setting for routing on this connection."
          >
            <SelectField value={defaultLocation} onChange={setDefaultLocation} placeholder="Use global default">
              <option value="wms1">WMS 1</option>
              <option value="wms2">WMS 2</option>
            </SelectField>
          </Field>
        )}

        {tab === 'aggregation' && (
          <>
            <Field
              label="Default Customer"
              hint="Search by Customer ID, Name, Phone, or Email."
            >
              <input className={inputCls} placeholder="Search customers" value={defaultCustomer} onChange={e => setDefaultCustomer(e.target.value)} />
            </Field>
            <Field
              label="Default Fulfillment Locations"
              hint="Used as default for aggregation on this connection."
            >
              <SelectField value={aggLocation} onChange={setAggLocation} placeholder="Search fulfillment locations">
                <option value="wms1">WMS 1</option>
                <option value="wms2">WMS 2</option>
              </SelectField>
            </Field>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Connection Row ───────────────────────────────────────────────────────────

function ConnectionRow({ conn }: { conn: Connection }) {
  const [aggregation, setAggregation] = useState(true)
  const [routing, setRouting]         = useState(true)
  const [overrides, setOverrides]     = useState(false)

  return (
    <div className={`border rounded-lg bg-white transition-colors ${overrides ? 'border-blue-200' : 'border-gray-200'}`}>
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Name + app */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">{conn.name}</span>
            <span className="text-xs text-gray-400">({conn.app})</span>
            {conn.isCustom && <Badge variant="primary">Custom subscription</Badge>}
            <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors" title="Open connection">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Aggregation</span>
            <Toggle on={aggregation} onToggle={() => setAggregation(v => !v)} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Routing</span>
            <Toggle on={routing} onToggle={() => setRouting(v => !v)} />
          </div>
        </div>
      </div>

      {/* Channel Overrides row */}
      <div className={`px-4 py-3 border-t flex items-center justify-between transition-colors ${overrides ? 'border-blue-100 bg-blue-50/40' : 'border-gray-100'}`}>
        <div>
          <span className="text-xs font-semibold text-gray-700">Channel Overrides</span>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            {overrides ? 'Connection-specific defaults applied.' : 'Using global OMS settings.'}
          </p>
        </div>
        <Toggle on={overrides} onToggle={() => setOverrides(v => !v)} />
      </div>

      {/* Override panel */}
      {overrides && (
        <div className="px-4 pb-4">
          <OverridePanel connId={conn.id} />
        </div>
      )}
    </div>
  )
}

// ─── Channel Accordion ────────────────────────────────────────────────────────

function ChannelAccordion({ channel }: { channel: Channel }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-colors ${open ? 'border-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
      {/* Header row */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3.5 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Channel logo */}
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
          {channel.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900">{channel.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            Subscriptions: {channel.subscriptions}
            <span className="mx-1.5 text-gray-300">·</span>
            Routing enabled: {channel.routingEnabled}
            <span className="mx-1.5 text-gray-300">·</span>
            Aggregation enabled: {channel.aggregationEnabled}
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Connections */}
      {open && (
        <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3 bg-gray-50/50">
          {channel.connections.map(conn => (
            <ConnectionRow key={conn.id} conn={conn} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Section 2 — Aggregation Tab ─────────────────────────────────────────────

function AggregationTab() {
  const [form, setForm] = useState({ prefix: 'BATCH', digits: '6', startValue: '1', increment: '1' })
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const preview = (() => {
    const n = parseInt(form.digits) || 6
    const s = parseInt(form.startValue) || 1
    const pad = String(s).padStart(n, '0')
    return form.prefix ? `${form.prefix}-${pad}` : pad
  })()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-0.5">Aggregation Order ID Configuration</div>
        <div className="text-xs text-gray-500 mb-5 leading-relaxed">Define how aggregated order IDs are generated (prefix, length, and sequence).</div>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Prefix" hint="Optional string prefix for aggregated order IDs.">
            <input className={inputCls} placeholder="e.g. BATCH" value={form.prefix} onChange={e => set('prefix')(e.target.value)} />
          </Field>
          <Field label="Number of Digits" hint="Total digits for the numeric part (padded with zeros).">
            <input className={inputCls} type="number" placeholder="e.g. 6" value={form.digits} onChange={e => set('digits')(e.target.value)} />
          </Field>
          <Field label="Start Value" hint="First numeric value for the sequence.">
            <input className={inputCls} type="number" placeholder="e.g. 1" value={form.startValue} onChange={e => set('startValue')(e.target.value)} />
          </Field>
          <Field label="Increment" hint="Step between consecutive IDs.">
            <input className={inputCls} type="number" placeholder="e.g. 1" value={form.increment} onChange={e => set('increment')(e.target.value)} />
          </Field>
        </div>

        {/* Preview */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <Field label="Preview">
            <div className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-sm font-mono font-semibold text-blue-700 bg-blue-50 tracking-widest">
              {preview}
            </div>
          </Field>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            IDs are left-padded to match Number of Digits. Maximum value is derived from Number of Digits
            (e.g. 6 digits → max 999999). Low availability alerts are triggered when 90% of the ID range is used.
          </p>
        </div>
      </div>

      <Alert>
        Note: Orders included in aggregation do not go through routing. Individual orders may still be routed according to routing rules.
      </Alert>
    </div>
  )
}

// ─── Section 2 — Routing Tab ──────────────────────────────────────────────────

function RoutingTab() {
  const [defaultLocation, setDefaultLocation] = useState('')
  const [allowMulti, setAllowMulti]           = useState(false)
  const [allowSplit, setAllowSplit]            = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Default Fulfillment Location */}
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-0.5">Default Fulfillment Location Configuration</div>
        <div className="text-xs text-gray-500 mb-4 leading-relaxed">Define a default fulfillment location when no other routing rule applies.</div>
        <Field
          label="Default Fulfillment Location (optional)"
          hint="If not set, orders will be routed based on routing rules only."
        >
          <SelectField value={defaultLocation} onChange={setDefaultLocation} placeholder="Search fulfillment locations">
            <option value="wms1">WMS 1</option>
            <option value="wms2">WMS 2</option>
          </SelectField>
        </Field>
        {defaultLocation && (
          <button onClick={() => setDefaultLocation('')} className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
            ✕ Clear selection
          </button>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Split Configuration */}
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-0.5">Split Configuration</div>
        <div className="text-xs text-gray-500 mb-5 leading-relaxed">Control whether orders and line items can be routed to multiple fulfillment locations.</div>

        <div className="flex flex-col gap-0 divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {/* Toggle A */}
          <div className="flex items-start justify-between gap-4 px-4 py-4 bg-white">
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">Allow multiple fulfillment locations for an order</div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {allowMulti
                  ? 'Different line items in the same order may use different fulfillment locations.'
                  : 'The entire order must be allocated to a single fulfillment location.'}
              </p>
            </div>
            <Toggle on={allowMulti} onToggle={() => { setAllowMulti(v => !v); if (allowMulti) setAllowSplit(false) }} />
          </div>

          {/* Toggle B */}
          <div className={`flex items-start justify-between gap-4 px-4 py-4 transition-colors ${!allowMulti ? 'opacity-50 bg-gray-50' : 'bg-white'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">Allow multiple fulfillment locations for an order line item</span>
                {!allowMulti && (
                  <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {allowSplit
                  ? 'A single line item can be split between multiple locations when inventory is insufficient.'
                  : 'Each line item is fulfilled from one fulfillment location (no splitting).'}
              </p>
              {!allowMulti && (
                <p className="text-xs text-amber-600 mt-1.5 font-medium">
                  Enable "Allow multiple fulfillment locations for an order" to change this setting.
                </p>
              )}
            </div>
            <Toggle on={allowSplit} onToggle={() => setAllowSplit(v => !v)} disabled={!allowMulti} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ChannelManagementAndRouting() {
  const [activeTab, setActiveTab] = useState<'aggregation' | 'routing'>('aggregation')

  const tabCls = (t: string) =>
    `px-5 py-3 text-xs font-semibold border-b-[3px] transition-colors ${
      activeTab === t
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
    }`

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* ── Section 1: Channel Management ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Channel Management</h1>
            <Badge variant="brand">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              Active subscriptions only
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Manage which connections participate in Order Aggregation and Order Routing.
          </p>

          <div className="flex flex-col gap-3">
            {channels.map(ch => (
              <ChannelAccordion key={ch.id} channel={ch} />
            ))}
          </div>
        </div>

        {/* ── Section 2: Order Aggregation & Routing ── */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-5">
            Order Aggregation &amp; Routing
          </h2>

          {/* Tab card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 px-1">
              <button className={tabCls('aggregation')} onClick={() => setActiveTab('aggregation')}>
                Order Aggregation
              </button>
              <button className={tabCls('routing')} onClick={() => setActiveTab('routing')}>
                Order Routing
              </button>
            </div>

            {/* Tab content */}
            <div className="px-6 py-6">
              {activeTab === 'aggregation' ? <AggregationTab /> : <RoutingTab />}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button className="inline-flex items-center justify-center px-4 h-9 rounded-lg bg-white text-gray-700 text-xs font-semibold border border-gray-300 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button className="inline-flex items-center justify-center px-4 h-9 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                Save changes
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
