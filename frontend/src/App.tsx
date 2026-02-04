import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/console/Login";
import ConsoleOverview from "./pages/console/ConsoleOverview";
import CasesList from "./pages/console/CasesList";
import CaseDetail from "./pages/console/CaseDetail";
import ReviewQueue from "./pages/console/ReviewQueue";

// Customer Portal
import CustomerLanding from "./pages/customer/CustomerLanding";
import CustomerSignup from "./pages/customer/CustomerSignup";
import CustomerLogin from "./pages/customer/CustomerLogin";
import PersonalDetails from "./pages/customer/onboarding/PersonalDetails";
import AddressDetails from "./pages/customer/onboarding/AddressDetails";
import IdentityDetails from "./pages/customer/onboarding/IdentityDetails";
import ConsentSubmit from "./pages/customer/onboarding/ConsentSubmit";
import Submitted from "./pages/customer/Submitted";
import Status from "./pages/customer/Status";
import Help from "./pages/customer/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Console Routes */}
          <Route path="/console/login" element={<Login />} />
          <Route path="/console" element={<ConsoleOverview />} />
          <Route path="/console/cases" element={<CasesList />} />
          <Route path="/console/cases/:id" element={<CaseDetail />} />
          <Route path="/console/review-queue" element={<ReviewQueue />} />
          
          {/* Customer Portal Routes */}
          <Route path="/customer" element={<CustomerLanding />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/onboarding/personal" element={<PersonalDetails />} />
          <Route path="/customer/onboarding/address" element={<AddressDetails />} />
          <Route path="/customer/onboarding/identity" element={<IdentityDetails />} />
          <Route path="/customer/onboarding/consent" element={<ConsentSubmit />} />
          <Route path="/customer/submitted" element={<Submitted />} />
          <Route path="/customer/status/:caseId" element={<Status />} />
          <Route path="/customer/help" element={<Help />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
