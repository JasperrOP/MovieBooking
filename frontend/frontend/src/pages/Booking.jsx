import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeatMap from './SeatMap'; // <--- Import the new component

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  
  // New State for Selection
  const [selectedShow, setSelectedShow] = useState(null); 
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movieRes = await axios.get(`/api/movies/${id}`);
      setMovie(movieRes.data);
      const showRes = await axios.get(`/api/shows/movie/${id}`);
      setShows(showRes.data);
    };
    fetchData();
  }, [id]);

  const handleBookNow = async () => {
    if (!selectedShow || selectedSeats.length === 0) return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      alert("Please Login to Book!");
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };

      // 1. Calculate Price
      const totalAmount = selectedSeats.length * selectedShow.price;

      // 2. Prepare Data
      const bookingPayload = {
        showtimeId: selectedShow._id,
        seats: selectedSeats,
        totalAmount: totalAmount,
        paymentId: `DEMO_${Date.now()}` // Fake Payment ID for now (Phase 6 is Real Payments)
      };

      // 3. SEND TO SERVER (The "Concurrency Check" happens here!)
      await axios.post('/api/bookings', bookingPayload, config);

      // 4. If Success:
      alert("🎉 Booking Confirmed! Your seats are locked.");
      navigate('/'); // Redirect to Home (or a Success Page)

    } catch (error) {
      // 5. IF ERROR (Concurrency Conflict)
      console.error(error);
      const message = error.response?.data?.message || "Booking Failed";
      alert(`⚠️ FAILED: ${message}`);
      
      // Reload the page so the user sees the updated (grey) seats
      window.location.reload(); 
    }
  };

  if (!movie) return <h2 style={{color:'white'}}>Loading...</h2>;

  return (
    <div style={styles.container}>
      {/* If no show selected, list shows. If selected, show Seat Map */}
      {!selectedShow ? (
        <>
          <h1>{movie.title}</h1>
          <h2>Select a Showtime</h2>
          <div style={styles.grid}>
            {shows.map((show) => (
              <div key={show._id} style={styles.card}>
                <h3>{show.theatre.name}</h3>
                <p>{new Date(show.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <div style={{ margin: '15px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  Rs. {show.price} {show.isDynamicDeal && "🔥"}
                </div>
                <button 
                  className="btn" 
                  style={{ width: '100%' }}
                  onClick={() => setSelectedShow(show)}
                >
                  Select Seats
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* SEAT SELECTION VIEW */
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button onClick={() => setSelectedShow(null)} style={{background: 'none', border:'none', color:'#aaa', cursor:'pointer'}}>
             ← Back to Showtimes
          </button>
          
          <h2>Select Seats for {movie.title}</h2>
          <p>{selectedShow.theatre.name} | {new Date(selectedShow.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          
          <SeatMap 
            show={selectedShow} 
            selectedSeats={selectedSeats} 
            setSelectedSeats={setSelectedSeats} 
          />

          {/* Footer Bar */}
          {selectedSeats.length > 0 && (
            <div style={styles.footer}>
               <div>
                 <span style={{color: '#aaa'}}>Total: </span>
                 <span style={{fontSize: '24px', fontWeight: 'bold'}}>
                   Rs. {selectedSeats.length * selectedShow.price}
                 </span>
               </div>
               <button className="btn" onClick={handleBookNow}>
                 Proceed to Pay
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white' },
  grid: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' },
  card: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', width: '200px', border: '1px solid #333' },
  footer: {
    position: 'fixed', bottom: 0, left: 0, width: '100%',
    backgroundColor: '#1e1e1e', padding: '20px', borderTop: '1px solid #333',
    display: 'flex', justifyContent: 'space-around', alignItems: 'center'
  }
};

export default Booking;