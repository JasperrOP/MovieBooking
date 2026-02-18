import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const SeatMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(location.state?.show || null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // --- 1. Safety Redirect ---
  useEffect(() => {
    if (!show) {
      console.warn("No show data found, redirecting to home.");
      navigate('/');
    }
  }, [show, navigate]);

  // --- 2. Real-Time Polling (Updates Booked Seats) ---
  useEffect(() => {
    if (!show) return;

    const fetchLatestData = async () => {
      try {
        const movieId = typeof show.movie === 'object' ? show.movie._id : show.movie;
        // Verify this URL matches your backend route exactly
        const { data } = await axios.get(`/api/shows/movie/${movieId}`);
        const updatedShow = data.find(s => s._id === show._id);
        
        if (updatedShow) {
          // Only update if bookedSeats changed to avoid re-renders
          if (JSON.stringify(updatedShow.bookedSeats) !== JSON.stringify(show.bookedSeats)) {
            console.log("Updated booked seats from server:", updatedShow.bookedSeats);
            setShow(prev => ({ ...prev, bookedSeats: updatedShow.bookedSeats }));
          }
        }
      } catch (error) {
        console.error("Error polling seats:", error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(fetchLatestData, 3000);
    return () => clearInterval(interval);
  }, [show?._id, show?.movie]); // Dependency on ID ensures we don't poll if show is null

  // --- 3. Seat Click Handler ---
  const handleSeatClick = (seatLabel, price) => {
    // Debugging: Check if click is firing
    console.log("Clicked Seat:", seatLabel);

    const isBooked = (show.bookedSeats || []).includes(seatLabel);
    if (isBooked) {
      console.log("Seat is already booked.");
      return;
    }

    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatLabel));
    } else {
      setSelectedSeats(prev => [...prev, seatLabel]);
    }
  };

  // --- 4. Checkout Handler ---
  const handleCheckout = () => {
    const totalPrice = selectedSeats.reduce((total, seatLabel) => {
      const row = show.screen.seatConfiguration.find(r => seatLabel.startsWith(r.rowLabel));
      return total + (row ? row.price : 0);
    }, 0);

    console.log("Proceeding to checkout with:", selectedSeats, "Total:", totalPrice);
    navigate('/booking', { 
      state: { 
        show, 
        selectedSeats, 
        totalPrice 
      } 
    });
  };

  // --- Render Helpers ---
  if (!show) return <div style={styles.loading}>Loading Cinema...</div>;

  const totalPrice = selectedSeats.reduce((total, seatLabel) => {
    const row = show.screen.seatConfiguration.find(r => seatLabel.startsWith(r.rowLabel));
    return total + (row ? row.price : 0);
  }, 0);

  return (
    <div style={styles.pageContainer}>
      
      {/* Header Info */}
      <div style={styles.header}>
        <h2 style={styles.movieTitle}>{show.movie?.title || "Movie Title"}</h2>
        <p style={styles.subText}>
          {show.theatre?.name} | {new Date(show.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>

      {/* 3D Screen Effect */}
      <div style={styles.screenContainer}>
        <div style={styles.screen}></div>
        <div style={styles.screenShadow}></div>
        <p style={styles.screenText}>SCREEN</p>
      </div>

      {/* Seat Grid */}
      <div style={styles.gridContainer}>
        {show.screen.seatConfiguration.map((row) => (
          <div key={row.rowLabel} style={styles.row}>
            <span style={styles.rowLabel}>{row.rowLabel}</span>
            <div style={styles.seatsRow}>
              {Array.from({ length: row.seatCount }).map((_, index) => {
                const seatLabel = `${row.rowLabel}${index + 1}`;
                const isBooked = (show.bookedSeats || []).includes(seatLabel);
                const isSelected = selectedSeats.includes(seatLabel);

                return (
                  <div
                    key={seatLabel}
                    onClick={() => handleSeatClick(seatLabel, row.price)}
                    style={{
                      ...styles.seat,
                      backgroundColor: isBooked ? '#444' : isSelected ? '#e50914' : '#2d2d2d',
                      border: isSelected ? '1px solid #ff4d4d' : '1px solid #3e3e3e',
                      boxShadow: isSelected ? '0 0 10px #e50914' : 'none',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <span style={{fontSize: '9px', opacity: isSelected || !isBooked ? 0.7 : 0.2}}>
                      {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}><div style={{...styles.dot, background:'#2d2d2d', border:'1px solid #3e3e3e'}}></div> Available</div>
        <div style={styles.legendItem}><div style={{...styles.dot, background:'#e50914', boxShadow:'0 0 8px #e50914'}}></div> Selected</div>
        <div style={styles.legendItem}><div style={{...styles.dot, background:'#444'}}></div> Sold</div>
      </div>

      {/* Floating Checkout Bar */}
      {selectedSeats.length > 0 && (
        <div style={styles.floatingBar}>
          <div style={styles.barInfo}>
            <span style={styles.barLabel}>SEATS</span>
            <span style={styles.barValue}>{selectedSeats.join(', ')}</span>
          </div>
          <div style={styles.barInfo}>
            <span style={styles.barLabel}>TOTAL</span>
            <span style={styles.barPrice}>Rs. {totalPrice}</span>
          </div>
          <button style={styles.payButton} onClick={handleCheckout}>
            Proceed to Pay
          </button>
        </div>
      )}

      {/* Spacing for floating bar */}
      <div style={{height: '100px'}}></div>
    </div>
  );
};

// --- STYLES (Fixed Z-Index & Layout) ---
const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    overflowX: 'hidden' // Prevent horizontal scrollbar from 3D effects
  },
  loading: { color: 'white', marginTop: '50px', fontSize: '18px' },
  header: { textAlign: 'center', marginBottom: '30px', zIndex: 10 },
  movieTitle: { margin: '0 0 5px 0', fontSize: '24px', letterSpacing: '1px', color: '#fff' },
  subText: { color: '#888', fontSize: '14px', margin: 0 },
  
  // 3D Screen Effect
  screenContainer: {
    perspective: '1000px',
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    zIndex: 1 // Keep this low so it doesn't cover seats
  },
  screen: {
    width: '300px',
    height: '60px',
    background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0))',
    transform: 'rotateX(-45deg) scale(0.9)',
    boxShadow: '0 30px 50px -10px rgba(255,255,255,0.3)',
    borderRadius: '10px 10px 0 0',
    opacity: 0.6
  },
  screenText: { marginTop: '-10px', fontSize: '12px', letterSpacing: '3px', color: '#555' },

  // Grid - CRITICAL FIX: Z-Index high
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '0 20px',
    maxWidth: '100%',
    overflowX: 'auto',
    zIndex: 20, // Ensure this is above background effects
    position: 'relative'
  },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  rowLabel: { 
    width: '30px', 
    color: '#666', 
    fontWeight: 'bold', 
    textAlign: 'right', 
    marginRight: '20px',
    fontSize: '14px' 
  },
  seatsRow: { display: 'flex', gap: '10px' },
  
  // Individual Seat
  seat: {
    width: '32px',
    height: '32px',
    borderRadius: '8px 8px 4px 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    userSelect: 'none',
    position: 'relative',
    zIndex: 30 // Ensure seat is clickable
  },

  // Legend
  legend: { display: 'flex', gap: '25px', marginTop: '50px', color: '#888', fontSize: '13px', zIndex: 10 },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  dot: { width: '12px', height: '12px', borderRadius: '3px' },

  // Floating Bottom Bar
  floatingBar: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '600px',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '15px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '1px solid #333',
    zIndex: 100 // Highest priority
  },
  barInfo: { display: 'flex', flexDirection: 'column' },
  barLabel: { fontSize: '10px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' },
  barValue: { fontSize: '14px', color: '#fff', fontWeight: '500', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  barPrice: { fontSize: '18px', color: '#e50914', fontWeight: 'bold' },
  payButton: {
    backgroundColor: '#e50914',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
  }
};

export default SeatMap;