import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BookingSuccess = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const { data } = await axios.get(`/api/bookings/${id}`, config);
        setBooking(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching receipt:", error);
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePrint = () => {
    window.print(); 
  };

  if (loading) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>Generating Receipt...</div>;
  if (!booking) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>Booking not found.</div>;

  return (
    <div style={styles.container}>
      
      {/* --- TICKET AREA (This part prints) --- */}
      <div style={styles.ticket} className="printable-ticket">
        <div style={styles.header}>
            <h1 style={{margin:0, fontSize: '22px'}}>MOVIE TICKET</h1>
            <p style={{margin:0, fontSize: '12px', opacity: 0.8}}>Booking ID: {booking._id}</p>
        </div>
        
        <div style={styles.content}>
            <div style={styles.row}>
                {/* Fallback image if poster is missing */}
                <img 
                    src={booking.showtime.movie.posterUrl || '/vite.svg'} 
                    alt="poster" 
                    style={{width:'80px', borderRadius:'5px', backgroundColor:'#ccc'}} 
                />
                <div style={{marginLeft:'20px'}}>
                    <h2 style={{margin: '0 0 5px 0', fontSize:'18px'}}>{booking.showtime.movie.title}</h2>
                    <p style={{color:'#555', margin:0, fontWeight:'bold'}}>{booking.showtime.theatre.name}</p>
                    <p style={{color:'#777', fontSize:'14px', margin:0}}>{booking.showtime.screen.name}</p>
                </div>
            </div>

            <hr style={{border:'1px dashed #ccc', margin:'20px 0'}}/>

            <div style={styles.infoGrid}>
                <div>
                    <span style={styles.label}>Date & Time</span>
                    <p style={styles.value}>{new Date(booking.showtime.startTime).toLocaleString()}</p>
                </div>
                <div>
                    <span style={styles.label}>Seats</span>
                    <p style={styles.value}>{booking.seats.join(', ')}</p>
                </div>
            </div>

            {/* --- FOOD SECTION (NEW) --- */}
            {booking.foodItems && booking.foodItems.length > 0 && (
              <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px'}}>
                 <span style={styles.label}>Snacks & Drinks</span>
                 <ul style={{margin: '5px 0 0 15px', padding: 0, fontSize: '14px', color: '#333'}}>
                   {booking.foodItems.map((item, index) => (
                     <li key={index}>{item.name} x{item.quantity}</li>
                   ))}
                 </ul>
              </div>
            )}

            <hr style={{border:'1px dashed #ccc', margin:'20px 0'}}/>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <span style={styles.label}>TOTAL PAID</span>
               <p style={{fontSize: '20px', fontWeight: 'bold', margin:0, color:'#e50914'}}>
                  Rs. {booking.totalAmount}
               </p>
            </div>
            
            <div style={{textAlign:'center', marginTop:'30px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px'}}>
                <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${booking._id}`} 
                   alt="Ticket QR" 
                />
                <p style={{fontSize:'12px', color:'#777', marginTop: '5px'}}>Scan at the Entrance</p>
            </div>
        </div>
      </div>
      
      {/* --- ACTION BUTTONS (Hidden during print) --- */}
      <div className="no-print" style={{marginTop:'30px', display:'flex', gap:'15px', flexWrap:'wrap', justifyContent:'center'}}>
          <button onClick={handlePrint} className="btn" style={{backgroundColor:'#3498db', padding:'12px 20px', fontSize:'16px'}}>
            🖨️ Print Ticket
          </button>
          
          {/* Link to order food if allowed */}
          {booking.showtime.theatre.hasFoodService && (
             <Link to={`/order-food/${booking._id}`} className="btn" style={{textDecoration:'none', backgroundColor:'#f1c40f', color:'black', fontWeight:'bold', padding:'12px 20px', fontSize:'16px'}}>
               🍿 Add Snacks
             </Link>
          )}

          <Link to="/" className="btn" style={{textDecoration:'none', backgroundColor:'#555', padding:'12px 20px', fontSize:'16px'}}>
            Home
          </Link>
      </div>

      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .printable-ticket, .printable-ticket * { visibility: visible; }
            .printable-ticket { position: absolute; left: 50%; top: 50px; transform: translateX(-50%); width: 100%; max-width: 400px; border: 1px solid #000; }
            .no-print { display: none !important; }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
    container: { display: 'flex', flexDirection:'column', alignItems:'center', padding: '40px', color: 'white', minHeight:'100vh' },
    ticket: { backgroundColor: 'white', color: '#333', borderRadius: '16px', width: '100%', maxWidth: '380px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
    header: { backgroundColor: '#2ecc71', color: 'white', padding: '20px', textAlign: 'center' },
    content: { padding: '25px' },
    row: { display: 'flex', alignItems: 'center' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    label: { fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' },
    value: { fontSize: '15px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#222' }
};

export default BookingSuccess;