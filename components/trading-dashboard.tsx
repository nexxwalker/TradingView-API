'use client'

import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Command,
  Crosshair,
  Gauge,
  Layers3,
  LineChart,
  Menu,
  Play,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Wallet,
  Target,
  Grid2X2,
  ArrowUpDown,
  X,
} from 'lucide-react'

const chartData = [
  { time: '09:30', price: 186.1, volume: 42 },
  { time: '10:00', price: 187.4, volume: 56 },
  { time: '10:30', price: 186.8, volume: 38 },
  { time: '11:00', price: 188.7, volume: 63 },
  { time: '11:30', price: 189.4, volume: 48 },
  { time: '12:00', price: 188.9, volume: 34 },
  { time: '12:30', price: 190.5, volume: 71 },
  { time: '13:00', price: 191.2, volume: 59 },
  { time: '13:30', price: 190.7, volume: 43 },
  { time: '14:00', price: 192.5, volume: 78 },
  { time: '14:30', price: 193.1, volume: 66 },
  { time: '15:00', price: 192.8, volume: 50 },
  { time: '15:30', price: 194.14, volume: 84 },
]

const tickPreview = [
  { digit: 0, percent: '10.4%', tone: 'muted' },
  { digit: 1, percent: '10.8%', tone: 'muted' },
  { digit: 2, percent: '11.2%', tone: 'muted' },
  { digit: 3, percent: '6.6%', tone: 'loss' },
  { digit: 4, percent: '8.4%', tone: 'muted' },
  { digit: 5, percent: '9.4%', tone: 'muted' },
  { digit: 6, percent: '10.6%', tone: 'muted' },
  { digit: 7, percent: '11.0%', tone: 'warning' },
  { digit: 8, percent: '10.0%', tone: 'muted' },
  { digit: 9, percent: '11.6%', tone: 'win' },
]

const symbols = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: '194.14', change: '+1.32%', positive: true },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', price: '142.91', change: '+2.84%', positive: true },
  { ticker: 'TSLA', name: 'Tesla Inc.', price: '343.27', change: '-0.67%', positive: false },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: '418.79', change: '+0.44%', positive: true },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', price: '231.12', change: '+1.06%', positive: true },
]

const indicators = [
  { label: 'RSI (14)', value: '63.48', note: 'Neutral', tone: 'neutral' },
  { label: 'MACD', value: '1.82', note: 'Bullish', tone: 'positive' },
  { label: 'Stoch RSI', value: '78.24', note: 'Overbought', tone: 'warning' },
  { label: 'ADX (14)', value: '31.76', note: 'Strong trend', tone: 'positive' },
]

export function TradingDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [timeframe, setTimeframe] = useState('1D')
  const [tradeType, setTradeType] = useState('Even/Odd')
  const [mobileNav, setMobileNav] = useState(false)
  const active = symbols.find((item) => item.ticker === selectedSymbol) ?? symbols[0]
  const chartColor = '#5eead4'
  const summary = useMemo(() => (selectedSymbol === 'AAPL' ? 'Market open · data from TradingView' : 'Streaming quote · data from TradingView'), [selectedSymbol])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-7">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation">
            {mobileNav ? <X /> : <Menu />}
          </button>
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Activity className="size-5" /></div>
          <div><p className="font-mono text-sm font-semibold tracking-tight">PULSE / TERMINAL</p><p className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">TradingView workspace</p></div>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground md:flex"><Command className="size-3.5" /> <span>Search markets</span><kbd className="ml-5 rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">⌘ K</kbd></div>
        <div className="flex items-center gap-2"><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Notifications"><Bell className="size-4" /></button><div className="hidden h-7 w-px bg-border sm:block" /><div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5"><div className="size-6 rounded-full bg-primary/20 text-center font-mono text-[10px] leading-6 text-primary">MK</div><span className="hidden text-xs font-medium sm:block">Maya Kim</span><ChevronDown className="size-3.5 text-muted-foreground" /></div></div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className={`${mobileNav ? 'flex' : 'hidden'} absolute inset-x-0 top-16 z-10 min-h-[calc(100vh-4rem)] flex-col border-r border-border bg-background p-4 md:relative md:top-0 md:flex md:w-60 md:shrink-0 md:bg-transparent md:p-5`}>
          <nav className="flex flex-col gap-1">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
            <NavItem icon={<LineChart />} label="Markets" active /><NavItem icon={<Layers3 />} label="Watchlists" /><NavItem icon={<Bell />} label="Alerts" />
            <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Research</p>
            <NavItem icon={<Gauge />} label="Backtesting" /><NavItem icon={<BarChart3 />} label="Performance" /><NavItem icon={<Sparkles />} label="AI insights" />
          </nav>
          <div className="mt-auto hidden rounded-xl border border-border bg-card p-4 md:block"><div className="mb-3 flex items-center gap-2 text-primary"><CircleDollarSign className="size-4" /><span className="text-xs font-semibold">Pro workspace</span></div><p className="text-xs leading-5 text-muted-foreground">Unlock advanced indicators and unlimited strategy runs.</p><button className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Upgrade plan</button></div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 md:px-7 md:py-7">
          <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><span>Workspace</span><span>/</span><span className="text-foreground">Markets overview</span></div><h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Good morning, Maya</h1><p className="mt-1 text-sm text-muted-foreground">A focused view of what is moving across your watchlist.</p></div><div className="flex items-center gap-2"><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"><Plus className="size-3.5" /> Add symbol</button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Play className="size-3.5 fill-current" /> Run backtest</button></div></div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Portfolio value" value="$128,492.80" detail="+$4,218.40 (3.39%)" positive icon={<Wallet />} />
            <MetricCard label="Day's P&L" value="+$1,284.22" detail="+1.01% today" positive icon={<TrendingUp />} />
            <MetricCard label="Buying power" value="$42,760.10" detail="Available to trade" icon={<CircleDollarSign />} />
            <MetricCard label="Market breadth" value="68.4%" detail="Advancing stocks" positive icon={<BarChart3 />} />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 rounded-xl border border-border bg-card">
              <div className="flex flex-col gap-4 border-b border-border p-4 md:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary">{active.ticker.slice(0, 2)}</div><div><div className="flex items-center gap-2"><h2 className="font-mono text-lg font-semibold">{active.ticker}</h2><span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">NASDAQ</span></div><p className="text-xs text-muted-foreground">{active.name} · {summary}</p></div></div><div className="text-right"><p className="font-mono text-2xl font-semibold tracking-tight">${active.price}</p><p className={`text-xs font-medium ${active.positive ? 'text-primary' : 'text-destructive'}`}>{active.positive ? '▲' : '▼'} {active.change} today</p></div></div><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-1 rounded-lg bg-muted p-1">{['1H', '4H', '1D', '1W', '1M'].map((item) => <button key={item} onClick={() => setTimeframe(item)} className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${timeframe === item ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>{item}</button>)}</div><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><button className="rounded p-1.5 hover:bg-muted"><Crosshair className="size-4" /></button><button className="rounded p-1.5 hover:bg-muted"><SlidersHorizontal className="size-4" /></button><span className="ml-2 flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-primary" />Live</span></div></div></div>
              <div className="h-[340px] p-3 md:h-[410px] md:p-5"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={chartColor} stopOpacity={0.25} /><stop offset="100%" stopColor={chartColor} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" /><XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} /><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']} /><ReferenceLine y={190} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" /><Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fill="url(#priceFill)" dot={false} /></AreaChart></ResponsiveContainer></div>
              <div className="grid grid-cols-3 border-t border-border text-center"><div className="p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Open</p><p className="mt-1 font-mono text-sm">$192.18</p></div><div className="border-x border-border p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">High</p><p className="mt-1 font-mono text-sm text-primary">$194.62</p></div><div className="p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Low</p><p className="mt-1 font-mono text-sm text-destructive">$191.84</p></div></div>
            </div>

            <div className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border p-4"><div><h2 className="text-sm font-semibold">Technical signals</h2><p className="mt-1 text-xs text-muted-foreground">{active.ticker} · {timeframe} timeframe</p></div><button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Configure indicators"><Settings2 className="size-4" /></button></div><div className="flex flex-col gap-1 p-3">{indicators.map((indicator) => <div key={indicator.label} className="flex items-center justify-between rounded-lg p-3 hover:bg-muted"><div><p className="text-xs font-medium">{indicator.label}</p><p className={`mt-1 text-[11px] ${indicator.tone === 'positive' ? 'text-primary' : indicator.tone === 'warning' ? 'text-warning' : 'text-muted-foreground'}`}>{indicator.note}</p></div><span className="font-mono text-sm font-semibold">{indicator.value}</span></div>)}</div><div className="mx-4 mb-4 rounded-lg bg-muted p-3"><div className="flex items-center gap-2 text-xs font-medium"><Sparkles className="size-3.5 text-primary" /> Signal summary</div><p className="mt-2 text-xs leading-5 text-muted-foreground">Momentum is positive, but RSI suggests the move may be extended near-term.</p></div></div>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-card p-2 md:p-3">
            <div className="flex items-center justify-center gap-1 overflow-x-auto" role="tablist" aria-label="Trade types">
              {['Matches/Differs', 'Even/Odd', 'Over/Under'].map((type) => <button key={type} role="tab" aria-selected={tradeType === type} onClick={() => setTradeType(type)} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${tradeType === type ? 'bg-primary/10 text-foreground ring-1 ring-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{type === 'Even/Odd' ? <Grid2X2 className="size-4" /> : type === 'Matches/Differs' ? <Target className="size-4" /> : <ArrowUpDown className="size-4" />}<span>{type}</span></button>)}
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Last ticks</h2><p className="mt-1 text-xs text-muted-foreground">Digit distribution · {tradeType}</p></div><span className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground">100%</span></div>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">{tickPreview.map((tick) => <div key={tick.digit} className="relative flex flex-col items-center gap-1.5"><div className={`relative flex size-12 items-center justify-center rounded-full border-4 border-muted font-mono text-base font-semibold ${tick.tone === 'win' ? 'border-t-primary text-primary' : tick.tone === 'loss' ? 'border-t-destructive text-destructive' : tick.tone === 'warning' ? 'border-t-warning text-foreground' : 'border-t-border text-foreground'}`}><span>{tick.digit}</span></div><span className={`font-mono text-[11px] ${tick.tone === 'win' ? 'text-primary' : tick.tone === 'loss' ? 'text-destructive' : 'text-muted-foreground'}`}>{tick.percent}</span>{tick.tone === 'warning' && <span className="absolute -bottom-3 text-warning">▼</span>}</div>)}</div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><Watchlist selectedSymbol={selectedSymbol} onSelect={setSelectedSymbol} /><BacktestCard /></div>
        </section>
      </div>
    </main>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) { return <button className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{icon}<span>{label}</span>{active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}</button> }
function MetricCard({ label, value, detail, positive, icon }: { label: string; value: string; detail: string; positive?: boolean; icon: React.ReactNode }) { return <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><span className="text-muted-foreground">{icon}</span></div><p className="mt-4 font-mono text-xl font-semibold tracking-tight">{value}</p><p className={`mt-1 text-xs ${positive ? 'text-primary' : 'text-muted-foreground'}`}>{detail}</p></div> }
function Watchlist({ selectedSymbol, onSelect }: { selectedSymbol: string; onSelect: (symbol: string) => void }) { return <div className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border p-4"><div><h2 className="text-sm font-semibold">Market watchlist</h2><p className="mt-1 text-xs text-muted-foreground">5 symbols · synced with TradingView</p></div><button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Search watchlist"><Search className="size-4" /></button></div><div className="divide-y divide-border">{symbols.map((symbol) => <button key={symbol.ticker} onClick={() => onSelect(symbol.ticker)} className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted ${selectedSymbol === symbol.ticker ? 'bg-primary/5' : ''}`}><div className="flex items-center gap-3"><div className={`flex size-8 items-center justify-center rounded-md font-mono text-[10px] font-bold ${selectedSymbol === symbol.ticker ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>{symbol.ticker.slice(0, 2)}</div><div><p className="font-mono text-xs font-semibold">{symbol.ticker}</p><p className="text-[11px] text-muted-foreground">{symbol.name}</p></div></div><div className="text-right"><p className="font-mono text-xs font-medium">${symbol.price}</p><p className={`mt-0.5 text-[11px] ${symbol.positive ? 'text-primary' : 'text-destructive'}`}>{symbol.change}</p></div></button>)}</div></div> }
function BacktestCard() { return <div className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border p-4"><div><h2 className="text-sm font-semibold">Strategy performance</h2><p className="mt-1 text-xs text-muted-foreground">Momentum crossover · AAPL · 1D</p></div><span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">Backtest complete</span></div><div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4"><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Net return</p><p className="mt-1 font-mono text-lg font-semibold text-primary">+28.64%</p></div><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Win rate</p><p className="mt-1 font-mono text-lg font-semibold">64.2%</p></div><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Max drawdown</p><p className="mt-1 font-mono text-lg font-semibold text-destructive">-8.31%</p></div><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Trades</p><p className="mt-1 font-mono text-lg font-semibold">142</p></div></div><div className="mx-4 mb-4 flex items-center justify-between rounded-lg border border-border p-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5" /> Jan 2023 — Jan 2025</div><button className="text-xs font-medium text-primary hover:underline">View report</button></div></div> }
