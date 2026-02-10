import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: '',
    language: '',
    releaseDate: '',
    posterUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the Token for permission
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token!
          'Content-Type': 'application/json',
        },
      };

      await axios.post('/api/admin/movies', formData, config);
      
      alert('Movie Added Successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error adding movie');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="title" placeholder="Movie Title" onChange={handleChange} required />
        <textarea 
          name="description" 
          placeholder="Description" 
          onChange={handleChange} 
          style={styles.textarea} 
          required 
        />
        <input name="duration" type="number" placeholder="Duration (mins)" onChange={handleChange} required />
        <input name="genre" placeholder="Genre (e.g., Sci-Fi)" onChange={handleChange} required />
        <input name="language" placeholder="Language" onChange={handleChange} required />
        <input name="releaseDate" type="date" onChange={handleChange} required />
        <input name="posterUrl" placeholder="Poster Image URL" onChange={handleChange} required />
        
        <button type="submit" className="btn">Add Movie</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white', maxWidth: '600px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  textarea: {
    backgroundColor: '#333', border: '1px solid #333', color: 'white',
    padding: '12px', borderRadius: '4px', minHeight: '100px'
  }
};

export default AddMovie;