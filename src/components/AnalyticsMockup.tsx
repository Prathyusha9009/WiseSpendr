import { ArrowUpRight, PieChart as PieIcon, Sparkles, TrendingUp, Wallet } from "lucide-react";

export function AnalyticsMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl animate-float">
      {/* Glow */}
      <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-primary opacity-20 blur-3xl" />

      {/* Main analytics card */}
      <div className="relative rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spending overview</p>
              <p className="font-display text-sm font-semibold">This month</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-primary">
            <ArrowUpRight className="h-3 w-3" /> on track
          </span>
        </div>

        {/* Key stat */}
        <div className="mt-5">
          <p className="text-xs text-muted-foreground">Total spent</p>
          <p className="mt-1 font-display text-4xl font-bold tracking-tight">$2,184.50</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span><span className="font-medium text-foreground">62%</span> of $3,500 monthly budget used</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-primary" style={{ width: "62%" }} />
        </div>

        {/* Area chart */}
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium">Monthly trend</p>
            <p className="text-xs text-primary">+8.2%</p>
          </div>
          <svg viewBox="0 0 320 90" className="h-20 w-full">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.16 152)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(0.62 0.16 152)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[15, 35, 55, 75].map((y) => (
              <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="oklch(0.93 0.008 150)" strokeDasharray="2 4" />
            ))}
            <path
              d="M0,65 C40,55 60,40 100,45 C140,50 160,25 200,30 C240,35 270,15 320,20 L320,90 L0,90 Z"
              fill="url(#area)"
            />
            <path
              d="M0,65 C40,55 60,40 100,45 C140,50 160,25 200,30 C240,35 270,15 320,20"
              fill="none"
              stroke="oklch(0.62 0.16 152)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Category bars */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Food", amt: "$640", pct: 80, tone: "bg-gradient-primary" },
            { label: "Travel", amt: "$420", pct: 55, tone: "bg-primary/70" },
            { label: "Bills", amt: "$310", pct: 38, tone: "bg-primary/40" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-surface p-3">
              <p className="text-[11px] text-muted-foreground">{c.label}</p>
              <p className="font-display text-sm font-semibold">{c.amt}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className={`h-full rounded-full ${c.tone}`} style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating insight card */}
      <div className="absolute -left-6 top-20 hidden w-56 rounded-2xl border border-border bg-card p-4 shadow-card sm:block">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">AI insight</p>
            <p className="text-xs font-semibold">Save $96 on dining</p>
          </div>
        </div>
      </div>

      {/* Floating pie card */}
      <div className="absolute -right-4 bottom-20 hidden rounded-2xl border border-border bg-card p-3 shadow-card sm:block">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Top category</p>
            <p className="font-display text-xs font-semibold">Food · 29%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
