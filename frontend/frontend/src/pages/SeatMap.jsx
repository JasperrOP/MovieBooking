import React from 'react';

const SeatMap = ({ show, selectedSeats, setSelectedSeats }) => {
  const isBooked = (seatLabel) => show.bookedSeats.some(booked => booked.type === seatLabel);

  const handleSeatClick = (seatLabel, price) => {
    if (isBooked(seatLabel)) return;
    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatLabel));
    } else {
      if (selectedSeats.length < 6) setSelectedSeats([...selectedSeats, seatLabel]);
      else alert("Max 6 seats allowed.");
    }
  };

  return (
    <div className="seat-map-container">
      {/* 3D Curved Screen Effect */}
      <div className="screen-container">
        <div className="screen-glow"></div>
        <div className="screen">SCREEN</div>
      </div>

      <div className="seats-grid">
        {show.screen.seatConfiguration.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            <div className="row-label">{row.rowLabel}</div>
            
            {Array.from({ length: row.seatCount }).map((_, seatIndex) => {
              const seatLabel = `${row.rowLabel}${seatIndex + 1}`;
              const booked = isBooked(seatLabel);
              const selected = selectedSeats.includes(seatLabel);
              const isPremium = row.price > 200; // Example logic

              return (
                <div
                  key={seatLabel}
                  className={`seat ${booked ? 'booked' : selected ? 'selected' : ''} ${isPremium ? 'premium' : ''}`}
                  onClick={() => handleSeatClick(seatLabel, row.price)}
                  title={`${seatLabel} - Rs. ${row.price}`} // Tooltip
                >
                  {/* Small curve for seat top */}
                  <div className="seat-top"></div> 
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item"><div className="seat"></div> Available</div>
        <div className="legend-item"><div className="seat selected"></div> Selected</div>
        <div className="legend-item"><div className="seat booked"></div> Booked</div>
        <div className="legend-item"><div className="seat premium"></div> Premium</div>
      </div>

      {/* --- CSS STYLES INJECTED HERE FOR SIMPLICITY --- */}
      <style>{`
        .seat-map-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
          perspective: 1000px; /* Essential for 3D effect */
        }

        /* THE CINEMA SCREEN */
        .screen-container {
          margin-bottom: 50px;
          transform: rotateX(-10deg);
          box-shadow: 0 50px 40px -20px rgba(255, 255, 255, 0.2);
        }
        .screen {
          width: 300px;
          height: 60px;
          background: #fff;
          transform: rotateX(-30deg) scale(0.8);
          box-shadow: 0 3px 10px rgba(255,255,255,0.7);
          border-radius: 20px 20px 0 0;
          opacity: 0.8;
          text-align: center;
          line-height: 60px;
          color: #000;
          font-weight: bold;
          letter-spacing: 5px;
        }

        /* SEAT GRID */
        .seats-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .seat-row {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }
        .row-label {
          width: 30px;
          color: #888;
          font-weight: bold;
        }

        /* INDIVIDUAL SEAT STYLING */
        .seat {
          width: 28px;
          height: 24px;
          background-color: #444; /* Standard Seat */
          border-radius: 6px 6px 2px 2px;
          cursor: pointer;
          transition: 0.2s;
          position: relative;
        }
        .seat:hover {
          transform: scale(1.2);
          background-color: #666;
        }
        .seat.selected {
          background-color: #4caf50;
          box-shadow: 0 0 10px #4caf50;
        }
        .seat.booked {
          background-color: #222;
          cursor: not-allowed;
          opacity: 0.5;
        }
        .seat.premium {
          border-top: 3px solid gold; /* Gold stripe for premium */
        }
        
        .legend {
          display: flex;
          gap: 20px;
          margin-top: 40px;
          background: #1e1e1e;
          padding: 10px 20px;
          border-radius: 20px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default SeatMap;