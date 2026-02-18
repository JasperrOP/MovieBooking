import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';

const StaffScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState('');
  const [manualId, setManualId] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  // Function to handle the verification logic
  const verifyTicket = async (bookingId) => {
    // Prevent double scanning or empty inputs
    if (!isScanning || !bookingId) return; 
    
    setIsScanning(false); // Pause scanning while processing
    setScanResult(bookingId);
    setMessage({ type: 'info', text: 'Verifying...' });

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // --- FIX IS HERE ---
      // 1. Changed PUT to POST
      // 2. URL is now '/api/staff/verify-ticket' (removed ID from URL)
      // 3. Data is sent in the body: { ticketId: bookingId }
      const { data } = await axios.post(
        '/api/staff/verify-ticket', 
        { ticketId: bookingId }, 
        config
      );
      
      // Success Message
      setMessage({ 
        type: 'success', 
        text: `✅ Access Granted! User: ${data.booking?.user || 'Guest'}` 
      });

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Verification Failed';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    }
  };

  // Helper to reset and scan again
  const handleReset = () => {
    setScanResult(null);
    setMessage('');
    setManualId('');
    setIsScanning(true);
  };

  return (
    <div style={styles.container}>
      <h2>Ticket Scanner</h2>

      {/* --- CAMERA SCANNER --- */}
      {isScanning ? (
        <div style={styles.scannerWrapper}>
            <Scanner 
                onScan={(result) => {
                    if (result && result[0]) {
                        verifyTicket(result[0].rawValue);
                    }
                }}
                components={{ audio: false, finder: true }}
                styles={{ container: { width: '100%', maxWidth: '400px' } }}
            />
            <p style={{marginTop: '10px'}}>Point camera at QR code</p>
        </div>
      ) : (
        <div style={styles.resultCard}>
           {/* Result Display */}
           <h3 style={{ color: message.type === 'success' ? '#2ecc71' : message.type === 'error' ? '#e74c3c' : '#3498db' }}>
             {message.text}
           </h3>
           <button onClick={handleReset} className="btn" style={{marginTop: '20px', backgroundColor: '#333'}}>
             Scan Next Ticket
           </button>
        </div>
      )}

      <div style={styles.divider}>OR</div>

      {/* --- MANUAL ENTRY FALLBACK --- */}
      <div style={styles.manualEntry}>
        <input 
            type="text" 
            placeholder="Enter Booking ID manually" 
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            style={styles.input}
        />
        <button 
            className="btn" 
            onClick={() => verifyTicket(manualId)}
            disabled={!manualId || !isScanning}
        >
            Verify ID
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', color: 'white', maxWidth: '500px', margin: '0 auto', textAlign: 'center' },
  scannerWrapper: { border: '2px solid #333', borderRadius: '10px', overflow: 'hidden', margin: '0 auto' },
  resultCard: { backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '10px', marginTop: '20px' },
  divider: { margin: '30px 0', color: '#aaa', fontWeight: 'bold' },
  manualEntry: { display: 'flex', gap: '10px', justifyContent: 'center' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#222', color: 'white', width: '70%' }
};

export default StaffScanner;