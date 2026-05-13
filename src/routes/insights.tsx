import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PiggyBank,
  Target,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase, type Expense } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [{ title: "AI Insights — WiseSpendr" }] }),
  component: InsightsPage,
});

type Tone = "default" | "success" | "warning" | "danger" | "info";

type Insight = {
  icon: LucideIcon;
  title: string;
  message: string;
  tone: Tone;
};

const TONES: Record<Tone, { card: string; badge: string }> = {
  default: { card: "bg-card border-border", badge: "bg-primary/10 text-primary" },
  success: {
    card: "bg-emerald-500/5 border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    card: "bg-yellow-500/5 border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  danger: {
    card: "bg-red-500/5 border-red-500/20",
    badge: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  info: {
    card: "bg-sky-500/5 border-sky-500/20",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
};

function InsightCard({ insight }: { insight: Insight }) {
  const t = TONES[insight.tone];
  const Icon = insight.icon;
  return (
    <div className={`rounded-2xl border p-5 ${t.card}`}>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${t.badge}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold tracking-tight">{insight.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{insight.message}</p>
    </div>
  );
}

function InsightsPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [eRes, bRes] = await Promise.all([
        supabase.from("expenses").select("*").eq("user_id", user.id),
        supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
      if (eRes.data) setExpenses(eRes.data as Expense[]);
      if (bRes.data) setMonthlyBudget(Number((bRes.data as any).monthly_budget) || 0);
      setLoading(false);
    })();
  }, [user]);

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  const insights = useMemo<Insight[]>(() => {
    const now = new Date();
    const thisMonth = expenses.filter((e) => {
      const d = new Date(e.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthSpent = thisMonth.reduce((s, e) => s + Number(e.amount || 0), 0);

    // category totals this month
    const byCat = new Map<string, number>();
    for (const e of thisMonth) {
      const c = e.category || "Other";
      byCat.set(c, (byCat.get(c) || 0) + Number(e.amount || 0));
    }
    const topCat = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0];

    // weekly comparison
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const weekStart = new Date(now.getTime() - oneWeek);
    const prevWeekStart = new Date(now.getTime() - 2 * oneWeek);
    const sumBetween = (from: Date, to: Date) =>
      expenses
        .filter((e) => {
          const d = new Date(e.created_at);
          return d >= from && d < to;
        })
        .reduce((s, e) => s + Number(e.amount || 0), 0);
    const thisWeek = sumBetween(weekStart, now);
    const lastWeek = sumBetween(prevWeekStart, weekStart);
    const weekDelta = thisWeek - lastWeek;
    const weekPct = lastWeek > 0 ? (weekDelta / lastWeek) * 100 : thisWeek > 0 ? 100 : 0;

    // monthly prediction (linear pace)
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const projected = dayOfMonth > 0 ? (monthSpent / dayOfMonth) * daysInMonth : 0;

    const items: Insight[] = [];

    // 1. Highest category
    if (topCat) {
      items.push({
        icon: TrendingUp,
        title: "Top spending category",
        message: `You spent most on ${topCat[0]} this month — ${fmt(topCat[1])} total.`,
        tone: "info",
      });
    } else {
      items.push({
        icon: TrendingUp,
        title: "Top spending category",
        message: "No expenses recorded this month yet. Add some to see insights.",
        tone: "default",
      });
    }

    // 2. Budget usage warning
    if (monthlyBudget > 0) {
      const usage = (monthSpent / monthlyBudget) * 100;
      if (usage > 100) {
        items.push({
          icon: AlertTriangle,
          title: "Budget exceeded",
          message: `You've used ${usage.toFixed(0)}% of your monthly budget — over by ${fmt(monthSpent - monthlyBudget)}.`,
          tone: "danger",
        });
      } else if (usage >= 80) {
        items.push({
          icon: AlertTriangle,
          title: "Budget warning",
          message: `You have used ${usage.toFixed(0)}% of your monthly budget. Slow down to stay on track.`,
          tone: "warning",
        });
      } else {
        items.push({
          icon: PiggyBank,
          title: "Budget on track",
          message: `You've used ${usage.toFixed(0)}% of your budget — ${fmt(monthlyBudget - monthSpent)} remaining.`,
          tone: "success",
        });
      }
    } else {
      items.push({
        icon: PiggyBank,
        title: "Set a monthly budget",
        message: "Add a monthly budget on the Budget page to unlock smarter insights.",
        tone: "default",
      });
    }

    // 3. Weekly trend
    if (lastWeek > 0 || thisWeek > 0) {
      const up = weekDelta > 0;
      items.push({
        icon: up ? TrendingUp : TrendingDown,
        title: up ? "Weekly spending increased" : "Weekly spending decreased",
        message: `You spent ${fmt(thisWeek)} this week vs ${fmt(lastWeek)} last week (${up ? "+" : ""}${weekPct.toFixed(0)}%).`,
        tone: up ? "warning" : "success",
      });
    }

    // 4. Monthly prediction
    if (monthSpent > 0) {
      const willExceed = monthlyBudget > 0 && projected > monthlyBudget;
      items.push({
        icon: Target,
        title: "Monthly forecast",
        message: willExceed
          ? `At your current pace (${fmt(projected)}), you may exceed your budget by ${fmt(projected - monthlyBudget)}.`
          : `At your current pace, you're projected to spend about ${fmt(projected)} this month.`,
        tone: willExceed ? "danger" : "info",
      });
    }

    // 5. Savings suggestion
    if (topCat && topCat[1] > 0) {
      const save = topCat[1] * 0.15;
      items.push({
        icon: Lightbulb,
        title: "Savings suggestion",
        message: `Reducing ${topCat[0]} spending by 15% could save you about ${fmt(save)} per month.`,
        tone: "success",
      });
    }

    return items;
  }, [expenses, monthlyBudget]);

  return (
    <AppShell title="AI Insights">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold tracking-tight">Smart insights</h2>
              <p className="text-xs text-muted-foreground">
                Personalized observations generated from your spending and budget.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Analyzing your data…
          </div>
        ) : expenses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-semibold">No data yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a few expenses to start receiving personalized insights.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.map((i, idx) => (
              <InsightCard key={idx} insight={i} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
