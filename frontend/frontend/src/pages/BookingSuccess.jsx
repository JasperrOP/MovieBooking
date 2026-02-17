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
    window.print(); // Triggers browser's native print/save-as-pdf dialog
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
                <img 
                    src={booking.showtime.movie.poster || 'https://via.placeholder.com/100x150'} 
                    alt="poster" 
                    style={{width:'80px', borderRadius:'5px'}} 
                />
                <div style={{marginLeft:'20px'}}>
                    <h2 style={{margin: '0 0 5px 0'}}>{booking.showtime.movie.title}</h2>
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
                <div>
                    <span style={styles.label}>Total Amount</span>
                    <p style={styles.value}>Rs. {booking.totalAmount}</p>
                </div>
                <div>
                    <span style={styles.label}>Payment Ref</span>
<p 
  style={{ 
    ...styles.value, 
    fontSize: '12px', 
    wordBreak: 'break-all' 
  }}
>
  {booking._id}
</p>
                </div>
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
      <div className="no-print" style={{marginTop:'30px', display:'flex', gap:'15px'}}>
          <button onClick={handlePrint} className="btn" style={{backgroundColor:'#3498db', padding:'12px 20px', fontSize:'16px'}}>
            🖨️ Download / Print Ticket
          </button>
          <Link to="/" className="btn" style={{textDecoration:'none', backgroundColor:'#555', padding:'12px 20px', fontSize:'16px'}}>
            Back to Home
          </Link>
      </div>

      {/* --- PRINT CSS --- */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-ticket, .printable-ticket * {
              visibility: visible;
            }
            .printable-ticket {
              position: absolute;
              left: 50%;
              top: 50px;
              transform: translateX(-50%);
              width: 100%;
              max-width: 400px;
              border: 1px solid #000;
              box-shadow: none;
            }
            .no-print {
              display: none !important;
            }
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