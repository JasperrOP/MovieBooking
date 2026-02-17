import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess'; // <--- Import

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddMovie from './pages/admin/AddMovie';
import AddTheatre from './pages/admin/AddTheatre';
import AddScreen from './pages/admin/AddScreen';
import ScheduleShow from './pages/admin/ScheduleShow';
import BookingHistory from './pages/admin/BookingHistory'; // <--- Import
import StaffDashboard from './pages/staff/StaffDashboard';
import Scanner from './pages/staff/Scanner';
import AddFood from './pages/admin/AddFood';
import MyBookings from './pages/user/MyBookings';
import OrderFood from './pages/user/OrderFood';


import Footer from './Footer'; 

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public/User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking/:id" element={<Booking />} />
            
            {/* Receipt Page */}
            <Route path="/booking/success/:id" element={<BookingSuccess />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-movie" element={<AddMovie />} />
            <Route path="/admin/add-theatre" element={<AddTheatre />} />
            <Route path="/admin/add-screen" element={<AddScreen />} />
            <Route path="/admin/schedule-show" element={<ScheduleShow />} />
            <Route path="/admin/add-food" element={<AddFood />} />
            
            {/* Admin History Route */}
            <Route path="/admin/bookings" element={<BookingHistory />} />

            <Route path="/staff/dashboard" element={<StaffDashboard />} />


            <Route path="/staff/scanner" element={<Scanner />} />

            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/order-food/:id" element={<OrderFood />} />  
          </Routes>
        </div>

        <Footer />

      </div>
    </Router>
  );
}

export default App;