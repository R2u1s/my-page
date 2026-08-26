import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./providers/theme";
import { queryClient } from "../shared/api/queryClient";
import { LandingPage } from "../pages/landing/ui/LandingPage";

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LandingPage />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
