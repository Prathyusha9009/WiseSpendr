import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Wallet, TrendingDown, PiggyBank, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase, type Expense } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


export const Route = createFileRoute("/budget")({
  head: () => ({ meta: [{ title: "Budget Tracking — WiseSpendr" }] }),
  component: BudgetPage,
});

type Budget = {
  id: string;
  user_id: string;
  monthly_budget: number;
  created_at: string;
};

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: any;
  label: string;
  value: string;
  tone?: "default" | "warning" | "danger" | "success";
}) {
  const toneClasses = {
    default: "bg-primary/10 text-primary",
    warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  }[tone];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${toneClasses}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

function BudgetPage() {
  const { user } = useAuth();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [budgetRes, expensesRes] = await Promise.all([
        supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.from("expenses").select("*").eq("user_id", user.id),
      ]);
      if (budgetRes.data) {
        setBudget(budgetRes.data as Budget);
        setInput(String((budgetRes.data as Budget).monthly_budget));
      }
      if (expensesRes.data) setExpenses(expensesRes.data as Expense[]);
      setLoading(false);
    })();
  }, [user]);

  const monthSpent = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const d = new Date(e.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [expenses]);

  const monthlyBudget = budget ? Number(budget.monthly_budget) : 0;
  const remaining = monthlyBudget - monthSpent;
  const usage = monthlyBudget > 0 ? (monthSpent / monthlyBudget) * 100 : 0;
  const exceeded = usage > 100;
  const warning = usage >= 80 && usage <= 100;

  const barColor = exceeded
    ? "bg-red-500"
    : warning
    ? "bg-yellow-500"
    : "bg-primary";

  const handleSave = async () => {
    if (!user) return;
    const amount = parseFloat(input);
    if (isNaN(amount) || amount < 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSaving(true);
    try {
      if (budget) {
        const { data, error } = await supabase
          .from("budgets")
          .update({ monthly_budget: amount })
          .eq("id", budget.id)
          .eq("user_id", user.id)
          .select()
          .single();
        if (error) throw error;
        setBudget(data as Budget);
        toast.success("Budget updated");
      } else {
        const { data, error } = await supabase
          .from("budgets")
          .insert({ user_id: user.id, monthly_budget: amount })
          .select()
          .single();
        if (error) throw error;
        setBudget(data as Budget);
        toast.success("Budget set");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save budget");
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n: number) => `₹${n.toFixed(2)}`;

  return (
    <AppShell title="Budget Tracking">
      <div className="space-y-6">
        {/* Set/Update budget */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Monthly budget</h2>
              <p className="text-xs text-muted-foreground">
                {budget ? "Update your monthly spending limit" : "Set your monthly spending limit"}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <Label htmlFor="budget" className="text-xs">
                Amount (USD)
              </Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving ? "Saving…" : budget ? "Update budget" : "Set budget"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Monthly budget" value={fmt(monthlyBudget)} />
          <StatCard icon={TrendingDown} label="Spent this month" value={fmt(monthSpent)} />
          <StatCard
            icon={PiggyBank}
            label="Remaining"
            value={fmt(remaining)}
            tone={remaining < 0 ? "danger" : "success"}
          />
          <StatCard
            icon={AlertTriangle}
            label="Usage"
            value={`${usage.toFixed(1)}%`}
            tone={exceeded ? "danger" : warning ? "warning" : "default"}
          />
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Budget usage</h2>
            <span className="text-sm text-muted-foreground tabular-nums">
              {fmt(monthSpent)} / {fmt(monthlyBudget)}
            </span>
          </div>
          <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${barColor} transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(usage, 100)}%` }}
            />
          </div>
          <div className="mt-3 min-h-5">
            {monthlyBudget === 0 ? (
              <p className="text-xs text-muted-foreground">Set a monthly budget to track usage.</p>
            ) : exceeded ? (
              <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                You've exceeded your monthly budget by {fmt(Math.abs(remaining))}.
              </p>
            ) : warning ? (
              <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                You've used over 80% of your budget.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                You're on track — {fmt(remaining)} remaining this month.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
