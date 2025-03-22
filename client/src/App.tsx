import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import SingularisPrime from "@/pages/SingularisPrime";
import DocumentationCenter from "@/pages/DocumentationCenter";
import { GameStateProvider } from "./hooks/useGameState";
import { AIDirector } from "@/components/AIDirector";
import AIConsole from "@/components/AIConsole";
import AudioManager from "@/components/AudioManager";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SingularisPrime} />
      <Route path="/documentation" component={DocumentationCenter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameStateProvider>
        <AIDirector enabled={true} analysisInterval={30000}>
          <Router />
          <Toaster />
          <AIConsole minimized={true} />
          <AudioManager defaultVolume={0.4} />
        </AIDirector>
      </GameStateProvider>
    </QueryClientProvider>
  );
}

export default App;
