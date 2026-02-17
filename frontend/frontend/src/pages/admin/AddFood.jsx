import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFood = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Snack');
  const [image, setImage] = useState('');
  
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

      await axios.post('/api/food', { name, price, category, image }, config);
      alert('Food Item Added!');
      navigate('/admin/dashboard');
    } catch (error) {
      alert('Failed to add food');
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{color:'white', textAlign:'center'}}>Add New Food Item</h2>
        
        <input 
          style={styles.input} 
          placeholder="Item Name (e.g. Large Popcorn)" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        
        <input 
          style={styles.input} 
          type="number" 
          placeholder="Price (e.g. 250)" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
        />

        <select 
          style={styles.input} 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Snack">Snack</option>
          <option value="Drink">Drink</option>
          <option value="Combo">Combo</option>
        </select>

        <input 
          style={styles.input} 
          placeholder="Image URL (e.g. https://image.com/popcorn.png)" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
        />

        <button type="submit" style={styles.button}>Add Item</button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
  form: { backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '10px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '5px', border: 'none', backgroundColor: '#333', color: 'white', fontSize: '16px' },
  button: { padding: '15px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }
};

export default AddFood;