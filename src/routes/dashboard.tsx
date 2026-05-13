import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, TrendingUp, Receipt, CalendarDays } from "lucide-react";
import { supabase, type Expense } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — WiseSpendr" },
      { name: "description", content: "Track and manage your expenses." },
    ],
  }),
  component: Dashboard,
});

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

function StatCard({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setExpenses(data as Expense[]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses],
  );

  const monthTotal = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const d = new Date(e.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [expenses]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      amount: amt,
      category,
      note: note || null,
      created_at: new Date(date).toISOString(),
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setAmount("");
    setNote("");
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    const prev = expenses;
    setExpenses((s) => s.filter((e) => e.id !== id));
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) setExpenses(prev);
  };

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={TrendingUp} label="Total spending" value={`$${total.toFixed(2)}`} hint={`${expenses.length} transactions`} />
          <StatCard icon={CalendarDays} label="This month" value={`$${monthTotal.toFixed(2)}`} />
          <StatCard icon={Receipt} label="Avg / transaction" value={`$${expenses.length ? (total / expenses.length).toFixed(2) : "0.00"}`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <form onSubmit={handleAdd} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4 h-fit">
            <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add expense</h2>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" step="0.01" min="0" value={amount}
                onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Adding…" : "Add expense"}
            </Button>
          </form>

          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Recent transactions</h2>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses yet. Add your first one.</p>
            ) : (
              <ul className="divide-y divide-border">
                {expenses.slice(0, 10).map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{e.category}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {e.note || "—"} · {new Date(e.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums">${Number(e.amount).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
