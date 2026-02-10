import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get('/api/movies');
      setMovies(data);
    };
    fetchMovies();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>MovieBooking</h1>
        <div>
          {userInfo ? (
            <>
              {userInfo.role === 'admin' && (
                <button onClick={() => navigate('/admin/dashboard')} className="btn" style={{ marginRight: '10px', backgroundColor: '#444' }}>
                  Admin Dashboard
                </button>
              )}
              <button onClick={logoutHandler} className="btn">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="btn">Login</button>
          )}
        </div>
      </div>

      {/* Movie Grid */}
      <h2 style={{ marginBottom: '20px' }}>Now Showing</h2>
      <div style={styles.grid}>
        {movies.map((movie) => (
          <div key={movie._id} style={styles.card} onClick={() => navigate(`/booking/${movie._id}`)}>
            <img src={movie.posterUrl} alt={movie.title} style={styles.poster} />
            <div style={styles.info}>
              <h3>{movie.title}</h3>
              <p style={{ color: '#aaa', fontSize: '14px' }}>{movie.genre} • {movie.language}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px 50px', color: 'white' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: '0.3s' },
  poster: { width: '100%', height: '300px', objectFit: 'cover' },
  info: { padding: '15px' }
};

export default Home;