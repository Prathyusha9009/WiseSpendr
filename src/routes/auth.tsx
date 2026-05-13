import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { Wallet } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Sign in — WiseSpendr" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "signup" ? "signup" : "signin",
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { mode } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const handle = async (mode: "in" | "up") => {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "in") {
        await signIn(email, password);
        navigate({ to: "/dashboard" });
      } else {
        await signUp(email, password);
        setInfo("Check your email to confirm your account, then sign in.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">WiseSpendr</span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <Tabs defaultValue="signin">
            <Tabs value={mode} onValueChange={(v) => navigate({ to: "/auth", search: { mode: v as "signin" | "signup" }, replace: true })}></Tabs>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            {(["signin", "signup"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`email-${tab}`}>Email</Label>
                  <Input id={`email-${tab}`} type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`pw-${tab}`}>Password</Label>
                  <Input id={`pw-${tab}`} type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {info && <p className="text-sm text-muted-foreground">{info}</p>}
                <Button className="w-full" disabled={loading}
                  onClick={() => handle(tab === "signin" ? "in" : "up")}>
                  {loading ? "Please wait…" : tab === "signin" ? "Sign in" : "Create account"}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
