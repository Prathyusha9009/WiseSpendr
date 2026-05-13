import { BarChart3, LayoutDashboard, Lightbulb, PieChart, Settings, Sparkles, Target, TrendingUp, Wallet } from "lucide-react";

export function DashboardPreview() {
  const nav = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: BarChart3, label: "Analytics" },
    { icon: Target, label: "Budget" },
    { icon: Sparkles, label: "AI Insights" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-primary opacity-15 blur-3xl" />
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-warning/80" />
          <span className="h-3 w-3 rounded-full bg-primary/70" />
          <p className="ml-3 text-xs text-muted-foreground">wisespendr.app/dashboard</p>
        </div>

        <div className="grid grid-cols-12">
          {/* Sidebar */}
          <aside className="col-span-3 border-r border-border bg-surface/60 p-4 sm:col-span-2">
            <div className="flex items-center gap-2 px-2 pb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="hidden font-display text-sm font-semibold sm:inline">WiseSpendr</span>
            </div>
            <nav className="space-y-1">
              {nav.map((n) => (
                <div
                  key={n.label}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium ${
                    n.active ? "bg-accent text-primary" : "text-muted-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{n.label}</span>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <div className="col-span-9 p-5 sm:col-span-10 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Welcome back</p>
                <h3 className="font-display text-lg font-semibold sm:text-xl">Dashboard</h3>
              </div>
              <span className="rounded-full bg-gradient-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground shadow-soft">
                + Add expense
              </span>
            </div>

            {/* Stat cards */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Total spent", value: "$2,184", trend: "+8.2%" },
                { label: "Budget left", value: "$1,316", trend: "38%" },
                { label: "Top category", value: "Food", trend: "$640" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-display text-base font-bold sm:text-lg">{s.value}</p>
                  <p className="text-[10px] text-primary">{s.trend}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="mt-4 grid grid-cols-5 gap-3">
              {/* Trend chart */}
              <div className="col-span-3 rounded-xl border border-border bg-surface p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium">Monthly trend</p>
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                </div>
                <svg viewBox="0 0 240 80" className="h-20 w-full">
                  <defs>
                    <linearGradient id="dpg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.16 152)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="oklch(0.62 0.16 152)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,55 C30,45 50,30 80,38 C110,46 130,18 160,24 C190,30 215,12 240,18 L240,80 L0,80 Z" fill="url(#dpg)" />
                  <path d="M0,55 C30,45 50,30 80,38 C110,46 130,18 160,24 C190,30 215,12 240,18" fill="none" stroke="oklch(0.62 0.16 152)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              {/* Pie */}
              <div className="col-span-2 rounded-xl border border-border bg-surface p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium">Categories</p>
                  <PieChart className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex items-center justify-center">
                  <div
                    className="h-20 w-20 rounded-full"
                    style={{
                      background:
                        "conic-gradient(oklch(0.62 0.16 152) 0 35%, oklch(0.78 0.18 150) 35% 60%, oklch(0.85 0.1 150) 60% 80%, oklch(0.92 0.05 150) 80% 100%)",
                    }}
                  >
                    <div className="m-3 h-14 w-14 rounded-full bg-card" />
                  </div>
                </div>
              </div>
            </div>

            {/* Budget + insight */}
            <div className="mt-3 grid grid-cols-5 gap-3">
              <div className="col-span-3 rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">Budget usage</p>
                  <p className="text-[11px] text-muted-foreground">62% of $3,500</p>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: "62%" }} />
                </div>
              </div>
              <div className="col-span-2 rounded-xl border border-border bg-accent/60 p-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold">AI suggestion</p>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Reduce dining by 15% to save ~$96 this month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
