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

// ─── Icons ────────────────────────────────────────────────────────────────────

function IcoChevron() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="9" cy="7" r="1.5" /><circle cx="15" cy="7" r="1.5" />
      <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="17" r="1.5" /><circle cx="15" cy="17" r="1.5" />
    </svg>
  )
}
function IcoInfo() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  )
}

// ─── Shared Components ────────────────────────────────────────────────────────

function OverridePopover({
  open, onClose, title, globalDefault, children, onApply, onReset, hasCustom,
}: {
  open: boolean; onClose: () => void; title: string; globalDefault: string
  children: React.ReactNode; onApply: () => void; onReset?: () => void; hasCustom: boolean
}) {
  if (!open) return null
  return (
    <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="px-3.5 py-2.5 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2">
        <div className="flex-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Global default</div>
          <div className="text-[13.5px] font-semibold text-gray-900">{globalDefault}</div>
        </div>
      </div>
      {children}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        {hasCustom
          ? <button onClick={onReset} className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">Reset to global</button>
          : <span />}
        <button onClick={onApply}
          className="px-4 h-8 bg-blue-600 text-white text-[12.5px] font-semibold rounded-lg hover:bg-blue-700 active:translate-y-0 transition-all">
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
        className={`group flex items-center gap-1.5 px-3 py-2 rounded-lg border w-full text-left transition-all
          ${isCustom ? 'border-blue-300 bg-blue-50 hover:border-blue-400' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
      >
        <div className="flex-1 min-w-0">
          <div className={`text-[11.5px] font-semibold truncate ${isCustom ? 'text-blue-700' : 'text-gray-600'}`}>{effective}</div>
          <div className={`text-[10px] mt-0.5 font-medium ${isCustom ? 'text-blue-600' : 'text-gray-400'}`}>
            {isCustom ? '✦ Custom' : '↑ Global'}
          </div>
        </div>
        <span className={`transition-opacity flex-shrink-0 ${isCustom ? 'text-blue-600 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}>
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
        onClick={() => { setDraft({ location: effective, customer: override?.customer || '' }); setOpen(true) }}
        className={`group flex items-center gap-1.5 px-3 py-2 rounded-lg border w-full text-left transition-all
          ${isCustom ? 'border-blue-300 bg-blue-50 hover:border-blue-400' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
      >
        <div className="flex-1 min-w-0">
          <div className={`text-[11.5px] font-semibold truncate ${isCustom ? 'text-blue-700' : 'text-gray-600'}`}>{effective}</div>
          <div className={`text-[10px] mt-0.5 font-medium ${isCustom ? 'text-blue-600' : 'text-gray-400'}`}>
            {isCustom ? '✦ Custom' : '↑ Global'}
          </div>
        </div>
        <span className={`transition-opacity flex-shrink-0 ${isCustom ? 'text-blue-600 opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}>
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
          <Select value={draft.location} onChange={v => setDraft({ ...draft, location: v })}>
            <option value="WMS 1">WMS 1</option>
            <option value="WMS 2">WMS 2</option>
          </Select>
        </Field>
        <Field label="Customer Type" hint="Optional: apply only for specific customer segments.">
          <Input value={draft.customer} onChange={e => setDraft({ ...draft, customer: e.target.value })} placeholder="e.g. B2B, Enterprise" />
        </Field>
      </OverridePopover>
    </div>
  )
}

// ─── Channel Management Tab ────────────────────────────────────────────────────

function ChannelsTab() {
  return (
    <div className="flex flex-col gap-4">
      
      {/* Info alert */}
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-sky-50 border border-sky-200">
        <IcoInfo />
        <p className="text-[11px] leading-5 text-sky-800">
          <span className="font-semibold">Global defaults:</span> Routing → <span className="font-semibold">{GLOBAL.routing.location}</span>, Aggregation → <span className="font-semibold">{GLOBAL.aggregation.location}</span>
        </p>
      </div>

      {/* Channels list */}
      <div className="flex flex-col gap-3.5">
        {CHANNELS.map(ch => <ChannelRow key={ch.id} ch={ch} />)}
      </div>
    </div>
  )
}

function ChannelRow({ ch }: { ch: Channel }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${open ? 'border-blue-300 shadow-[0_1px_3px_rgba(0,0,0,.06)]' : 'border-gray-200 hover:border-gray-300'}`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: ch.color }}>
          {ch.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold text-gray-900">{ch.name}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{ch.connections.length} connection{ch.connections.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="flex items-center gap-8 flex-shrink-0 ml-4">
          <div className="text-right">
            <div className="text-[12.5px] font-semibold text-gray-900">{ch.aggregationOn}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Agg. on</div>
          </div>
          <div className="text-right">
            <div className="text-[12.5px] font-semibold text-gray-900">{ch.routingOn}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Route on</div>
          </div>
        </div>
        <span className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ml-2 ${open ? 'rotate-180' : ''}`}>
          <IcoChevron />
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-200 bg-white px-5 py-3.5 flex flex-col gap-3.5">
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <div>Connection</div>
            <div className="text-center">Aggregation</div>
            <div className="text-center">Routing</div>
          </div>
          <div className="flex flex-col gap-3">
            {ch.connections.map(conn => <ConnectionRow key={conn.id} conn={conn} />)}
          </div>
        </div>
      )}
    </div>
  )
}

function ConnectionRow({ conn }: { conn: Connection }) {
  const [aggOn, setAggOn]   = useState(true)
  const [rteOn, setRteOn]   = useState(true)
  const [rOverride, setRO]  = useState<RoutingOverride | null>(null)
  const [aOverride, setAO]  = useState<AggregationOverride | null>(null)
  const hasOverride = rOverride !== null || aOverride !== null

  return (
    <div className={`grid grid-cols-3 gap-3 items-start px-4 py-3.5 bg-gray-50 border rounded-lg transition-all
      ${hasOverride ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>

      {/* Connection info */}
      <div className="flex items-start gap-3 col-span-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-medium text-gray-900 truncate">{conn.name}</div>
          <div className="text-[10px] text-gray-500 mt-1">{conn.app}</div>
          {conn.isCustom && <Badge variant="primary" style={{ marginTop: '6px' }}>Custom</Badge>}
        </div>
      </div>

      {/* Aggregation column */}
      <div className="col-span-1">
        <div className="flex flex-col items-center gap-2">
          <Toggle on={aggOn} onToggle={() => setAggOn(v => !v)} />
          {aggOn && <AggregationCell override={aOverride} onSave={setAO} onReset={() => setAO(null)} />}
        </div>
      </div>

      {/* Routing column */}
      <div className="col-span-1">
        <div className="flex flex-col items-center gap-2">
          <Toggle on={rteOn} onToggle={() => setRteOn(v => !v)} />
          {rteOn && <RoutingCell override={rOverride} onSave={setRO} onReset={() => setRO(null)} />}
        </div>
      </div>
    </div>
  )
}

// ─── Order Aggregation and Routing Tab ─────────────────────────────────────────

function OrderAggregationAndRoutingTab() {
  const [defaultLocAgg, setDefaultLocAgg]   = useState('wms1')
  const [defaultLocRoute, setDefaultLocRoute] = useState('wms1')
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
    <div className="flex flex-col gap-12">

      {/* ═══ ORDER AGGREGATION ════════════════════════════════════════════════════ */}
      
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Order Aggregation</h2>
          <p className="text-[12.5px] text-gray-600 mt-2">Configure how orders are collected from multiple channels and batched together.</p>
        </div>

        <div className="flex flex-col gap-3.5">

          {/* Aggregated Order ID Format */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                <div>
                  <div className="text-[13.5px] font-semibold text-gray-900">Aggregated Order ID Format</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">How aggregated order IDs are generated</div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="ID Prefix" hint="Optional string before the numeric part">
                  <Input placeholder="BATCH" defaultValue="BATCH" />
                </Field>
                <Field label="Number of Digits" hint="Total digits, zero-padded">
                  <Input placeholder="6" defaultValue="6" type="number" />
                </Field>
                <Field label="Start Value" hint="First numeric value">
                  <Input placeholder="1" defaultValue="1" type="number" />
                </Field>
                <Field label="Increment" hint="Step size between IDs">
                  <Input placeholder="1" defaultValue="1" type="number" />
                </Field>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="px-3.5 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-[11px] text-blue-900">
                    <div className="font-mono font-bold text-blue-700 mb-1">BATCH-000001</div>
                    <div>First aggregated order ID preview</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aggregation Window */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                <div>
                  <div className="text-[13.5px] font-semibold text-gray-900">Aggregation Window</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">When orders are collected into a batch</div>
                </div>
              </div>
            </div>
            <div className="p-5 divide-y divide-gray-200">
              <div className="flex items-start justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex-1 pr-4">
                  <div className="text-[12.5px] font-semibold text-gray-900">Auto-close after</div>
                  <div className="text-[11px] text-gray-500 mt-1">Batch closes automatically after this duration from first order</div>
                </div>
                <div className="text-[12.5px] font-semibold text-gray-900 flex-shrink-0">30 minutes</div>
              </div>
              <div className="flex items-start justify-between py-3.5">
                <div className="flex-1 pr-4">
                  <div className="text-[12.5px] font-semibold text-gray-900">Maximum orders per batch</div>
                  <div className="text-[11px] text-gray-500 mt-1">Batch closes when this limit is reached</div>
                </div>
                <div className="text-[12.5px] font-semibold text-gray-900 flex-shrink-0">200 orders</div>
              </div>
            </div>
          </div>

          {/* Default Warehouse Location for Aggregation */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                <div>
                  <div className="text-[13.5px] font-semibold text-gray-900">Default Warehouse Location</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Fallback when no aggregation rule matches</div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <Field label="Warehouse" hint="Used when no aggregation rule matches an order">
                <Select value={defaultLocAgg} onChange={setDefaultLocAgg}>
                  <option value="wms1">WMS 1 - Mumbai Distribution</option>
                  <option value="wms2">WMS 2 - Delhi Fulfillment</option>
                </Select>
              </Field>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  When no specific aggregation rule matches an order, it automatically uses this warehouse location. If not set, orders will be held for manual review.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Visual divider */}
      <div className="h-px bg-gray-200" />

      {/* ═══ ORDER ROUTING ════════════════════════════════════════════════════════ */}

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Order Routing</h2>
          <p className="text-[12.5px] text-gray-600 mt-2">Configure how orders are routed to different fulfillment locations based on conditions.</p>
        </div>

        <div className="flex flex-col gap-3.5">

          {/* Default Warehouse Location for Routing */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                <div>
                  <div className="text-[13.5px] font-semibold text-gray-900">Default Warehouse Location</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Fallback when no routing rule matches</div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <Field label="Warehouse" hint="Used when no routing rule matches an order">
                <Select value={defaultLocRoute} onChange={setDefaultLocRoute}>
                  <option value="wms1">WMS 1 - Mumbai Distribution</option>
                  <option value="wms2">WMS 2 - Delhi Fulfillment</option>
                </Select>
              </Field>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  When no routing rule matches an order, it automatically uses this warehouse location. If not set, orders will be held for manual review.
                </p>
              </div>
            </div>
          </div>

          {/* Split Configuration */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                <div>
                  <div className="text-[13.5px] font-semibold text-gray-900">Split Configuration</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Whether orders can span multiple locations</div>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">

              <div className="flex items-start justify-between gap-6 px-5 py-3.5">
                <div className="flex-1">
                  <div className="text-[12.5px] font-semibold text-gray-900">Allow multiple fulfillment locations for an order</div>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    {allowMulti
                      ? 'Different line items in the same order can use different locations.'
                      : 'The entire order must be fulfilled from a single location.'}
                  </p>
                </div>
                <Toggle on={allowMulti} onToggle={() => { setAllowMulti(v => !v); if (allowMulti) setAllowSplit(false) }} />
              </div>

              <div className={`flex items-start justify-between gap-6 px-5 py-3.5 transition-opacity ${!allowMulti ? 'opacity-50' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12.5px] font-semibold text-gray-900">Allow multiple locations per line item</span>
                    {!allowMulti && (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    {allowSplit
                      ? 'A single line item can be split across locations when inventory is low.'
                      : 'Each line item is fulfilled from one location only.'}
                  </p>
                  {!allowMulti && <p className="text-[11px] text-amber-600 mt-2 font-medium">Requires order splitting to be enabled first.</p>}
                </div>
                <Toggle on={allowSplit} onToggle={() => setAllowSplit(v => !v)} disabled={!allowMulti} />
              </div>

            </div>
          </div>

          {/* Routing Rules */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13.5px] font-semibold text-gray-900">Routing Rules</h3>
                <p className="text-[11px] text-gray-500 mt-1">Rules are evaluated in priority order. First match wins.</p>
              </div>
              <Button label="+ Add Rule" variant="secondary" size="sm" onClick={addRule} />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="flex items-center gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="w-4" />
                <div className="w-8 text-center">#</div>
                <div className="flex-1">Condition</div>
                <div className="w-32">Route To</div>
                <div className="w-8" />
              </div>

              {rules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-[13.5px] font-semibold text-gray-900">No routing rules</p>
                  <p className="text-[11px] text-gray-500 mt-1">All orders will use the default fulfillment location.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {rules.map(rule => (
                    <div key={rule.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                      <div className="w-4 flex-shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                        <IcoGrip />
                      </div>
                      <div className="w-8 text-center">
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-200 rounded-full w-5 h-5 inline-flex items-center justify-center">
                          {rule.priority}
                        </span>
                      </div>

                      {/* Condition */}
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <select
                          value={rule.condField}
                          onChange={e => updateRule(rule.id, { condField: e.target.value })}
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer w-32"
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
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer w-28"
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
                          placeholder="value"
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-[12.5px] text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0 flex-1 placeholder:text-gray-300"
                        />
                      </div>

                      {/* Action */}
                      <div className="w-32">
                        <select
                          value={rule.action}
                          onChange={e => updateRule(rule.id, { action: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-blue-700 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                          <option value="WMS 1">WMS 1</option>
                          <option value="WMS 2">WMS 2</option>
                        </select>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="w-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <IcoTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              {rules.length > 0 && (
                <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200">
                  <p className="text-[11px] text-gray-500">
                    <strong className="text-gray-600">{rules.length} rule{rules.length !== 1 ? 's' : ''}</strong> · Drag to reorder · Unmatched orders use default location
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────────

type Tab = 'channels' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'channels', label: 'Channel Management' },
  { id: 'settings', label: 'Order Aggregation and Order Routing' },
]

export default function ChannelManagementAndRouting() {
  const [tab, setTab] = useState<Tab>('channels')

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-5 pt-5 pb-16">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] text-gray-500 mb-3 uppercase tracking-widest font-semibold">
            <span className="hover:text-gray-600 cursor-pointer transition-colors">Settings</span>
            <span className="mx-1.5 text-gray-300">/</span>
            <span className="text-gray-600">Channel Management</span>
          </p>
          <div className="flex items-end justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-[18px] font-bold tracking-tight text-gray-900">Channel Management</h1>
              <p className="text-[12.5px] text-gray-600 mt-2 leading-relaxed max-w-2xl">
                Configure which connections participate in order aggregation and routing, and define global rules.
              </p>
            </div>
            <Badge variant="primary">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
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
                className={`px-4 py-3 text-[12.5px] font-semibold border-b-2 transition-colors
                  ${tab === t.id
                    ? 'border-blue-600 text-blue-600'
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
