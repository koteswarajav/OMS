import { useState, useRef, useEffect } from 'react'
import { AppShell, Button, Card, Input, Toggle, Badge, Field, Select } from '../design-system/components'

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface Connection {
  id: string; name: string; app: string; isCustom?: boolean
}
interface Channel {
  id: string; name: string; initials: string; color: string
  connections: Connection[]
  routingOn: number; aggregationOn: number
}
interface RoutingOverride     { location: string }
interface AggregationOverride { location: string; customer: string }
interface RoutingRule {
  id: string; priority: number
  condField: string; condOp: string; condValue: string
  action: string
}

const GLOBAL = { routing: { location: 'WMS 1' }, aggregation: { location: 'WMS 1' } }

const CHANNELS: Channel[] = [
  { id: 'sh', name: 'Shopify',       initials: 'SH', color: '#10B981',
    routingOn: 3, aggregationOn: 2,
    connections: [
      { id: 'c1', name: 'Shopify US',    app: 'Shopify App' },
      { id: 'c2', name: 'Shopify India', app: 'Shopify App', isCustom: true },
    ]},
  { id: 'bc', name: 'BigCommerce',   initials: 'BC', color: '#7C3AED',
    routingOn: 1, aggregationOn: 1,
    connections: [
      { id: 'c3', name: 'BC Global', app: 'BigCommerce App' },
    ]},
  { id: 'woo', name: 'WooCommerce', initials: 'WC', color: '#2B4FFF',
    routingOn: 2, aggregationOn: 2,
    connections: [
      { id: 'c4', name: 'WooCommerce EU', app: 'WooCommerce App' },
      { id: 'c5', name: 'WooCommerce UK', app: 'WooCommerce App' },
    ]},
]

const DEFAULT_RULES: RoutingRule[] = [
  { id: 'r1', priority: 1, condField: 'country',  condOp: 'equals',      condValue: 'US', action: 'WMS 1' },
  { id: 'r2', priority: 2, condField: 'country',  condOp: 'equals',      condValue: 'IN', action: 'WMS 2' },
  { id: 'r3', priority: 3, condField: 'tag',      condOp: 'contains',    condValue: 'priority', action: 'WMS 1' },
]

// ─── Shared Micro-Components ──────────────────────────────────────────────────

function IcoChevron({ dir = 'down' }: { dir?: 'up' | 'down' | 'right' }) {
  const r = dir === 'up' ? 'rotate-180' : dir === 'right' ? '-rotate-90' : ''
  return (
    <svg className={`w-4 h-4 ${r}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
function IcoPencil() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.36-6.36a2.5 2.5 0 013.536 3.536L12.5 14.5H9v-3.5z" />
    </svg>
  )
}
function IcoTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
function IcoGrip() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="9" cy="7" r="1.5" /><circle cx="15" cy="7" r="1.5" />
      <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="17" r="1.5" /><circle cx="15" cy="17" r="1.5" />
    </svg>
  )
}
function IcoInfo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subtitle}</p>}
    </div>
  )
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg border bg-sky-50 border-sky-200 text-sky-800 text-xs leading-5">
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>{children}</span>
    </div>
  )
}

// ─── Override Popover Cell ────────────────────────────────────────────────────

function OverridePopover({
  open, onClose, title, globalDefault, children, onApply, onReset, hasCustom,
}: {
  open: boolean; onClose: () => void; title: string; globalDefault: string
  children: React.ReactNode; onApply: () => void; onReset?: () => void; hasCustom: boolean
}) {
  if (!open) return null
  return (
    <div className="absolute top-full left-0 mt-1.5 z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2">
        <div className="flex-1">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Global default</div>
          <div className="text-xs font-semibold text-gray-700">{globalDefault}</div>
        </div>
      </div>
      {children}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        {hasCustom
          ? <button onClick={onReset} className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">Reset to global</button>
          : <span />}
        <button onClick={onApply}
          className="px-4 h-7 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Apply
        </button>
      </div>
    </div>
  )
}

function RoutingCell({ override, onSave, onReset }: {
  override: RoutingOverride | null; onSave: (v: RoutingOverride) => void; onReset: () => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ location: '' })
  const ref = useRef<HTMLDivElement>(null)
  const isCustom = override !== null
  const effective = isCustom ? override.location : GLOBAL.routing.location

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setDraft({ location: effective }); setOpen(true) }}
        className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-full text-left transition-all
          ${isCustom ? 'border-blue-200 bg-blue-50 hover:border-blue-300' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}`}
      >
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-semibold truncate ${isCustom ? 'text-blue-700' : 'text-gray-500'}`}>{effective}</div>
          <div className={`text-[10px] mt-0.5 font-medium ${isCustom ? 'text-blue-400' : 'text-gray-400'}`}>
            {isCustom ? '✦ Custom' : '↑ Global'}
          </div>
        </div>
        <span className={`transition-opacity flex-shrink-0 ${isCustom ? 'text-blue-400 opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100'}`}>
          <IcoPencil />
        </span>
      </button>
      <OverridePopover
        open={open} onClose={() => setOpen(false)} title="Routing Override"
        globalDefault={GLOBAL.routing.location} hasCustom={isCustom}
        onApply={() => { onSave(draft); setOpen(false) }}
        onReset={() => { onReset(); setOpen(false) }}
      >
        <Field label="Fulfillment Location" hint="Override for this connection only.">
          <Select value={draft.location} onChange={v => setDraft({ location: v })}>
            <option value="WMS 1">WMS 1</option>
            <option value="WMS 2">WMS 2</option>
          </Select>
        </Field>
      </OverridePopover>
    </div>
  )
}

function AggregationCell({ override, onSave, onReset }: {
  override: AggregationOverride | null; onSave: (v: AggregationOverride) => void; onReset: () => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ location: '', customer: '' })
  const ref = useRef<HTMLDivElement>(null)
  const isCustom = override !== null
  const effective = isCustom ? override.location : GLOBAL.aggregation.location

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setDraft(isCustom ? { ...override! } : { location: GLOBAL.aggregation.location, customer: '' }); setOpen(true) }}
        className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-full text-left transition-all
          ${isCustom ? 'border-blue-200 bg-blue-50 hover:border-blue-300' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}`}
      >
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-semibold truncate ${isCustom ? 'text-blue-700' : 'text-gray-500'}`}>{effective}</div>
          <div className={`text-[10px] mt-0.5 font-medium ${isCustom ? 'text-blue-400' : 'text-gray-400'}`}>
            {isCustom ? '✦ Custom' : '↑ Global'}
          </div>
        </div>
        <span className={`transition-opacity flex-shrink-0 ${isCustom ? 'text-blue-400 opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100'}`}>
          <IcoPencil />
        </span>
      </button>
      <OverridePopover
        open={open} onClose={() => setOpen(false)} title="Aggregation Override"
        globalDefault={GLOBAL.aggregation.location} hasCustom={isCustom}
        onApply={() => { onSave(draft); setOpen(false) }}
        onReset={() => { onReset(); setOpen(false) }}
      >
        <Field label="Fulfillment Location" hint="Override for this connection only.">
          <Select value={draft.location} onChange={v => setDraft(d => ({ ...d, location: v }))}>
            <option value="WMS 1">WMS 1</option>
            <option value="WMS 2">WMS 2</option>
          </Select>
        </Field>
        <Field label="Default Customer" hint="Search by ID, Name, Phone, or Email.">
          <Input
            placeholder="Search customers…"
            value={draft.customer}
            onChange={v => setDraft(d => ({ ...d, customer: v }))}
          />
        </Field>
      </OverridePopover>
    </div>
  )
}

// ─── Connection Row ───────────────────────────────────────────────────────────

function ConnectionRow({ conn }: { conn: Connection }) {
  const [aggOn, setAggOn]   = useState(true)
  const [rteOn, setRteOn]   = useState(true)
  const [rOverride, setRO]  = useState<RoutingOverride | null>(null)
  const [aOverride, setAO]  = useState<AggregationOverride | null>(null)
  const hasOverride = rOverride !== null || aOverride !== null

  return (
    <div className={`flex items-start gap-4 px-5 py-4 border rounded-lg bg-white transition-all
      ${hasOverride ? 'border-blue-200 shadow-sm shadow-blue-100' : 'border-gray-100 hover:border-gray-200'}`}>

      {/* Connection info */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">{conn.name}</span>
          <span className="text-xs text-gray-400">{conn.app}</span>
          {conn.isCustom && <Badge variant="primary">Custom</Badge>}
          {hasOverride && <Badge variant="brand">Has overrides</Badge>}
        </div>
      </div>

      {/* Aggregation column */}
      <div className="w-[160px] flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-gray-500">{aggOn ? 'On' : 'Off'}</span>
          <Toggle on={aggOn} onToggle={() => setAggOn(v => !v)} />
        </div>
        {aggOn && <AggregationCell override={aOverride} onSave={setAO} onReset={() => setAO(null)} />}
      </div>

      {/* Routing column */}
      <div className="w-[140px] flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-gray-500">{rteOn ? 'On' : 'Off'}</span>
          <Toggle on={rteOn} onToggle={() => setRteOn(v => !v)} />
        </div>
        {rteOn && <RoutingCell override={rOverride} onSave={setRO} onReset={() => setRO(null)} />}
      </div>
    </div>
  )
}

// ─── Channel Accordion ────────────────────────────────────────────────────────

function ChannelRow({ ch }: { ch: Channel }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`bg-white border rounded-lg overflow-visible transition-all ${open ? 'border-blue-200 shadow-md shadow-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: ch.color }}>
          {ch.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900">{ch.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{ch.connections.length} connection{ch.connections.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="flex items-center gap-8 flex-shrink-0">
          <div className="w-[160px] flex justify-center">
            <Badge variant={ch.aggregationOn > 0 ? 'success' : 'neutral'}>
              {ch.aggregationOn}/{ch.connections.length} on
            </Badge>
          </div>
          <div className="w-[140px] flex justify-center">
            <Badge variant={ch.routingOn > 0 ? 'primary' : 'neutral'}>
              {ch.routingOn}/{ch.connections.length} on
            </Badge>
          </div>
        </div>
        <span className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <IcoChevron />
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3 bg-gray-50/50">
          <div className="flex items-center px-5 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            <div className="flex-1">Connection</div>
            <div className="w-[160px] text-center">Aggregation</div>
            <div className="w-[140px] text-center">Routing</div>
          </div>
          {ch.connections.map(conn => <ConnectionRow key={conn.id} conn={conn} />)}
        </div>
      )}
    </div>
  )
}

// ─── Channels Tab ─────────────────────────────────────────────────────────────

function ChannelsTab() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2.5 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <IcoInfo />
          <span>Global defaults: <strong className="font-semibold text-gray-900">WMS 1</strong> for both routing &amp; aggregation</span>
        </div>
        <Button label="Manage Connections" variant="secondary" size="sm" />
      </div>

      {/* Table header */}
      <div className="flex items-center px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
        <div className="flex-1">Channel</div>
        <div className="w-[160px] text-center">Aggregation</div>
        <div className="w-[140px] text-center">Routing</div>
        <div className="w-8" />
      </div>

      <div className="flex flex-col gap-3">
        {CHANNELS.map(ch => <ChannelRow key={ch.id} ch={ch} />)}
      </div>
    </div>
  )
}



// ─── Order Routing Tab ────────────────────────────────────────────────────────

function OrderRoutingTab() {
  const [defaultLoc,  setDefaultLoc]  = useState('')
  const [allowMulti,  setAllowMulti]  = useState(false)
  const [allowSplit,  setAllowSplit]  = useState(false)
  const [rules,       setRules]       = useState<RoutingRule[]>(DEFAULT_RULES)

  const addRule = () => setRules(r => [
    ...r,
    { id: `r${Date.now()}`, priority: r.length + 1, condField: 'country', condOp: 'equals', condValue: '', action: 'WMS 1' },
  ])
  const removeRule = (id: string) => setRules(r => r.filter(x => x.id !== id).map((x, i) => ({ ...x, priority: i + 1 })))
  const updateRule = (id: string, patch: Partial<RoutingRule>) =>
    setRules(r => r.map(x => x.id === id ? { ...x, ...patch } : x))

  return (
    <div className="flex flex-col gap-8">

      {/* Default Warehouse Locations */}
      <div>
        <div className="mb-6">
          <h2 className="text-[13.5px] font-semibold text-gray-900">Default Warehouse Locations</h2>
          <p className="text-[11px] text-gray-500 mt-1.5">Set fallback warehouse locations for Order Aggregation and Order Routing when no specific rules apply.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Order Aggregation Default */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-5">
            <div className="mb-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-semibold text-gray-900">Order Aggregation</div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Used when aggregating orders from multiple channels into batches</p>
                </div>
              </div>
            </div>
            <Field label="Default Warehouse" hint="Fallback when no aggregation rule matches">
              <Select value={defaultLoc} onChange={setDefaultLoc} placeholder="Select warehouse…">
                <option value="">— Not set —</option>
                <option value="wms1">WMS 1 - Mumbai Distribution Center</option>
                <option value="wms2">WMS 2 - Delhi Fulfillment Hub</option>
              </Select>
            </Field>
            {defaultLoc && (
              <button onClick={() => setDefaultLoc('')} className="mt-3 text-[11px] text-gray-400 hover:text-red-500 transition-colors font-medium">
                ✕ Clear selection
              </button>
            )}
          </div>

          {/* Order Routing Default */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-5">
            <div className="mb-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-semibold text-gray-900">Order Routing</div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Used when routing orders to fulfillment locations</p>
                </div>
              </div>
            </div>
            <Field label="Default Warehouse" hint="Fallback when no routing rule matches">
              <Select value={defaultLoc} onChange={setDefaultLoc} placeholder="Select warehouse…">
                <option value="">— Not set —</option>
                <option value="wms1">WMS 1 - Mumbai Distribution Center</option>
                <option value="wms2">WMS 2 - Delhi Fulfillment Hub</option>
              </Select>
            </Field>
            {defaultLoc && (
              <button onClick={() => setDefaultLoc('')} className="mt-3 text-[11px] text-gray-400 hover:text-red-500 transition-colors font-medium">
                ✕ Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Info box */}
        <div className="mt-5 flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] leading-relaxed text-sky-800">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>When no specific rule matches an order, it automatically uses the default warehouse location. If not set, orders will be held for manual review.</span>
        </div>
      </div>

      {/* Split Configuration */}
      <div>
        <SectionHeader
          title="Split Configuration"
          subtitle="Control whether orders and line items can span multiple fulfillment locations."
        />
        <Card style={{ padding: 0 }}>
          <div className="divide-y divide-gray-100">

            <div className="flex items-start justify-between gap-6 px-5 py-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">Allow multiple fulfillment locations for an order</div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {allowMulti
                    ? 'Different line items in the same order can use different locations.'
                    : 'The entire order must be fulfilled from a single location.'}
                </p>
              </div>
              <Toggle on={allowMulti} onToggle={() => { setAllowMulti(v => !v); if (allowMulti) setAllowSplit(false) }} />
            </div>

            <div className={`flex items-start justify-between gap-6 px-5 py-4 transition-opacity ${!allowMulti ? 'opacity-50' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900">Allow multiple fulfillment locations for a line item</span>
                  {!allowMulti && (
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {allowSplit
                    ? 'A single line item can be split across locations when inventory is low.'
                    : 'Each line item is fulfilled from one location only.'}
                </p>
                {!allowMulti && <p className="text-xs text-amber-600 mt-1.5 font-medium">Requires "Allow multiple locations for an order" to be enabled.</p>}
              </div>
              <Toggle on={allowSplit} onToggle={() => setAllowSplit(v => !v)} disabled={!allowMulti} />
            </div>

          </div>
        </Card>
      </div>

      {/* Routing Rules */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Routing Rules</h2>
            <p className="text-xs text-gray-500 mt-1">Rules are evaluated in priority order. First match wins.</p>
          </div>
          <Button label="+ Add Rule" variant="secondary" size="sm" onClick={addRule} />
        </div>

        <Card style={{ padding: 0 }}>
          {/* Table header */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wider rounded-t-xl">
            <div className="w-5" />
            <div className="w-8 text-center">#</div>
            <div className="flex-1">Condition</div>
            <div className="w-32">Route To</div>
            <div className="w-8" />
          </div>

          {rules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">No routing rules</p>
              <p className="text-xs text-gray-400 mt-1">All orders will use the default fulfillment location.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors group">
                  <div className="w-5 flex-shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <IcoGrip />
                  </div>
                  <div className="w-8 text-center">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 rounded-full w-5 h-5 inline-flex items-center justify-center">
                      {rule.priority}
                    </span>
                  </div>

                  {/* Condition */}
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <select
                      value={rule.condField}
                      onChange={e => updateRule(rule.id, { condField: e.target.value })}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-32"
                    >
                      <option value="country">Country</option>
                      <option value="tag">Order Tag</option>
                      <option value="channel">Channel</option>
                      <option value="sku">SKU</option>
                      <option value="total">Order Total</option>
                    </select>
                    <select
                      value={rule.condOp}
                      onChange={e => updateRule(rule.id, { condOp: e.target.value })}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-28"
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not equals</option>
                      <option value="contains">contains</option>
                      <option value="starts_with">starts with</option>
                      <option value="greater_than">greater than</option>
                    </select>
                    <input
                      value={rule.condValue}
                      onChange={e => updateRule(rule.id, { condValue: e.target.value })}
                      placeholder="value…"
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1"
                    />
                  </div>

                  {/* Action */}
                  <div className="w-32">
                    <select
                      value={rule.action}
                      onChange={e => updateRule(rule.id, { action: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="WMS 1">WMS 1</option>
                      <option value="WMS 2">WMS 2</option>
                    </select>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="w-8 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <IcoTrash />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {rules.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
              <p className="text-xs text-gray-400">
                <strong className="text-gray-500">{rules.length} rule{rules.length !== 1 ? 's' : ''}</strong> · Drag to reorder priority · Unmatched orders fall back to default location
              </p>
            </div>
          )}
        </Card>
      </div>

    </div>
  )
}

// ─── Combined Settings Tab ────────────────────────────────────────────────────

function OrderAggregationAndRoutingTab() {
  // Aggregation state
  const [prefix,     setPrefix]     = useState('BATCH')
  const [digits,     setDigits]     = useState('6')
  const [startVal,   setStartVal]   = useState('1')
  const [increment,  setIncrement]  = useState('1')

  // Routing state
  const [defaultLoc,  setDefaultLoc]  = useState('')
  const [allowMulti,  setAllowMulti]  = useState(false)
  const [allowSplit,  setAllowSplit]  = useState(false)
  const [rules,       setRules]       = useState<RoutingRule[]>(DEFAULT_RULES)

  const preview = (() => {
    const n = Math.max(1, parseInt(digits) || 6)
    const s = parseInt(startVal) || 1
    return (prefix ? `${prefix}-` : '') + String(s).padStart(n, '0')
  })()

  const addRule = () => setRules(r => [
    ...r,
    { id: `r${Date.now()}`, priority: r.length + 1, condField: 'country', condOp: 'equals', condValue: '', action: 'WMS 1' },
  ])
  const removeRule = (id: string) => setRules(r => r.filter(x => x.id !== id).map((x, i) => ({ ...x, priority: i + 1 })))
  const updateRule = (id: string, patch: Partial<RoutingRule>) =>
    setRules(r => r.map(x => x.id === id ? { ...x, ...patch } : x))

  return (
    <div className="flex flex-col gap-10">

      {/* ═══ ORDER AGGREGATION SECTION ═══════════════════════════════════════════ */}
      
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Order Aggregation</h3>
          <p className="text-sm text-gray-500 mt-1.5">Configure how orders are collected and batched together.</p>
        </div>

        <div className="flex flex-col gap-8">

          {/* ID Format */}
          <div>
            <SectionHeader
              title="Aggregated Order ID Format"
              subtitle="Define how aggregated order IDs are generated. Changes apply to new batches only."
            />
            <Card>
              <div className="grid grid-cols-2 gap-5 p-1">
                <Field label="Prefix" hint="Optional string prefix prepended to the numeric part.">
                  <Input value={prefix} onChange={setPrefix} placeholder="e.g. BATCH" />
                </Field>
                <Field label="Number of Digits" hint="Total digits, zero-padded on the left.">
                  <Input value={digits} onChange={setDigits} type="number" placeholder="6" />
                </Field>
                <Field label="Start Value" hint="First numeric value in the sequence.">
                  <Input value={startVal} onChange={setStartVal} type="number" placeholder="1" />
                </Field>
                <Field label="Increment" hint="Step size between consecutive IDs.">
                  <Input value={increment} onChange={setIncrement} type="number" placeholder="1" />
                </Field>
              </div>

              {/* Preview */}
              <div className="mt-6 pt-6 border-t border-gray-100 px-1">
                <Field label="Live Preview">
                  <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm font-mono font-bold text-blue-700 tracking-widest">{preview}</span>
                    <span className="text-xs text-blue-400 ml-auto">First aggregated order ID</span>
                  </div>
                </Field>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  IDs are left-padded to match Number of Digits. Capacity: {10 ** (parseInt(digits) || 6) - 1} max orders.
                  Alerts trigger at 90% usage.
                </p>
              </div>
            </Card>
          </div>

          {/* Aggregation Window */}
          <div>
            <SectionHeader
              title="Aggregation Window"
              subtitle="Control when orders are collected into a batch."
            />
            <Card>
              <div className="divide-y divide-gray-100">
                {[
                  { label: 'Auto-close after',       value: '30 minutes', hint: 'Batch closes automatically after this duration from the first order.' },
                  { label: 'Maximum orders per batch', value: '200 orders', hint: 'Batch closes when this limit is reached, even before the time window.' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-4 px-1 first:pt-1 last:pb-1">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{row.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{row.hint}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-700 ml-6">{row.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* Visual divider */}
      <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

      {/* ═══ ORDER ROUTING SECTION ════════════════════════════════════════════════ */}

      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Order Routing</h3>
          <p className="text-sm text-gray-500 mt-1.5">Configure routing rules and fulfillment location strategies.</p>
        </div>

        <div className="flex flex-col gap-8">

          {/* Default Fulfillment Location */}
          <div>
            <SectionHeader
              title="Default Fulfillment Location"
              subtitle="Fallback location used when no routing rule matches an order."
            />
            <Card>
              <div className="p-1">
                <Field label="Default Fulfillment Location" hint="If not set, unmatched orders are held for manual review.">
                  <Select value={defaultLoc} onChange={setDefaultLoc} placeholder="Search fulfillment locations…">
                    <option value="wms1">WMS 1</option>
                    <option value="wms2">WMS 2</option>
                  </Select>
                </Field>
                {defaultLoc && (
                  <button onClick={() => setDefaultLoc('')} className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
                    ✕ Clear selection
                  </button>
                )}
              </div>
            </Card>
          </div>

          {/* Split Configuration */}
          <div>
            <SectionHeader
              title="Split Configuration"
              subtitle="Control whether orders and line items can span multiple fulfillment location."
            />
            <Card style={{ padding: 0 }}>
              <div className="divide-y divide-gray-100">

                <div className="flex items-start justify-between gap-6 px-5 py-4">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Allow multiple fulfillment locations for an order</div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {allowMulti
                        ? 'Different line items in the same order can use different locations.'
                        : 'The entire order must be fulfilled from a single location.'}
                    </p>
                  </div>
                  <Toggle on={allowMulti} onToggle={() => { setAllowMulti(v => !v); if (allowMulti) setAllowSplit(false) }} />
                </div>

                <div className={`flex items-start justify-between gap-6 px-5 py-4 transition-opacity ${!allowMulti ? 'opacity-50' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900">Allow multiple fulfillment locations for a line item</span>
                      {!allowMulti && (
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {allowSplit
                        ? 'A single line item can be split across locations when inventory is low.'
                        : 'Each line item is fulfilled from one location only.'}
                    </p>
                    {!allowMulti && <p className="text-xs text-amber-600 mt-1.5 font-medium">Requires "Allow multiple locations for an order" to be enabled.</p>}
                  </div>
                  <Toggle on={allowSplit} onToggle={() => setAllowSplit(v => !v)} disabled={!allowMulti} />
                </div>

              </div>
            </Card>
          </div>

          {/* Routing Rules */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Routing Rules</h2>
                <p className="text-xs text-gray-500 mt-1">Rules are evaluated in priority order. First match wins.</p>
              </div>
              <Button label="+ Add Rule" variant="secondary" size="sm" onClick={addRule} />
            </div>

            <Card style={{ padding: 0 }}>
              {/* Table header */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wider rounded-t-xl">
                <div className="w-5" />
                <div className="w-8 text-center">#</div>
                <div className="flex-1">Condition</div>
                <div className="w-32">Route To</div>
                <div className="w-8" />
              </div>

              {rules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No routing rules</p>
                  <p className="text-xs text-gray-400 mt-1">All orders will use the default fulfillment location.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {rules.map(rule => (
                    <div key={rule.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors group">
                      <div className="w-5 flex-shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                        <IcoGrip />
                      </div>
                      <div className="w-8 text-center">
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 rounded-full w-5 h-5 inline-flex items-center justify-center">
                          {rule.priority}
                        </span>
                      </div>

                      {/* Condition */}
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <select
                          value={rule.condField}
                          onChange={e => updateRule(rule.id, { condField: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-32"
                        >
                          <option value="country">Country</option>
                          <option value="tag">Order Tag</option>
                          <option value="channel">Channel</option>
                          <option value="sku">SKU</option>
                          <option value="total">Order Total</option>
                        </select>
                        <select
                          value={rule.condOp}
                          onChange={e => updateRule(rule.id, { condOp: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-28"
                        >
                          <option value="equals">equals</option>
                          <option value="not_equals">not equals</option>
                          <option value="contains">contains</option>
                          <option value="starts_with">starts with</option>
                          <option value="greater_than">greater than</option>
                        </select>
                        <input
                          value={rule.condValue}
                          onChange={e => updateRule(rule.id, { condValue: e.target.value })}
                          placeholder="value…"
                          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1"
                        />
                      </div>

                      {/* Action */}
                      <div className="w-32">
                        <select
                          value={rule.action}
                          onChange={e => updateRule(rule.id, { action: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="WMS 1">WMS 1</option>
                          <option value="WMS 2">WMS 2</option>
                        </select>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="w-8 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <IcoTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              {rules.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                  <p className="text-xs text-gray-400">
                    <strong className="text-gray-500">{rules.length} rule{rules.length !== 1 ? 's' : ''}</strong> · Drag to reorder priority · Unmatched orders fall back to default location
                  </p>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>

    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

type Tab = 'channels' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'channels', label: 'Channel Management' },
  { id: 'settings', label: 'Order Aggregation and Order Routing' },
]

export default function ChannelManagementAndRouting() {
  const [tab, setTab] = useState<Tab>('channels')

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-8 pt-8 pb-16">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-xs text-gray-400 mb-3">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Settings</span>
            <span className="mx-1.5 text-gray-300">/</span>
            <span className="text-gray-600 font-medium">Channel Management</span>
          </p>
          <div className="flex items-end justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Channel Management</h1>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">
                Configure which connections participate in order aggregation and routing, and define global rules.
              </p>
            </div>
            <Badge variant="brand">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Active subscriptions only
            </Badge>
          </div>
        </div>

        {/* Tab bar */}
        <div className="border-b border-gray-200 mb-8 -mx-1 px-1">
          <div className="flex gap-0">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors
                  ${tab === t.id
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="min-h-96">
          {tab === 'channels' && <ChannelsTab />}
          {tab === 'settings' && <OrderAggregationAndRoutingTab />}
        </div>

        {/* Footer actions — only on config tabs */}
        {tab !== 'channels' && (
          <div className="flex items-center justify-end gap-3 mt-12 pt-8 border-t border-gray-200">
            <Button label="Cancel" variant="secondary" />
            <Button label="Save changes" variant="primary" />
          </div>
        )}

      </div>
    </AppShell>
  )
}
