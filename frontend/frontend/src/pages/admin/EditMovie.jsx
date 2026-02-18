import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', duration: '', genre: '', 
    language: '', releaseDate: '', posterUrl: ''
  });

  useEffect(() => {
    const fetchMovie = async () => {
      const { data } = await axios.get(`/api/movies/${id}`);
      // Format date to yyyy-MM-dd for the input field
      const formattedDate = new Date(data.releaseDate).toISOString().split('T')[0];
      setFormData({ ...data, releaseDate: formattedDate });
    };
    fetchMovie();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/movies/${id}`, formData, config);
      alert('Movie Updated!');
      navigate('/admin/dashboard');
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <div style={{ padding: '40px', color: 'white', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Edit Movie</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required style={styles.input} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" style={styles.textarea} required />
        <input name="duration" type="number" value={formData.duration} onChange={handleChange} placeholder="Duration" required style={styles.input} />
        <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" required style={styles.input} />
        <input name="language" value={formData.language} onChange={handleChange} placeholder="Language" required style={styles.input} />
        <input name="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} required style={styles.input} />
        <input name="posterUrl" value={formData.posterUrl} onChange={handleChange} placeholder="Poster URL" required style={styles.input} />
        <button type="submit" className="btn" style={{ backgroundColor: '#f39c12' }}>Update Movie</button>
      </form>
    </div>
  );
};

const styles = {
  input: { padding: '10px', borderRadius: '5px', border: 'none' },
  textarea: { padding: '10px', borderRadius: '5px', border: 'none', minHeight: '100px' }
};

export default EditMovie;