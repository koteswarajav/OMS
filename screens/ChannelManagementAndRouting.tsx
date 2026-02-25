import { useState } from 'react'
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

// ─── Icons (Heroicons inline) ─────────────────────────────────────────────────

function IcoChevron() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
}
function IcoInfo() {
  return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
}
function IcoTrash() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
}
function IcoGrip() {
  return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="7" r="1.5" /><circle cx="15" cy="7" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="17" r="1.5" /><circle cx="15" cy="17" r="1.5" /></svg>
}

// ─── Channel Rows & Cells ─────────────────────────────────────────────────────

function ChannelRow({ ch }: { ch: Channel }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${open ? 'border-gray-200' : 'border-gray-200 hover:border-gray-300'}`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ background: ch.color }}>
          {ch.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold text-gray-900">{ch.name}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{ch.connections.length} connection{ch.connections.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="flex items-center gap-8 flex-shrink-0">
          <div className="w-[140px] text-center">
            <Badge variant={ch.aggregationOn > 0 ? 'success' : 'neutral'}>
              {ch.aggregationOn} on
            </Badge>
          </div>
          <div className="w-[140px] text-center">
            <Badge variant={ch.routingOn > 0 ? 'primary' : 'neutral'}>
              {ch.routingOn} on
            </Badge>
          </div>
        </div>
        <span className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <IcoChevron />
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-200 px-5 py-3.5 flex flex-col gap-3.5 bg-gray-50">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-1.5 px-5">
            Connections
          </div>
          {ch.connections.map(conn => <ConnectionRow key={conn.id} conn={conn} />)}
        </div>
      )}
    </div>
  )
}

function ConnectionRow({ conn }: { conn: Connection }) {
  const [aggOn, setAggOn] = useState(true)
  const [rteOn, setRteOn] = useState(true)

  return (
    <div className="flex items-center gap-3.5 px-5 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-medium text-gray-900">{conn.name}</span>
          <span className="text-[11px] text-gray-500">{conn.app}</span>
          {conn.isCustom && <Badge variant="primary">Custom</Badge>}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[11px] text-gray-500 w-12 text-right">Agg</span>
        <Toggle on={aggOn} onToggle={() => setAggOn(v => !v)} />
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[11px] text-gray-500 w-12 text-right">Route</span>
        <Toggle on={rteOn} onToggle={() => setRteOn(v => !v)} />
      </div>
    </div>
  )
}

function ChannelsTab() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-800 leading-5">
        <IcoInfo />
        <span>Global defaults: Routing → <strong>WMS 1</strong> • Aggregation → <strong>WMS 1</strong></span>
      </div>

      {CHANNELS.map(ch => <ChannelRow key={ch.id} ch={ch} />)}
    </div>
  )
}

// ─── Order Aggregation & Routing Tab ──────────────────────────────────────────

function AggregationAndRoutingTab() {
  const [defaultAggLoc, setDefaultAggLoc] = useState('')
  const [defaultRteLoc, setDefaultRteLoc] = useState('')
  const [allowMulti, setAllowMulti] = useState(false)
  const [allowSplit, setAllowSplit] = useState(false)
  const [rules, setRules] = useState<RoutingRule[]>(DEFAULT_RULES)

  const addRule = () => setRules(r => [
    ...r,
    { id: `r${Date.now()}`, priority: r.length + 1, condField: 'country', condOp: 'equals', condValue: '', action: 'WMS 1' },
  ])
  const removeRule = (id: string) => setRules(r => r.filter(x => x.id !== id).map((x, i) => ({ ...x, priority: i + 1 })))
  const updateRule = (id: string, patch: Partial<RoutingRule>) =>
    setRules(r => r.map(x => x.id === id ? { ...x, ...patch } : x))

  return (
    <div className="flex flex-col gap-8">

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ORDER AGGREGATION SECTION */}
      {/* ═════════════════════════════════════════════════════════════════════ */}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
          <div>
            <div className="text-[13.5px] font-semibold text-gray-900">Order Aggregation</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Configure how orders are batched together</div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">

          {/* ID Format */}
          <div>
            <div className="text-[13.5px] font-semibold text-gray-900 mb-3">Aggregated Order ID Format</div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prefix" hint="Optional prepended string">
                <Input placeholder="e.g. BATCH" defaultValue="BATCH" />
              </Field>
              <Field label="Number of Digits" hint="Zero-padded length">
                <Input type="number" placeholder="6" defaultValue="6" />
              </Field>
              <Field label="Start Value" hint="First numeric value">
                <Input type="number" placeholder="1" defaultValue="1" />
              </Field>
              <Field label="Increment" hint="Step between IDs">
                <Input type="number" placeholder="1" defaultValue="1" />
              </Field>
            </div>
            <div className="mt-4 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-[11px] text-gray-600"><strong>Preview:</strong> BATCH-000001</div>
              <div className="text-[10px] text-gray-400 mt-1">Capacity: 999,999 max orders</div>
            </div>
          </div>

          {/* Aggregation Window */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-[13.5px] font-semibold text-gray-900 mb-3">Aggregation Window</div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-[12.5px] font-medium text-gray-900">Auto-close after</span>
                <span className="text-[12.5px] font-semibold text-gray-900">30 minutes</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-[12.5px] font-medium text-gray-900">Maximum orders per batch</span>
                <span className="text-[12.5px] font-semibold text-gray-900">200 orders</span>
              </div>
            </div>
          </div>

          {/* Default Warehouse for Aggregation */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-[13.5px] font-semibold text-gray-900 mb-3">Default Warehouse</div>
            <Field label="Select default warehouse for Order Aggregation" hint="Used when no aggregation rule matches">
              <Select value={defaultAggLoc} onChange={setDefaultAggLoc}>
                <option value="">— Not set —</option>
                <option value="wms1">WMS 1 - Mumbai Distribution Center</option>
                <option value="wms2">WMS 2 - Delhi Fulfillment Hub</option>
              </Select>
            </Field>
          </div>

        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ORDER ROUTING SECTION */}
      {/* ═════════════════════════════════════════════════════════════════════ */}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
          <div>
            <div className="text-[13.5px] font-semibold text-gray-900">Order Routing</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Configure routing rules and fulfillment strategies</div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">

          {/* Default Warehouse for Routing */}
          <div>
            <div className="text-[13.5px] font-semibold text-gray-900 mb-3">Default Warehouse</div>
            <Field label="Select default warehouse for Order Routing" hint="Fallback location when no routing rule matches">
              <Select value={defaultRteLoc} onChange={setDefaultRteLoc}>
                <option value="">— Not set —</option>
                <option value="wms1">WMS 1 - Mumbai Distribution Center</option>
                <option value="wms2">WMS 2 - Delhi Fulfillment Hub</option>
              </Select>
            </Field>
          </div>

          {/* Split Configuration */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-[13.5px] font-semibold text-gray-900 mb-3">Split Configuration</div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-[12.5px] font-medium text-gray-900">Allow multiple warehouses per order</div>
                  <p className="text-[11px] text-gray-500 mt-1">Different line items in the same order can use different locations</p>
                </div>
                <Toggle on={allowMulti} onToggle={() => { setAllowMulti(v => !v); if (allowMulti) setAllowSplit(false) }} />
              </div>

              <div className={`flex items-start gap-3.5 p-3 bg-gray-50 rounded-lg transition-opacity ${!allowMulti ? 'opacity-50' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-medium text-gray-900">Allow split line items</span>
                    {!allowMulti && <span className="text-[10px] text-gray-400">Requires option above</span>}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">A single line item can be split across locations</p>
                </div>
                <Toggle on={allowSplit} onToggle={() => setAllowSplit(v => !v)} disabled={!allowMulti} />
              </div>
            </div>
          </div>

          {/* Routing Rules */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[13.5px] font-semibold text-gray-900">Routing Rules</div>
                <p className="text-[11px] text-gray-400 mt-0.5">Evaluated in priority order. First match wins.</p>
              </div>
              <Button label="+ Add Rule" variant="secondary" onClick={addRule} />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-2.5 bg-white border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="w-5" />
                <div className="w-6 text-center">#</div>
                <div className="flex-1">Condition</div>
                <div className="w-28">Route To</div>
                <div className="w-6" />
              </div>

              {/* Rows */}
              {rules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <IcoInfo />
                  <p className="text-[12.5px] font-medium text-gray-600 mt-2">No routing rules yet</p>
                  <p className="text-[11px] text-gray-400 mt-1">Orders will use the default warehouse</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {rules.map(rule => (
                    <div key={rule.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-blue-50 transition-colors group">
                      <div className="w-5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IcoGrip />
                      </div>
                      <div className="w-6 text-center">
                        <span className="text-[10px] font-bold bg-gray-200 text-gray-700 rounded-full w-5 h-5 inline-flex items-center justify-center">
                          {rule.priority}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <select
                          value={rule.condField}
                          onChange={e => updateRule(rule.id, { condField: e.target.value })}
                          className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-[11px] font-medium text-gray-900 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="country">Country</option>
                          <option value="tag">Tag</option>
                          <option value="channel">Channel</option>
                        </select>
                        <select
                          value={rule.condOp}
                          onChange={e => updateRule(rule.id, { condOp: e.target.value })}
                          className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-[11px] font-medium text-gray-900 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="equals">equals</option>
                          <option value="not_equals">not equals</option>
                          <option value="contains">contains</option>
                        </select>
                        <input
                          value={rule.condValue}
                          onChange={e => updateRule(rule.id, { condValue: e.target.value })}
                          placeholder="value"
                          className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-[11px] text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <select
                        value={rule.action}
                        onChange={e => updateRule(rule.id, { action: e.target.value })}
                        className="w-28 border border-gray-300 rounded-lg px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="WMS 1">WMS 1</option>
                        <option value="WMS 2">WMS 2</option>
                      </select>

                      <button
                        onClick={() => removeRule(rule.id)}
                        className="w-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <IcoTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-800 leading-5">
        <IcoInfo />
        <span>When no routing or aggregation rule matches, orders automatically use the default warehouse. If not set, orders are held for manual review.</span>
      </div>

    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

type Tab = 'channels' | 'settings'

export default function ChannelManagementAndRouting() {
  const [tab, setTab] = useState<Tab>('channels')

  return (
    <AppShell>
      <div className="flex flex-col gap-5 p-5">

        {/* Page Header */}
        <div>
          <p className="text-[11.5px] text-gray-500 mb-2">Settings / Channel Management</p>
          <h1 className="text-[18px] font-bold tracking-tight text-gray-900">OMS Configuration</h1>
          <p className="text-[12.5px] text-gray-600 mt-1">Manage channel integrations, order aggregation settings, and intelligent routing rules for efficient fulfillment.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200">
          {[
            { id: 'channels', label: 'Channel Management' },
            { id: 'settings', label: 'Order Aggregation & Routing' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`px-0 py-3 text-[12.5px] font-semibold border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {tab === 'channels' && <ChannelsTab />}
          {tab === 'settings' && <AggregationAndRoutingTab />}
        </div>

        {/* Footer */}
        {tab !== 'channels' && (
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 mt-auto">
            <Button label="Cancel" variant="secondary" />
            <Button label="Save changes" variant="primary" />
          </div>
        )}

      </div>
    </AppShell>
  )
}
