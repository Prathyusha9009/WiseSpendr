import { Link } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">WiseSpendr</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => scrollToId("features")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </button>
          <button
            onClick={() => scrollToId("insights")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Insights
          </button>
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth" search={{ mode: "signin" }}>Sign in</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-gradient-primary shadow-soft hover:shadow-glow">
            <Link to="/auth" search={{ mode: "signup" }}>Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
