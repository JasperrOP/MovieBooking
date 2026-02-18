import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import axios from 'axios';

// --- 3D CHAIR COMPONENT ---
const Chair = ({ position, status, label, onClick }) => {
  const [hovered, setHovered] = useState(false);

  // --- MOUSE HANDLERS ---
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    // CHANGE CURSOR: 'not-allowed' for booked, 'pointer' for others
    document.body.style.cursor = status === 'booked' ? 'not-allowed' : 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    // RESET CURSOR
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (status !== 'booked') {
      onClick();
    }
  };

  // --- COLORS ---
  const color = status === 'booked' ? '#818181' // <--- NEW: Dark Slate for "Blocked"
              : status === 'selected' ? '#e50914' // Red for Selected
              : hovered ? '#2ecc71' // Green on Hover
              : '#ffffff'; // White Default

  return (
    <group position={position}>
      {/* The Seat (Box) */}
      <mesh 
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Armrests */}
      <mesh position={[-0.45, -0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.45, -0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* --- TOOLTIP --- */}
      {hovered && (
         <Html position={[0, 1.2, 0]} center pointerEvents="none">
            <div style={{ 
                background: status === 'booked' ? '#c0392b' : 'black', // Red bg for booked
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '12px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
            }}>
               {status === 'booked' ? `🚫 ${label} (Booked)` : label}
            </div>
         </Html>
      )}
    </group>
  );
};

// --- MAIN SEATMAP COMPONENT ---
const SeatMap = ({ show, selectedSeats, setSelectedSeats }) => {
  const [localShow, setLocalShow] = useState(show);

  // Live Poll for updates
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const movieId = typeof show.movie === 'object' ? show.movie._id : show.movie;
        const { data } = await axios.get(`/api/shows/movie/${movieId}`);
        const updatedShow = data.find(s => s._id === show._id);
        if (updatedShow) setLocalShow(updatedShow);
      } catch (error) { console.error(error); }
    };
    // Fetch immediately and then every 3s
    fetchLatestData();
    const interval = setInterval(fetchLatestData, 3000); 
    return () => clearInterval(interval);
  }, [show._id, show.movie]);

  // Handle Selection
  const handleSeatClick = (seatLabel) => {
    const bookedSeats = localShow.bookedSeats || [];
    if (bookedSeats.includes(seatLabel)) return; // Double check logic

    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatLabel));
    } else {
      setSelectedSeats([...selectedSeats, seatLabel]);
    }
  };

  // Generate 3D Grid from Data
  const generateSeats = () => {
    if (!localShow.screen?.seatConfiguration) return null;

    const allSeats = [];
    const rows = localShow.screen.seatConfiguration;
    const totalRows = rows.length;
    
    rows.forEach((row, rowIndex) => {
        const seatCount = row.seatCount;
        for (let i = 0; i < seatCount; i++) {
            const seatLabel = `${row.rowLabel}${i + 1}`;
            const isBooked = (localShow.bookedSeats || []).includes(seatLabel);
            const isSelected = selectedSeats.includes(seatLabel);
            
            let status = 'available';
            if (isBooked) status = 'booked';
            if (isSelected) status = 'selected';

            // Position Logic
            const x = (i - seatCount / 2) * 1.5; 
            const z = (rowIndex - totalRows / 2) * 2;   

            allSeats.push(
                <Chair 
                    key={seatLabel}
                    position={[x, 0, z]} 
                    status={status}
                    label={seatLabel}
                    onClick={() => handleSeatClick(seatLabel)}
                />
            );
        }
    });
    return allSeats;
  };

  return (
    <div style={{ height: '500px', width: '100%', background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', position: 'relative' }}>
      
      <Canvas camera={{ position: [0, 15, 20], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={1} />
        
        <OrbitControls maxPolarAngle={Math.PI / 2.2} /> 

        {/* Screen */}
        <mesh position={[0, 2, -10]}>
            <boxGeometry args={[20, 8, 0.5]} />
            <meshStandardMaterial color="#ccc" emissive="#555" />
        </mesh>
        <Text position={[0, 2, -9.6]} fontSize={1} color="black">
            SCREEN
        </Text>
        
        {/* Floor */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[60, 60]} />
             <meshStandardMaterial color="#222" />
        </mesh>

        {/* Seats */}
        {generateSeats()}

      </Canvas>

      <div style={{
          position:'absolute', bottom: '10px', left: 0, right: 0, 
          textAlign:'center', color:'#777', fontSize:'12px', pointerEvents: 'none'
      }}>
        Left Click to Rotate • Scroll to Zoom • Right Click to Pan
      </div>
      
    </div>
  );
};

export default SeatMap;