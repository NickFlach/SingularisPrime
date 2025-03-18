import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import SingularisPrime from "@/pages/SingularisPrime";
import { GameStateProvider } from "./hooks/useGameState";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SingularisPrime} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameStateProvider>
        <Router />
        <Toaster />
      </GameStateProvider>
    </QueryClientProvider>
  );
}

export default App;
