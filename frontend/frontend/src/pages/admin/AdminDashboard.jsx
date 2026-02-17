import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    // Ensure user is admin
    if (!userInfo || userInfo?.role !== 'admin') { 
      // Note: Adjust the check (userInfo.isAdmin or userInfo.role === 'admin') 
      // based on your User model.
      if (!userInfo?.isAdmin && userInfo?.role !== 'admin') {
          navigate('/login');
      }
    }
    fetchMovies();
    fetchShows();
  }, [navigate]);

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
      
      {/* --- ACTION BUTTONS --- */}
      <div style={{display:'flex', gap:'15px', marginBottom:'40px', flexWrap: 'wrap'}}>
        <button className="btn" onClick={() => navigate('/admin/add-movie')}>+ Add Movie</button>
        <button className="btn" onClick={() => navigate('/admin/add-theatre')}>+ Add Theatre</button>
        <button className="btn" onClick={() => navigate('/admin/add-screen')}>+ Add Screen</button>
        <button className="btn" style={{backgroundColor: '#e87c03'}} onClick={() => navigate('/admin/schedule-show')}>+ Schedule Show</button>
        
        {/* NEW HISTORY BUTTON */}
        <button className="btn" style={{backgroundColor: '#8e44ad'}} onClick={() => navigate('/admin/bookings')}>
             View Booking History
        </button>
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
      </div>

      {/* --- LISTS --- */}
      {activeTab === 'movies' ? (
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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
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
    </div>
  );
};

const styles = {
    tab: { background: 'none', border: 'none', color: 'white', padding: '10px 20px', fontSize: '18px', cursor: 'pointer', marginRight:'10px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#1e1e1e', borderRadius: '8px' },
    deleteBtn: { backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }
};

export default AdminDashboard;