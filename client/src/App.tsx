import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Analytics from "@/pages/analytics";
import Premium from "@/pages/premium";
import ExtensionInstall from "@/pages/extension-install";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/extension" component={ExtensionInstall} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/chat" component={Chat} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/premium" component={Premium} />
          <Route path="/extension" component={ExtensionInstall} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
