import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CacheBusterProvider } from "@/providers/CacheBusterProvider";
import { Dashboard } from "@/pages/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <CacheBusterProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Dashboard />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </CacheBusterProvider>
  );
}

export default App;
