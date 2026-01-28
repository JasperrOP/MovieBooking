import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To show "Invalid password" messages
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); // Stop page from refreshing
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // The Magic Line: connecting to your Backend
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );

      // Save the user data (including Token) in the browser
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      console.log('Login Successful:', data);
      navigate('/'); // Go to Home Page
    } catch (err) {
      // If backend sends an error (like 401 Unauthorized), show it
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2>Sign In</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#b3b3b3' }}>
          New to MovieBooking?{' '}
          <Link to="/register" style={{ color: 'white' }}>
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

// Simple internal CSS for layout
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'var(--bg-dark)',
  },
  formCard: {
    backgroundColor: 'var(--bg-card)',
    padding: '40px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
  },
  error: {
    backgroundColor: '#e87c03',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '14px',
  },
};

export default Login;