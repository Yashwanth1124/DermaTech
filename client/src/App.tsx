import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Dashboard pages
import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import DoctorDashboard from "@/pages/dashboard/DoctorDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";

// Feature pages
import Appointments from "@/pages/appointments/Appointments";
import HealthRecords from "@/pages/records/HealthRecords";
import AIDiagnostics from "@/pages/ai/AIDiagnostics";
import Pharmacy from "@/pages/pharmacy/Pharmacy";
import Telemedicine from "@/pages/telemedicine/Telemedicine";
import Analytics from "@/pages/analytics/Analytics";
import Profile from "@/pages/profile/Profile";
import Support from "@/pages/support/Support";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/:rest*" component={AuthWrapper} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthWrapper() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">DT</span>
          </div>
          <p className="text-slate-600">Loading DermaTech...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Landing />;
  }

  const getDashboardComponent = () => {
    const userRole = (user as any)?.role;
    switch (userRole) {
      case 'doctor':
        return DoctorDashboard;
      case 'admin':
        return AdminDashboard;
      default:
        return PatientDashboard;
    }
  };

  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={getDashboardComponent()} />
        <Route path="/profile" component={Profile} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/health-records" component={HealthRecords} />
        <Route path="/emr" component={HealthRecords} />
        <Route path="/ai-diagnostics" component={AIDiagnostics} />
        <Route path="/pharmacy" component={Pharmacy} />
        <Route path="/telemedicine" component={Telemedicine} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/support" component={Support} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
