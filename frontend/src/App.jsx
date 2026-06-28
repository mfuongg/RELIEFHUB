import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Toast from './components/Toast';

// Public pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import CampaignList from './pages/public/CampaignList';
import CampaignDetail from './pages/public/CampaignDetail';
import SponsorBoard from './pages/public/SponsorBoard';
import PublicTransport from './pages/public/Transport';

// Dashboard layout
import DashboardLayout from './components/DashboardLayout';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAccounts from './pages/admin/Accounts';
import AdminInventory from './pages/admin/Inventory';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminAllocate from './pages/admin/Allocate';
import AdminReports from './pages/admin/Reports';
import AdminComplaints from './pages/admin/Complaints';
import AdminMissions from './pages/admin/Missions';
import AdminDonations from './pages/admin/Donations';

// Donor pages
import DonorDashboard from './pages/donor/Dashboard';
import DonorContribute from './pages/donor/Contribute';
import DonorCampaigns from './pages/donor/Campaigns';
import DonorHistory from './pages/donor/History';
import DonorReceipts from './pages/donor/Receipts';
import DonorTracking from './pages/donor/Tracking';
import DonorComplaint from './pages/donor/Complaint';
import DonorProfile from './pages/donor/Profile';
import DonationGuide from './pages/donor/DonationGuide';

// Finance pages
import FinanceDashboard from './pages/finance/Dashboard';
import FinanceVerify from './pages/finance/Verify';
import FinanceLedger from './pages/finance/Ledger';

// Local Officer pages
import LocalDashboard from './pages/local/Dashboard';
import LocalDisasters from './pages/local/Disasters';
import LocalNeeds from './pages/local/Needs';
import LocalDelivery from './pages/local/Delivery';
import LocalCitizenStatus from './pages/local/CitizenStatus';

// Citizen pages
import CitizenDashboard from './pages/citizen/Dashboard';
import CitizenRequest from './pages/citizen/Request';
import CitizenStatus from './pages/citizen/Status';
import CitizenReceipt from './pages/citizen/Receipt';

// Volunteer pages
import VolunteerDashboard from './pages/volunteer/Dashboard';
import VolunteerGroups from './pages/volunteer/Groups';
import VolunteerTransport from './pages/volunteer/Transport';
import VolunteerDelivery from './pages/volunteer/Delivery';
import VolunteerProfile from './pages/volunteer/Profile';

const ROLE_HOME = {
  admin: '/dashboard/admin',
  donor: '/dashboard/donor',
  finance: '/dashboard/finance',
  local: '/dashboard/local',
  citizen: '/dashboard/citizen',
  volunteer: '/dashboard/volunteer',
};

function ProtectedRoute({ children, roles }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { toast } = useApp();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/sponsors" element={<SponsorBoard />} />
          <Route path="/transport" element={<PublicTransport />} />

          {/* Admin */}
          <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout role="admin" /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="allocate" element={<AdminAllocate />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="verify" element={<FinanceVerify />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="missions" element={<AdminMissions />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="profile" element={<DonorProfile />} />
          </Route>

          {/* Donor */}
          <Route path="/dashboard/donor" element={<ProtectedRoute roles={['donor']}><DashboardLayout role="donor" /></ProtectedRoute>}>
            <Route index element={<DonorDashboard />} />
            <Route path="campaigns" element={<DonorCampaigns />} />
            <Route path="contribute" element={<DonorContribute />} />
            <Route path="guide" element={<DonationGuide />} />
            <Route path="history" element={<DonorHistory />} />
            <Route path="receipts" element={<DonorReceipts />} />
            <Route path="tracking" element={<DonorTracking />} />
            <Route path="complaint" element={<DonorComplaint />} />
            <Route path="profile" element={<DonorProfile />} />
          </Route>

          {/* Finance */}
          <Route path="/dashboard/finance" element={<ProtectedRoute roles={['finance']}><DashboardLayout role="finance" /></ProtectedRoute>}>
            <Route index element={<FinanceDashboard />} />
            <Route path="verify" element={<FinanceVerify />} />
            <Route path="ledger" element={<FinanceLedger />} />
            <Route path="profile" element={<DonorProfile />} />
          </Route>

          {/* Local */}
          <Route path="/dashboard/local" element={<ProtectedRoute roles={['local']}><DashboardLayout role="local" /></ProtectedRoute>}>
            <Route index element={<LocalDashboard />} />
            <Route path="disasters" element={<LocalDisasters />} />
            <Route path="needs" element={<LocalNeeds />} />
            <Route path="delivery" element={<LocalDelivery />} />
            <Route path="citizen-status" element={<LocalCitizenStatus />} />
            <Route path="profile" element={<DonorProfile />} />
          </Route>

          {/* Citizen */}
          <Route path="/dashboard/citizen" element={<ProtectedRoute roles={['citizen']}><DashboardLayout role="citizen" /></ProtectedRoute>}>
            <Route index element={<CitizenDashboard />} />
            <Route path="request" element={<CitizenRequest />} />
            <Route path="status" element={<CitizenStatus />} />
            <Route path="receipt" element={<CitizenReceipt />} />
            <Route path="profile" element={<DonorProfile />} />
          </Route>

          {/* Volunteer – Báo cáo hoạt động đã bị XÓA theo yêu cầu */}
          <Route path="/dashboard/volunteer" element={<ProtectedRoute roles={['volunteer']}><DashboardLayout role="volunteer" /></ProtectedRoute>}>
            <Route index element={<VolunteerDashboard />} />
            <Route path="groups" element={<VolunteerGroups />} />
            <Route path="transport" element={<VolunteerTransport />} />
            <Route path="delivery" element={<VolunteerDelivery />} />
            <Route path="profile" element={<VolunteerProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AnimatedRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
