import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post(
        '/api/users/register',
        { name, email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2>Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Register
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#b3b3b3' }}>
          Have an account?{' '}
          <Link to="/login" style={{ color: 'white' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

// Reusing the same styles
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

export default Register;