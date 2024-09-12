import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import LoadingAnimation from './components/LoadingAnimation';
import { SupabaseAuthProvider } from './integrations/supabase';

const queryClient = new QueryClient();

const LazyCodeEditor = lazy(() => new Promise(resolve => {
  setTimeout(() => {
    resolve(import('./components/CodeEditor'));
  }, 1500);
}));

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<LoadingAnimation />}>
              <Routes>
                {navItems.map(({ to, page }) => (
                  <Route key={to} path={to} element={
                    <Suspense fallback={<LoadingAnimation />}>
                      {page}
                    </Suspense>
                  } />
                ))}
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;