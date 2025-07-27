import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VehicleProvider } from "./context/VehicleContext";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CatalogEditPage from "./pages/CatalogEditPage";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import AddVehiclePage from "./pages/AddVehiclePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VehicleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/edit" element={<CatalogEditPage />} />
            <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VehicleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
