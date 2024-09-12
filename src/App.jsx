import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import LoadingAnimation from './components/LoadingAnimation';
import { SupabaseAuthProvider } from './integrations/supabase';

const queryClient = new QueryClient();

const LazyCodeEditor = lazy(() => import('./components/CodeEditor'));
const LazyHome = lazy(() => import('./pages/Home'));

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<LoadingAnimation />}>
              <Routes>
                <Route path="/" element={<LazyHome />} />
                <Route path="/editor" element={<LazyCodeEditor />} />
                <Route path="/editor/:id" element={<LazyCodeEditor />} />
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