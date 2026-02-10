import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
// Import the new Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddMovie from './pages/admin/AddMovie';
import AddTheatre from './pages/admin/AddTheatre';
import AddScreen from './pages/admin/AddScreen';
import ScheduleShow from './pages/admin/ScheduleShow';
import Booking from './pages/Booking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-movie" element={<AddMovie />} />
        <Route path="/admin/add-theatre" element={<AddTheatre />} />
        <Route path="/admin/add-screen" element={<AddScreen />} />
        <Route path="/admin/schedule-show" element={<ScheduleShow />} />
        <Route path="/booking/:id" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App;