import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  
  // --- NEW: State for Stats ---
  const [stats, setStats] = useState({
    revenue: 0,
    bookings: 0,
    movies: 0,
    users: 0,
    recentBookings: []
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo?.role !== 'admin') { 
      // Fallback check if your user object uses isAdmin instead of role
      if (!userInfo?.isAdmin && userInfo?.role !== 'admin') {
          navigate('/login');
      }
    }
    fetchMovies();
    fetchShows();
    fetchStats(); // <--- Fetch the stats!
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/admin/stats', config);
      setStats(data);
    } catch (error) { console.error("Error fetching stats:", error); }
  };

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get('/api/movies');
      setMovies(data);
    } catch (error) { console.error(error); }
  };

  const fetchShows = async () => {
    try {
        const { data } = await axios.get('/api/shows'); 
        setShows(data);
    } catch (error) { console.error(error); }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Delete this movie?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/movies/${id}`, config);
        fetchMovies(); 
      } catch (error) { alert('Failed to delete'); }
    }
  };

  const handleDeleteShow = async (id) => {
    if (window.confirm('Delete this show?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/shows/${id}`, config);
        fetchShows();
      } catch (error) { alert('Failed to delete'); }
    }
  };

  return (
    <div style={{ padding: '40px', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>

      {/* --- STATS CARDS (NEW) --- */}
      <div style={styles.statsGrid}>
        <div style={{...styles.card, borderLeft: '5px solid #2ecc71'}}>
           <h3>Total Revenue</h3>
           <p style={styles.statNumber}>₹ {stats.revenue.toLocaleString()}</p>
        </div>
        <div style={{...styles.card, borderLeft: '5px solid #3498db'}}>
           <h3>Total Bookings</h3>
           <p style={styles.statNumber}>{stats.bookings}</p>
        </div>
        <div style={{...styles.card, borderLeft: '5px solid #9b59b6'}}>
           <h3>Active Movies</h3>
           <p style={styles.statNumber}>{stats.movies}</p>
        </div>
        <div style={{...styles.card, borderLeft: '5px solid #f1c40f'}}>
           <h3>Total Users</h3>
           <p style={styles.statNumber}>{stats.users}</p>
        </div>
      </div>
      
      {/* --- ACTION BUTTONS --- */}
      <div style={{display:'flex', gap:'15px', marginBottom:'40px', flexWrap: 'wrap'}}>
        <button className="btn" onClick={() => navigate('/admin/add-movie')}>+ Add Movie</button>
        <button className="btn" onClick={() => navigate('/admin/add-theatre')}>+ Add Theatre</button>
        <button className="btn" onClick={() => navigate('/admin/add-screen')}>+ Add Screen</button>
        <button className="btn" style={{backgroundColor: '#e87c03'}} onClick={() => navigate('/admin/schedule-show')}>+ Schedule Show</button>
      </div>

      {/* --- TABS --- */}
      <div style={{ borderBottom: '1px solid #333', marginBottom: '20px' }}>
        <button 
            style={{...styles.tab, borderBottom: activeTab === 'movies' ? '2px solid #e50914' : 'none'}}
            onClick={() => setActiveTab('movies')}>
            Movies
        </button>
        <button 
            style={{...styles.tab, borderBottom: activeTab === 'shows' ? '2px solid #e50914' : 'none'}}
            onClick={() => setActiveTab('shows')}>
            Shows
        </button>
        <button 
            style={{...styles.tab, borderBottom: activeTab === 'recent' ? '2px solid #e50914' : 'none'}}
            onClick={() => setActiveTab('recent')}>
            Recent Bookings
        </button>
        <button className="btn" style={{backgroundColor: '#27ae60'}} onClick={() => navigate('/admin/add-food')}>
  + Add Food
</button>
      </div>

      {/* --- LISTS --- */}
      {activeTab === 'movies' && (
        <table style={styles.table}>
          <thead>
            <tr style={{textAlign:'left', color: '#aaa'}}><th>Title</th><th>Genre</th><th>Duration</th><th>Action</th></tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id} style={{borderBottom:'1px solid #333'}}>
                <td style={{padding:'15px'}}>{movie.title}</td>
                <td style={{padding:'15px'}}>{movie.genre}</td>
                <td style={{padding:'15px'}}>{movie.duration} min</td>
                <td style={{padding:'15px'}}>
                  <button style={styles.deleteBtn} onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
                </td>
                <td style={{padding:'15px'}}>
  <button 
    style={{...styles.deleteBtn, backgroundColor: '#f39c12', marginRight: '10px'}} 
    onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
  >
    Edit
  </button>
  <button style={styles.deleteBtn} onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'shows' && (
        <table style={styles.table}>
          <thead>
            <tr style={{textAlign:'left', color: '#aaa'}}><th>Movie</th><th>Theatre</th><th>Screen</th><th>Time</th><th>Action</th></tr>
          </thead>
          <tbody>
            {shows.map(show => (
              <tr key={show._id} style={{borderBottom:'1px solid #333'}}>
                <td style={{padding:'15px'}}>{show.movie?.title || 'N/A'}</td>
                <td style={{padding:'15px'}}>{show.theatre?.name || 'N/A'}</td>
                <td style={{padding:'15px'}}>{show.screen?.name || 'N/A'}</td>
                <td style={{padding:'15px'}}>{new Date(show.startTime).toLocaleString()}</td>
                <td style={{padding:'15px'}}>
                   <button style={styles.deleteBtn} onClick={() => handleDeleteShow(show._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'recent' && (
        <table style={styles.table}>
           <thead>
            <tr style={{textAlign:'left', color: '#aaa'}}><th>User</th><th>Movie</th><th>Amount</th><th>Status</th><th>Time</th></tr>
          </thead>
          <tbody>
            {stats.recentBookings.map((booking) => (
              <tr key={booking._id} style={{borderBottom:'1px solid #333'}}>
                <td style={{padding:'15px'}}>{booking.user?.name || 'Guest'}</td>
                {/* Safe check for movie title in case showtime is deleted */}
                <td style={{padding:'15px'}}>{booking.showtime?.movie?.title || 'Unknown Movie'}</td>
                <td style={{padding:'15px'}}>₹ {booking.totalAmount}</td>
                <td style={{padding:'15px'}}>{booking.ticketStatus || 'Booked'}</td>
                <td style={{padding:'15px'}}>{new Date(booking.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {stats.recentBookings.length === 0 && <tr><td colSpan="5" style={{padding:'20px', textAlign:'center'}}>No bookings yet</td></tr>}
          </tbody>
        </table>
      )}

    </div>
  );
};

const styles = {
    tab: { background: 'none', border: 'none', color: 'white', padding: '10px 20px', fontSize: '18px', cursor: 'pointer', marginRight:'10px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#1e1e1e', borderRadius: '8px' },
    deleteBtn: { backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
    // New Styles for Stats
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
    card: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
    statNumber: { fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }
};

export default AdminDashboard;