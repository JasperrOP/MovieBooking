import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ScheduleShow = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    startTime: '',
    price: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.post('/api/shows', formData, config);
      
      alert('Show Scheduled Successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error scheduling show. Check IDs.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Schedule a Showtime</h2>
      <p style={{fontSize: '14px', color: '#ccc', marginBottom: '20px'}}>
        Tip: Copy IDs from MongoDB Compass (Movies, Theatres, Screens collections)
      </p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          name="movieId" 
          placeholder="Paste Movie ID" 
          onChange={handleChange} 
          required 
        />
        <input 
          name="theatreId" 
          placeholder="Paste Theatre ID" 
          onChange={handleChange} 
          required 
        />
        <input 
          name="screenId" 
          placeholder="Paste Screen ID" 
          onChange={handleChange} 
          required 
        />
        
        <label style={{marginTop: '10px'}}>Start Time:</label>
        <input 
          name="startTime" 
          type="datetime-local" 
          onChange={handleChange} 
          required 
        />
        
        <input 
          name="price" 
          type="number" 
          placeholder="Base Price (e.g. 200)" 
          onChange={handleChange} 
          required 
        />
        
        <button type="submit" className="btn">Publish Show</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white', maxWidth: '600px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' }
};

export default ScheduleShow;