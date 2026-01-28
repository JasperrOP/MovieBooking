import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Read user data from local storage to greet them
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Welcome back, {userInfo ? userInfo.name : 'Guest'}!</h1>
      <p>This is the Movie Booking Dashboard (Coming Soon)</p>
      
      {userInfo ? (
        <button onClick={logoutHandler} className="btn" style={{ marginTop: '20px' }}>
          Logout
        </button>
      ) : (
        <button onClick={() => navigate('/login')} className="btn">
          Login
        </button>
      )}
    </div>
  );
};

export default Home;