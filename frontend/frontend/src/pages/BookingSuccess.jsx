import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from "react-qr-code";

const BookingSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        // Redirect if not logged in
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/bookings/${id}`, config);
        setBooking(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError("Failed to load booking details.");
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, navigate]);

  if (loading) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Loading...</div>;
  if (error) return <div style={{color:'#e74c3c', textAlign:'center', marginTop:'50px'}}>{error}</div>;
  if (!booking) return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}>Booking not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{color: '#2ecc71', marginBottom: '10px'}}>Booking Confirmed!</h1>
        <p style={{color: '#ccc', marginBottom: '20px'}}>Show this QR code at the theatre entrance.</p>
        
        {/* --- QR CODE DISPLAY --- */}
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', margin: '0 auto 20px auto', width: 'fit-content' }}>
            <QRCode 
                value={booking._id} 
                size={180}
            />
        </div>
        {/* ----------------------- */}

        <div style={styles.details}>
            <p><strong>Movie:</strong> {booking.showtime?.movie?.title || "Unknown Movie"}</p>
            <p><strong>Seats:</strong> {booking.seats?.join(', ')}</p>
            <p><strong>Date:</strong> {booking.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleDateString() : "N/A"}</p>
            <p><strong>Time:</strong> {booking.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleTimeString() : "N/A"}</p>
            <p><strong>Total Amount:</strong> ₹ {booking.totalAmount}</p>
            <p><strong>Booking ID:</strong> <span style={{fontSize: '12px', color:'#aaa'}}>{booking._id}</span></p>
        </div>

        <button className="btn" onClick={() => navigate('/')} style={{width: '100%', backgroundColor: '#e50914'}}>Go Home</button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#121212' },
  card: { backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '12px', textAlign: 'center', color: 'white', maxWidth: '400px', width: '100%', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' },
  details: { textAlign: 'left', margin: '20px 0', backgroundColor: '#2c2c2c', padding: '20px', borderRadius: '8px', fontSize: '15px', lineHeight: '1.6' }
};

export default BookingSuccess;