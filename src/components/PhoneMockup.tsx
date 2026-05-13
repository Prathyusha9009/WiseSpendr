import { ArrowDownLeft, ArrowUpRight, Coffee, ShoppingBag, Zap } from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm animate-float">
      {/* Glow */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-primary opacity-20 blur-3xl" />

      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border border-border bg-foreground/95 p-3 shadow-card">
        <div className="overflow-hidden rounded-[2rem] bg-background">
          {/* Notch */}
          <div className="flex justify-center pt-2">
            <div className="h-5 w-24 rounded-full bg-foreground/95" />
          </div>

          {/* Content */}
          <div className="space-y-4 p-5 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Good morning</p>
                <p className="font-display text-base font-semibold">Alex</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-primary" />
            </div>

            {/* Balance card */}
            <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
              <p className="text-xs opacity-80">Total balance</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-tight">$12,480.50</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><ArrowDownLeft className="h-3.5 w-3.5" /> Income $4,200</div>
                <div className="flex items-center gap-1.5"><ArrowUpRight className="h-3.5 w-3.5" /> Spent $1,820</div>
              </div>
            </div>

            {/* Mini chart */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium">This week</p>
                <p className="text-xs text-primary">+12.4%</p>
              </div>
              <svg viewBox="0 0 200 60" className="h-14 w-full">
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.16 152)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="oklch(0.62 0.16 152)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,40 C30,35 50,20 80,25 C110,30 130,10 160,15 C180,18 195,8 200,5 L200,60 L0,60 Z" fill="url(#g)" />
                <path d="M0,40 C30,35 50,20 80,25 C110,30 130,10 160,15 C180,18 195,8 200,5" fill="none" stroke="oklch(0.62 0.16 152)" strokeWidth="2" />
              </svg>
            </div>

            {/* Transactions */}
            <div className="space-y-2">
              {[
                { icon: Coffee, name: "Blue Bottle", cat: "Coffee", amt: "-$6.40" },
                { icon: ShoppingBag, name: "Whole Foods", cat: "Groceries", amt: "-$84.20" },
                { icon: Zap, name: "Salary", cat: "Income", amt: "+$3,200", income: true },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/60 p-2.5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.income ? "bg-primary/15 text-primary" : "bg-background text-foreground"}`}>
                    <t.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.cat}</p>
                  </div>
                  <p className={`text-xs font-semibold ${t.income ? "text-primary" : "text-foreground"}`}>{t.amt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -left-6 top-32 hidden rounded-2xl border border-border bg-card p-3 shadow-card sm:block">
        <p className="text-[10px] font-medium text-muted-foreground">Saved this month</p>
        <p className="font-display text-lg font-bold text-primary">+$840</p>
      </div>
      <div className="absolute -right-4 bottom-24 hidden rounded-2xl border border-border bg-card px-3 py-2 shadow-card sm:block">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-medium">Budget on track</p>
        </div>
      </div>
    </div>
  );
}
