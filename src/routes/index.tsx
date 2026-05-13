import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Check, Sparkles, Target, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { AnalyticsMockup } from "@/components/AnalyticsMockup";
import { DashboardPreview } from "@/components/DashboardPreview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WiseSpendr — Spend smarter, save effortlessly" },
      { name: "description", content: "Take control of your finances with smart expense tracking, predictive insights, and budget intelligence designed to help you spend better every day." },
      { property: "og:title", content: "WiseSpendr — Spend smarter, save effortlessly" },
      { property: "og:description", content: "Smart expense tracking, predictive insights, and budget intelligence." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:gap-12 lg:pb-32 lg:pt-24">
          <div className="flex flex-col justify-center animate-fade-up">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>New — AI insights for smarter spending</span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-balance lg:text-6xl xl:text-7xl">
              Spend smarter.{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Save effortlessly.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-balance">
              Take control of your finances with smart expense tracking, predictive insights, and budget intelligence designed to help you spend better every day.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-gradient-primary px-7 text-base shadow-glow hover:opacity-95">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start tracking free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <AnalyticsMockup />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance lg:text-5xl">
              Everything you need to master your money
            </h2>
            <p className="mt-4 text-muted-foreground">
              Beautiful tools that turn financial chaos into clarity.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: "Smart Analytics",
                desc: "Visualize spending patterns with category breakdowns, monthly trends, and real-time financial insights.",
              },
              {
                icon: Target,
                title: "Budget Tracking",
                desc: "Set monthly spending limits, monitor usage progress, and stay ahead of overspending.",
              },
              {
                icon: Sparkles,
                title: "AI Financial Insights",
                desc: "Receive intelligent spending predictions, savings suggestions, and personalized financial observations.",
              },
            ].map((f, i) => (
              <div key={i} className="group rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Preview</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance lg:text-5xl">
              See your finances clearly
            </h2>
            <p className="mt-4 text-muted-foreground text-balance">
              Track spending, monitor budgets, and uncover insights through an interactive analytics dashboard.
            </p>
          </div>
          <div className="mt-14">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Green CTA */}
      <section id="insights" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-primary p-12 text-primary-foreground shadow-glow lg:p-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-display text-4xl font-bold tracking-tight text-balance lg:text-5xl">
                  Ready to manage money smarter?
                </h2>
                <p className="mt-4 text-lg opacity-90">
                  Track expenses, understand spending habits, and build better financial discipline with intelligent budgeting tools.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="h-12 rounded-full bg-background px-7 text-base text-foreground hover:bg-background/90">
                    <Link to="/dashboard">Open dashboard <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Real-time expense tracking",
                  "Smart budget monitoring",
                  "AI-powered financial insights",
                  "Interactive analytics dashboard",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">WiseSpendr</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 WiseSpendr. Spend smarter.</p>
        </div>
      </footer>
    </div>
  );
}

