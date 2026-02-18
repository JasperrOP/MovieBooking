import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  
  // UI States
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await axios.get('/api/movies');
      setMovies(data);
      setFilteredMovies(data);
    };
    fetchMovies();
  }, []);

  // Filter Logic: Runs whenever search, genre, language, or movies change
  useEffect(() => {
    let result = movies;

    if (searchTerm) {
      result = result.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (genre) {
      result = result.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
    }
    if (language) {
      result = result.filter(m => m.language.toLowerCase() === language.toLowerCase());
    }

    setFilteredMovies(result);
  }, [searchTerm, genre, language, movies]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  // Get unique genres and languages for the dropdowns
  const uniqueGenres = [...new Set(movies.map(item => item.genre))];
  const uniqueLanguages = [...new Set(movies.map(item => item.language))];

  return (
    <div style={styles.container}>
      
      {/* --- NEW HEADER --- */}
      <div style={styles.header}>
        <h1 style={{color: '#e50914', cursor:'pointer'}} onClick={() => navigate('/')}>MovieBooking</h1>
        
        {/* Search Bar */}
        <div style={styles.searchBarContainer}>
            <input 
                type="text" 
                placeholder="Search movies..." 
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* User Profile / Login */}
        <div style={{position: 'relative'}}>
            {userInfo ? (
                <div 
                    style={styles.profileCircle} 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                    {userInfo.name.charAt(0).toUpperCase()}
                    
                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <div style={styles.dropdown}>
                            <p style={styles.dropdownItem} onClick={() => navigate('/my-bookings')}>My Bookings</p>
                            {userInfo.role === 'admin' && (
                                <p style={styles.dropdownItem} onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</p>
                            )}
                            <p style={{...styles.dropdownItem, borderTop: '1px solid #333'}} onClick={logoutHandler}>Logout</p>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={() => navigate('/login')} className="btn">Login</button>
            )}
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div style={styles.filters}>
        <select style={styles.select} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            {uniqueGenres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select style={styles.select} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">All Languages</option>
            {uniqueLanguages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* --- MOVIE GRID --- */}
      <h2 style={{ marginBottom: '20px' }}>Now Showing</h2>
      {filteredMovies.length === 0 ? (
          <p style={{textAlign: 'center', color: '#aaa'}}>No movies found matching your criteria.</p>
      ) : (
          <div style={styles.grid}>
            {filteredMovies.map((movie) => (
              <div key={movie._id} style={styles.card} onClick={() => navigate(`/booking/${movie._id}`)}>
                <img src={movie.posterUrl} alt={movie.title} style={styles.poster} />
                <div style={styles.info}>
                  <h3>{movie.title}</h3>
                  <div style={{display:'flex', justifyContent:'space-between', color: '#aaa', fontSize: '14px', marginTop:'5px'}}>
                    <span>{movie.genre}</span>
                    <span>{movie.language}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px 50px', color: 'white' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #333' },
  searchBarContainer: { flex: 1, display: 'flex', justifyContent: 'center' },
  searchInput: { padding: '10px 20px', width: '50%', borderRadius: '25px', border: 'none', backgroundColor: '#333', color: 'white', outline: 'none' },
  profileCircle: { 
    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e50914', 
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontWeight: 'bold', cursor: 'pointer', selectUser: 'none' 
  },
  dropdown: {
    position: 'absolute', top: '50px', right: '0', backgroundColor: '#1e1e1e', 
    borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.5)', width: '150px', zIndex: 100, overflow:'hidden'
  },
  dropdownItem: { padding: '10px 15px', margin: 0, cursor: 'pointer', fontSize: '14px', '&:hover': { backgroundColor: '#333' } },
  filters: { display: 'flex', gap: '15px', marginBottom: '30px' },
  select: { padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: '0.3s' },
  poster: { width: '100%', height: '300px', objectFit: 'cover' },
  info: { padding: '15px' }
};

export default Home;