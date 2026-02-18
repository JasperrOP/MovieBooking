import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) return navigate('/login');

      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/bookings/mybookings', config);
        setBookings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookings();
  }, [navigate]);

  return (
    <div style={{ padding: '40px', color: 'white', minHeight: '100vh' }}>
      <h2>My Bookings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        {bookings.length === 0 && <p>No bookings found.</p>}
        
        {bookings.map((booking) => (
          <div key={booking._id} style={styles.ticketCard}>
            
            <div style={{flex: 1}}>
              <h3 style={{color: '#e50914'}}>{booking.showtime?.movie?.title}</h3>
              <p><strong>Theatre:</strong> {booking.showtime?.theatre?.name}</p>
              <p><strong>Time:</strong> {new Date(booking.showtime?.startTime).toLocaleString()}</p>
              <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
              {booking.foodItems?.length > 0 && (
                <p style={{color: '#f1c40f', fontSize:'14px'}}>+ {booking.foodItems.length} Snack Items</p>
              )}
            </div>

            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px'}}>
               <button 
                  className="btn" 
                  style={{backgroundColor: '#333'}}
                  onClick={() => navigate(`/booking/success/${booking._id}`)}
                >
                  View Ticket
               </button>
               
               {/* Conditional Button */}
               {booking.showtime?.theatre?.hasFoodService ? (
                 <button 
                   className="btn" 
                   style={{backgroundColor: '#f1c40f', color: 'black', fontWeight:'bold'}}
                   onClick={() => navigate(`/order-food/${booking._id}`)}
                 >
                   🍿 Order Food
                 </button>
               ) : (
                 <span style={{color: '#666', fontSize:'12px', textAlign:'center'}}>
                   No Food Service
                 </span>
               )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  ticketCard: {
    backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', 
    display: 'flex', justifyContent: 'space-between', border: '1px solid #333'
  }
};

export default MyBookings;