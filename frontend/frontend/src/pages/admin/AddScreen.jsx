import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddScreen = () => {
  const navigate = useNavigate();
  const [theatres, setTheatres] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    theatreId: '',
    city: '',
    seatConfiguration: [] // We will auto-fill this
  });

  // 1. Fetch Theatres on Load (so user can select one)
  useEffect(() => {
    const fetchTheatres = async () => {
      // In a real app, you'd have a public API for this, 
      // but for now we can rely on the admin to know the IDs 
      // OR we can quickly fetch them if we had a "get all theatres" endpoint.
      // Since we didn't build a "Get All Theatres" API for frontend yet,
      // We will ask the user to Paste the Theatre ID for now to keep it moving.
      // (We will improve this in the polish phase).
    };
    fetchTheatres();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper: Generates a standard 3-row layout (A, B, C)
  const generateStandardLayout = () => {
    const layout = [
      { rowLabel: 'A', seatCount: 10, price: 300, seatType: 'Premium' },
      { rowLabel: 'B', seatCount: 12, price: 200, seatType: 'Standard' },
      { rowLabel: 'C', seatCount: 15, price: 150, seatType: 'Standard' }
    ];
    setFormData({ ...formData, seatConfiguration: layout });
    alert("Standard Layout Applied (Rows A, B, C)");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (formData.seatConfiguration.length === 0) {
      alert("Please click 'Generate Layout' first!");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.post('/api/admin/screens', formData, config);
      alert('Screen Added Successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error adding screen. Check console.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add New Screen</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          name="name" 
          placeholder="Screen Name (e.g. IMAX Hall)" 
          onChange={handleChange} 
          required 
        />
        
        {/* For now, we manually paste the Theatre ID. 
            Later we can make this a dropdown menu. */}
        <input 
          name="theatreId" 
          placeholder="Paste Theatre ID here" 
          onChange={handleChange} 
          required 
        />
        
        <input 
          name="city" 
          placeholder="City (Must match Theatre City)" 
          onChange={handleChange} 
          required 
        />

        <div style={styles.layoutSection}>
          <p>Seat Layout:</p>
          <button 
            type="button" 
            onClick={generateStandardLayout} 
            className="btn" 
            style={{ backgroundColor: '#555' }}
          >
            Generate Standard Layout (3 Rows)
          </button>
          <p style={{fontSize: '12px', color: '#aaa'}}>
            {formData.seatConfiguration.length > 0 
              ? "Layout Active: 3 Rows (37 Seats Total)" 
              : "No Layout Selected"}
          </p>
        </div>
        
        <button type="submit" className="btn">Create Screen</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white', maxWidth: '600px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  layoutSection: {
    border: '1px dashed #555',
    padding: '15px',
    borderRadius: '4px',
    textAlign: 'center'
  }
};

export default AddScreen;