import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CharactersPage from "@/pages/characters";
import CharacterPage from "@/pages/character";
import BattlePage from "@/pages/battle";
import HistoryPage from "@/pages/history";
import { Sword, Home, Users, Clock, Menu, X } from "lucide-react";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

function NavLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: any }) {
  const [location, setLocation] = useLocation();
  const isActive = location === href || (href !== "/" && location.startsWith(href));
  return (
    <button
      onClick={() => setLocation(href)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
        isActive
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-card-border" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 font-black text-lg text-foreground hover:text-primary transition-colors group"
          data-testid="nav-logo"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Sword className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-colors"></div>
          </div>
          <span className="bg-gradient-to-r from-primary via-amber-400 to-orange-500 bg-clip-text text-transparent font-black text-lg">Anime Power Scales</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/" icon={Home}>الرئيسية</NavLink>
          <NavLink href="/characters" icon={Users}>الشخصيات</NavLink>
          <NavLink href="/battle" icon={Sword}>المعركة</NavLink>
          <NavLink href="/history" icon={Clock}>السجل</NavLink>
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-card-border bg-card px-4 py-3 flex flex-col gap-1">
          <NavLink href="/" icon={Home}>الرئيسية</NavLink>
          <NavLink href="/characters" icon={Users}>الشخصيات</NavLink>
          <NavLink href="/battle" icon={Sword}>المعركة</NavLink>
          <NavLink href="/history" icon={Clock}>السجل</NavLink>
        </div>
      )}
    </nav>
  );
}

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/characters" component={CharactersPage} />
        <Route path="/character/:id" component={CharacterPage} />
        <Route path="/battle" component={BattlePage} />
        <Route path="/battle/:id" component={BattlePage} />
        <Route path="/history" component={HistoryPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
