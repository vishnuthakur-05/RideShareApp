import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PassengerDashboard from './pages/passenger/PassengerDashboard';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FaqPage from './pages/FaqPage';
import PassengerLayout from './layouts/PassengerLayout';
import SearchRide from './pages/passenger/SearchRide';
import MyBookings from './pages/passenger/MyBookings';
import History from './pages/passenger/History';


import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApprovedUsers from './pages/admin/ApprovedUsers';
import PendingApprovals from './pages/admin/PendingApprovals';
import RideMonitoring from './pages/admin/RideMonitoring';

import DriverLayout from './layouts/DriverLayout';
import DriverDashboard from './pages/driver/DriverDashboard';
import PostRide from './pages/driver/PostRide';
import MyRides from './pages/driver/MyRides';
import DriverHistory from './pages/driver/DriverHistory';
import DriverNotifications from './pages/driver/DriverNotifications';
import Earnings from './pages/driver/Earnings';
import VehicleManagement from './pages/driver/VehicleManagement';
import AddVehicle from './pages/driver/AddVehicle';
import EditVehicle from './pages/driver/EditVehicle';
import VehicleDetails from './pages/driver/VehicleDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FaqPage />} />
          {/* Redirect old path to new path */}
          <Route path="/passenger-dashboard" element={<Navigate to="/passenger" />} />

          {/* Passenger Routes */}
          <Route path="/passenger" element={<PassengerLayout />}>
            <Route index element={<PassengerDashboard />} />
            <Route path="search-ride" element={<SearchRide />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="history" element={<History />} />
          </Route>

          {/* Driver Routes */}
          <Route path="/driver" element={<DriverLayout />}>
            <Route index element={<DriverDashboard />} />
            <Route path="post-ride" element={<PostRide />} />
            <Route path="rides" element={<MyRides />} />
            <Route path="history" element={<DriverHistory />} />
            <Route path="notifications" element={<DriverNotifications />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="vehicles/add" element={<AddVehicle />} />
            <Route path="vehicles/edit/:id" element={<EditVehicle />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="approved-users" element={<ApprovedUsers />} />
            <Route path="pending-approvals" element={<PendingApprovals />} />
            <Route path="rides" element={<RideMonitoring />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;