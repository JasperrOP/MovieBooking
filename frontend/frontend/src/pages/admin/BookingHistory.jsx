import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      // Security Check: Redirect if not admin
      if (!userInfo || !userInfo.isAdmin) { // Check your specific field (e.g., role === 'admin')
         if (userInfo?.role !== 'admin') {
             navigate('/');
             return;
         }
      }

      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/bookings/all', config);
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

  if (loading) return <div style={{padding:'50px', color:'white', textAlign:'center'}}>Loading History...</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/admin/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
      <h1 style={{marginBottom: '30px'}}>Booking Transactions</h1>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Movie Details</th>
              <th style={styles.th}>Seats</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Ref ID</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} style={styles.row}>
                <td style={styles.td}>
                    {new Date(b.createdAt).toLocaleDateString()} <br/>
                    <small style={{color:'#888'}}>{new Date(b.createdAt).toLocaleTimeString()}</small>
                </td>
                <td style={styles.td}>
                    <strong>{b.user?.name || 'Unknown'}</strong> <br/>
                    <small style={{color:'#aaa'}}>{b.user?.email}</small>
                </td>
                <td style={styles.td}>
                    <span style={{color:'#e50914'}}>{b.showtime?.movie?.title || 'Deleted Movie'}</span> <br/>
                    <small>{b.showtime?.theatre?.name} ({b.showtime?.screen?.name})</small>
                </td>
                <td style={styles.td}>{b.seats.join(', ')}</td>
                <td style={styles.td}>
                    <span style={{color: '#2ecc71', fontWeight:'bold'}}>Rs. {b.totalAmount}</span>
                </td>
                <td style={styles.td}>
                    <code style={{background:'#333', padding:'4px', borderRadius:'4px', fontSize:'12px'}}>
                        {b.paymentId}
                    </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
            <div style={{padding:'20px', textAlign:'center', color:'#777'}}>No bookings found.</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' },
  backBtn: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', marginBottom: '20px', fontSize: '16px', textDecoration:'underline' },
  tableWrapper: { overflowX: 'auto', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', minWidth: '800px' },
  headerRow: { backgroundColor: '#333', textAlign: 'left' },
  th: { padding: '15px', color: '#ccc', borderBottom: '2px solid #444', fontWeight:'600' },
  row: { borderBottom: '1px solid #333' },
  td: { padding: '15px', verticalAlign: 'middle', color: '#eee', fontSize:'14px' }
};

export default BookingHistory;