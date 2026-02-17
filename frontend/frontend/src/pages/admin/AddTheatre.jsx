import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTheatre = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  // --- NEW STATE ---
  const [hasFoodService, setHasFoodService] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // --- UPDATED PAYLOAD ---
      await axios.post('/api/admin/theatres', { 
        name, 
        location, 
        city, 
        isActive: true,
        hasFoodService // Sending the checkbox value
      }, config);

      alert('Theatre Added Successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to add theatre');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Add New Theatre</h2>
        
        <input 
          style={styles.input} 
          placeholder="Theatre Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        
        <input 
          style={styles.input} 
          placeholder="Location (e.g. VR Mall)" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required 
        />
        
        <input 
          style={styles.input} 
          placeholder="City" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          required 
        />

        {/* --- NEW CHECKBOX --- */}
        <div style={{display:'flex', alignItems:'center', gap:'10px', color:'white', padding: '0 5px'}}>
           <input 
             type="checkbox" 
             id="foodService"
             checked={hasFoodService} 
             onChange={(e) => setHasFoodService(e.target.checked)}
             style={{width:'18px', height:'18px', cursor: 'pointer'}}
           />
           <label htmlFor="foodService" style={{cursor: 'pointer', fontSize: '16px'}}>
             Enable Food Ordering Service?
           </label>
        </div>

        <button type="submit" style={styles.button}>Add Theatre</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
  },
  form: {
    backgroundColor: '#1e1e1e',
    padding: '40px',
    borderRadius: '10px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
  },
  input: {
    padding: '15px',
    borderRadius: '5px',
    border: '1px solid #333',
    backgroundColor: '#2c2c2c',
    color: 'white',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    padding: '15px',
    backgroundColor: '#e50914',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '10px'
  }
};

export default AddTheatre;