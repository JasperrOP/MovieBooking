import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTheatre = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    isActive: true
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

      // 1. Add the Theatre
      const { data } = await axios.post('/api/admin/theatres', formData, config);
      
      alert(`Theatre "${data.name}" Added! Now let's add a Screen.`);
      
      // 2. Redirect to a (future) Add Screen page, passing the Theatre ID
      // We haven't built this yet, so for now, go back to Dashboard
      navigate('/admin/dashboard'); 
      
    } catch (error) {
      console.error(error);
      alert('Error adding theatre');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add New Theatre</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Theatre Name (e.g. PVR Cinemas)" onChange={handleChange} required />
        <input name="location" placeholder="Location (e.g. Downtown Mall)" onChange={handleChange} required />
        <input name="city" placeholder="City" onChange={handleChange} required />
        
        <button type="submit" className="btn">Add Theatre</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white', maxWidth: '600px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' }
};

export default AddTheatre;