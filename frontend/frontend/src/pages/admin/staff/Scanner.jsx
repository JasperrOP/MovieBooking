import { useState } from 'react';
import axios from 'axios';

const Scanner = () => {
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    setResult(null);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post('/api/staff/verify-ticket', { ticketId }, config);

      if (data.valid) {
        setStatus('success');
        setMessage(data.message); // "Access Granted"
        setResult(data.booking);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification Failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🎟️ Ticket Scanner</h2>
        
        <form onSubmit={handleVerify} style={styles.form}>
          <input
            type="text"
            placeholder="Enter Ticket ID / Scan QR"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.button} disabled={status === 'loading'}>
            {status === 'loading' ? 'Verifying...' : 'Verify Ticket'}
          </button>
        </form>

        {/* --- RESULTS DISPLAY --- */}
        {message && (
          <div style={{
            ...styles.resultBox,
            backgroundColor: status === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
            borderColor: status === 'success' ? '#2ecc71' : '#e74c3c'
          }}>
            <h3 style={{ color: status === 'success' ? '#2ecc71' : '#e74c3c', marginTop: 0 }}>
              {status === 'success' ? '✅ VALID TICKET' : '❌ INVALID / USED'}
            </h3>
            <p style={{ fontSize: '18px' }}>{message}</p>
            
            {result && (
              <div style={{ textAlign: 'left', marginTop: '15px' }}>
                <p><strong>Movie:</strong> {result.movie}</p>
                <p><strong>Guest:</strong> {result.user}</p>
                <p><strong>Seats:</strong> {result.seats.join(', ')}</p>
              </div>
            )}
          </div>
        )}
        
        <button 
          onClick={() => {setTicketId(''); setStatus(null); setMessage(''); setResult(null)}}
          style={styles.clearBtn}
        >
          Scan Next
        </button>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    border: '1px solid #333',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '15px',
    fontSize: '18px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#2c2c2c',
    color: 'white',
    outline: 'none',
  },
  button: {
    padding: '15px',
    fontSize: '18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: '25px',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid',
    textAlign: 'center',
  },
  clearBtn: {
    marginTop: '20px',
    background: 'none',
    border: 'none',
    color: '#aaa',
    textDecoration: 'underline',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Scanner;