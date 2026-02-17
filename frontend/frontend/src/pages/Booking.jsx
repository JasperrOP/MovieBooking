import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeatMap from './SeatMap'; 

// Helper to load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  
  const [selectedShow, setSelectedShow] = useState(null); 
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await axios.get(`/api/movies/${id}`);
        setMovie(movieRes.data);
        const showRes = await axios.get(`/api/shows/movie/${id}`);
        setShows(showRes.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [id]);

  // --- PROCESS BOOKING AND REDIRECT TO RECEIPT ---
  const processBooking = async (paymentId) => {
     const userInfo = JSON.parse(localStorage.getItem('userInfo'));
     
     try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };

      const bookingPayload = {
        showtimeId: selectedShow._id,
        seats: selectedSeats,
        paymentId: paymentId 
      };

      // 1. Send to Backend
      const { data } = await axios.post('/api/bookings', bookingPayload, config);
      
      // 2. Redirect to the new Receipt Page
      navigate(`/booking/success/${data._id}`); 

     } catch (error) {
       console.error(error);
       const msg = error.response?.data?.message || "Booking Failed";
       alert(`⚠️ Failed: ${msg}`);
       window.location.reload();
     }
  };

  const handleRazorpayPayment = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    const totalAmount = selectedSeats.length * selectedShow.price;

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: order } = await axios.post('/api/payment/create-order', {
        amount: totalAmount
      }, config);

      const options = {
        key: "rzp_test_S7fwyuDD8ht4sH", 
        amount: order.amount,
        currency: order.currency,
        name: "MovieBooking App",
        description: `Booking for ${movie.title}`,
        order_id: order.id,
        handler: async function (response) {
          await processBooking(response.razorpay_payment_id);
        },
        prefill: {
          name: userInfo.name || "User",
          email: userInfo.email || "user@example.com",
        },
        theme: { color: "#e50914" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Error creating payment order");
    }
  };

  const handleStaticQR = () => {
    setShowQR(true);
  };

  const confirmQRPayment = () => {
    const fakeId = `QR_${Math.floor(Math.random() * 1000000)}`;
    processBooking(fakeId);
  };

  if (!movie) return <h2 style={{color:'white', padding:'40px'}}>Loading...</h2>;

  return (
    <div style={styles.container}>
      {!selectedShow ? (
         <div style={styles.grid}>
            {shows.map((show) => (
              <div key={show._id} style={styles.card}>
                <h3>{show.theatre.name}</h3>
                <p>{new Date(show.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <div style={{ margin: '15px 0', fontSize: '18px', fontWeight: 'bold', color: '#4cd137' }}>
                  Rs. {show.price}
                </div>
                <button className="btn" style={{ width: '100%' }} onClick={() => setSelectedShow(show)}>
                  Select Seats
                </button>
              </div>
            ))}
         </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button onClick={() => {setSelectedShow(null); setSelectedSeats([])}} style={{background:'none', border:'none', color:'#aaa', cursor:'pointer', marginBottom:'15px'}}>
             ← Back
          </button>
          
          <SeatMap show={selectedShow} selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />

          {selectedSeats.length > 0 && (
            <div style={styles.footer}>
               <div>
                 <span style={{color: '#aaa'}}>Total: </span>
                 <span style={{fontSize: '24px', fontWeight: 'bold'}}>
                   Rs. {selectedSeats.length * selectedShow.price}
                 </span>
               </div>
               <button className="btn" onClick={() => setShowPaymentModal(true)}>
                 Proceed to Pay
               </button>
            </div>
          )}
        </div>
      )}

      {showPaymentModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.closeBtn} onClick={() => {setShowPaymentModal(false); setShowQR(false);}}>×</button>
            
            {!showQR ? (
              <>
                <h2 style={{color: 'black', textAlign:'center'}}>Payment Method</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
                  <button style={{...styles.payBtn, backgroundColor: '#3498db'}} onClick={handleRazorpayPayment}>
                    💳 Pay with Razorpay
                  </button>
                  <button style={{...styles.payBtn, backgroundColor: '#2ecc71'}} onClick={handleStaticQR}>
                    📱 Scan QR Code
                  </button>
                </div>
              </>
            ) : (
              <div style={{textAlign: 'center', color: 'black'}}>
                <h3>Scan to Pay: Rs. {selectedSeats.length * selectedShow.price}</h3>
                <div style={{border:'1px solid #ddd', padding:'10px', display:'inline-block'}}>
                    <img 
                    src={`/image.png`} 
                    alt="Payment QR" 
                    style={{width: '150px', height: '150px'}} 
                    />
                </div>
                <p>UPI ID : ayush30904@oksbi</p>

                <button style={{...styles.payBtn, backgroundColor: '#27ae60', marginTop:'20px'}} onClick={confirmQRPayment}>
                  ✅ I Have Paid
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white' },
  grid: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' },
  card: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', width: '220px', border: '1px solid #333' },
  footer: {
    position: 'fixed', bottom: 0, left: 0, width: '100%',
    backgroundColor: '#111', padding: '20px', borderTop: '1px solid #333',
    display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 10
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
  },
  modalContent: {
    backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '400px', position: 'relative'
  },
  payBtn: {
    padding: '15px', fontSize: '16px', cursor: 'pointer', color: 'white', border: 'none', borderRadius: '5px'
  },
  closeBtn: {
    position: 'absolute', top: '10px', right: '15px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#555'
  }
};

export default Booking;