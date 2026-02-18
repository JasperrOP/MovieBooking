import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SeatMap = ({ show, selectedSeats, setSelectedSeats }) => {
  const [localShow, setLocalShow] = useState(show);

  // --- REAL-TIME UPDATE LOGIC ---
  // Poll the server every 3 seconds to get the latest booked seats
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        // Handle case where show.movie is an object or a string ID
        const movieId = typeof show.movie === 'object' ? show.movie._id : show.movie;
        
        const { data } = await axios.get(`/api/shows/movie/${movieId}`);
        
        // Find the specific showtime we are currently viewing
        const updatedShow = data.find(s => s._id === show._id);
        
        if (updatedShow) {
          setLocalShow(updatedShow);
        }
      } catch (error) {
        console.error("Error updating seat status:", error);
      }
    };

    // Initial fetch
    fetchLatestData();

    // Set interval
    const interval = setInterval(fetchLatestData, 3000); 
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [show._id, show.movie]);


  // --- SEAT CLICK HANDLER ---
  const handleSeatClick = (seatLabel, price) => {
    const bookedSeats = localShow.bookedSeats || [];

    // 1. Prevent clicking if Seat is Booked
    if (bookedSeats.includes(seatLabel)) {
      return; 
    }

    // 2. Toggle Selection (Add/Remove)
    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatLabel));
    } else {
      setSelectedSeats([...selectedSeats, seatLabel]);
    }
  };


  // --- RENDER LOGIC ---
  const renderSeats = () => {
    if (!localShow.screen || !localShow.screen.seatConfiguration) {
        return <div style={{color:'#aaa'}}>No seat layout available.</div>;
    }

    return localShow.screen.seatConfiguration.map((row) => (
      <div key={row.rowLabel} style={styles.row}>
        {/* Row Label (A, B, C...) */}
        <span style={styles.rowLabel}>{row.rowLabel}</span>
        
        <div style={styles.seatsContainer}>
          {Array.from({ length: row.seatCount }).map((_, index) => {
            const seatNumber = index + 1;
            const seatLabel = `${row.rowLabel}${seatNumber}`;
            
            // Check status based on LIVE data
            const isBooked = (localShow.bookedSeats || []).includes(seatLabel);
            const isSelected = selectedSeats.includes(seatLabel);

            return (
              <div
                key={seatLabel}
                onClick={() => handleSeatClick(seatLabel, row.price)}
                style={{
                  ...styles.seat,
                  // Dynamic Styling based on Status
                  backgroundColor: isBooked ? '#444' : isSelected ? '#e50914' : '#fff', 
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  color: isBooked ? '#777' : isSelected ? 'white' : 'black',
                  border: isBooked ? '1px solid #444' : isSelected ? 'none' : '1px solid #ccc',
                  opacity: isBooked ? 0.6 : 1
                }}
                title={isBooked ? `Seat ${seatLabel} (Unavailable)` : `Seat ${seatLabel} - Rs. ${row.price}`}
              >
                {seatNumber}
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div style={styles.container}>
      {/* Screen Visual */}
      <div style={styles.screen}>SCREEN THIS WAY</div>
      
      {/* The Grid */}
      <div style={styles.mapWrapper}>
        {renderSeats()}
      </div>
      
      {/* Legend / Key */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
            <div style={{...styles.dot, background:'#fff', border:'1px solid #ccc'}}></div> 
            Available
        </div>
        <div style={styles.legendItem}>
            <div style={{...styles.dot, background:'#e50914'}}></div> 
            Selected
        </div>
        <div style={styles.legendItem}>
            <div style={{...styles.dot, background:'#444', border:'1px solid #444', opacity:0.6}}></div> 
            Booked
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { marginTop: '20px', textAlign: 'center' },
  screen: { 
    height: '15px', background: 'linear-gradient(to bottom, #eee, #aaa)', 
    margin: '0 auto 50px auto', width: '80%', borderRadius: '50% 50% 0 0', 
    transform: 'perspective(400px) rotateX(-10deg)', 
    boxShadow: '0 20px 30px rgba(255,255,255,0.1)',
    color: '#000', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight:'bold', letterSpacing:'2px'
  },
  mapWrapper: { display: 'inline-block', padding: '30px', background: '#222', borderRadius: '12px', border: '1px solid #333' },
  row: { display: 'flex', alignItems: 'center', marginBottom: '12px', justifyContent: 'center' },
  rowLabel: { width: '30px', fontWeight: 'bold', color: '#aaa', marginRight: '15px', textAlign:'right' },
  seatsContainer: { display: 'flex', gap: '8px' },
  seat: {
    width: '32px', height: '32px', borderRadius: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 'bold', transition: 'all 0.2s ease',
    userSelect: 'none'
  },
  legend: { display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px', color: '#ccc' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  dot: { width: '16px', height: '16px', borderRadius: '4px' }
};

export default SeatMap;