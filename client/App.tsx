import "./global.css";

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import SiteLayout from "@/components/site/SiteLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Faq from "./pages/Faq";
import FairPersonalLoans from "./pages/products/FairPersonalLoans";
import ChamaLoans from "./pages/products/ChamaLoans";
import DebtAdviceServices from "./pages/products/DebtAdviceServices";
import FinancialCapabilityTraining from "./pages/products/FinancialCapabilityTraining";
import NotFound from "./pages/NotFound";

// The admin area is loaded on demand so public visitors never download it.
const RequireAdmin = lazy(() => import("./components/RequireAdmin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminRegister = lazy(() => import("./pages/AdminRegister"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminContacts = lazy(() => import("./pages/AdminContacts"));
const AdminApplications = lazy(() => import("./pages/AdminApplications"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminCareers = lazy(() => import("./pages/AdminCareers"));

const queryClient = new QueryClient();

/**
 * The whole app minus the router, so the browser (BrowserRouter) and the
 * build-time prerender (StaticRouter) can each supply their own.
 */
export const AppShell = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/faq" element={<Faq />} />
            <Route
              path="/products/fair-personal-loans"
              element={<FairPersonalLoans />}
            />
            <Route path="/products/chama-loans" element={<ChamaLoans />} />
            <Route
              path="/products/debt-advice-services"
              element={<DebtAdviceServices />}
            />
            <Route
              path="/products/financial-capability-training"
              element={<FinancialCapabilityTraining />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Everything below needs a signed-in admin, confirmed by the server. */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/careers" element={<AdminCareers />} />
          </Route>
        </Routes>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);
