import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import OrganInfo from "./pages/OrganInfo";
import HospitalLogin from "./pages/hospital/Login";
import OrganizationLogin from "./pages/organization/Login";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageHospitals from "./pages/admin/ManageHospitals";
import RegisterHospital from "./pages/admin/RegisterHospital";
import ManageOrganizations from "./pages/admin/ManageOrganizations";
import IPFSLogs from "./pages/admin/IPFSLogs";
import BlockchainLogs from "./pages/admin/BlockchainLogs";
import ResetPasswords from "./pages/admin/ResetPasswords";
import AdminSettings from "./pages/admin/Settings";
import AdminPolicies from "./pages/admin/Policies";
import RegisterOrganization from "./pages/admin/RegisterOrganization";
import AdminNotifications from "./pages/admin/Notifications";
import HospitalDashboard from "./pages/hospital/Dashboard";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { HospitalAuthProvider } from "./contexts/HospitalAuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ToastProvider } from "./contexts/ToastContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <HospitalAuthProvider>
          <NotificationProvider>
          <ToastProvider>
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/organ-info" element={<OrganInfo />} />

              {/* Hospital Routes */}
              <Route path="/hospital/login" element={<HospitalLogin />} />
              <Route path="/hospital/dashboard" element={<HospitalDashboard />} />

              {/* Organization Routes */}
              <Route
                path="/organization/login"
                element={<OrganizationLogin />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/login" replace />}
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/hospitals" element={<ManageHospitals />} />
              <Route
                path="/admin/hospitals/register"
                element={<RegisterHospital />}
              />
              <Route
                path="/admin/organizations"
                element={<ManageOrganizations />}
              />
              <Route
                path="/admin/organizations/register"
                element={<RegisterOrganization />}
              />
              <Route path="/admin/policies" element={<AdminPolicies />} />
              <Route
                path="/admin/notifications"
                element={<AdminNotifications />}
              />
              <Route path="/admin/ipfs-logs" element={<IPFSLogs />} />
              <Route
                path="/admin/blockchain-logs"
                element={<BlockchainLogs />}
              />
              <Route
                path="/admin/reset-passwords"
                element={<ResetPasswords />}
              />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
          </ToastProvider>
          </NotificationProvider>
        </HospitalAuthProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
