import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderFood = () => {
  const { id } = useParams(); // Booking ID
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({}); // { "Popcorn": {price: 200, qty: 1} }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get('/api/food');
        setMenu(data);
      } catch (error) { console.error(error); }
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const currentQty = prev[item.name]?.qty || 0;
      return {
        ...prev,
        [item.name]: { price: item.price, qty: currentQty + 1 }
      };
    });
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      const currentQty = prev[item.name]?.qty || 0;
      if (currentQty <= 1) {
        const newCart = { ...prev };
        delete newCart[item.name];
        return newCart;
      }
      return {
        ...prev,
        [item.name]: { price: item.price, qty: currentQty - 1 }
      };
    });
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const handlePlaceOrder = async () => {
    if (calculateTotal() === 0) return alert("Select items first!");
    
    // Convert cart object to array for backend
    const foodItems = Object.keys(cart).map(name => ({
      name,
      quantity: cart[name].qty,
      price: cart[name].price
    }));

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.put(`/api/bookings/${id}/food`, {
        foodItems,
        totalPrice: calculateTotal()
      }, config);

      alert('Food Ordered Successfully! 🍿');
      navigate('/my-bookings');
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{textAlign: 'center', marginBottom: '30px'}}>🍿 Order Snacks</h2>
      
      <div style={styles.menuGrid}>
        {menu.map((item) => (
          <div key={item._id} style={styles.card}>
            {item.image && <img src={item.image} alt={item.name} style={styles.image} />}
            <h3>{item.name}</h3>
            <p style={{color: '#aaa'}}>{item.category}</p>
            <div style={styles.priceRow}>
              <span style={{fontSize: '18px', fontWeight: 'bold'}}>Rs. {item.price}</span>
              
              <div style={styles.counter}>
                 <button style={styles.countBtn} onClick={() => removeFromCart(item)}>-</button>
                 <span>{cart[item.name]?.qty || 0}</span>
                 <button style={styles.countBtn} onClick={() => addToCart(item)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {calculateTotal() > 0 && (
        <div style={styles.footer}>
           <div>
             <span style={{color: '#aaa'}}>Total: </span>
             <span style={{fontSize: '24px', fontWeight: 'bold'}}>Rs. {calculateTotal()}</span>
           </div>
           <button style={styles.payBtn} onClick={handlePlaceOrder}>
             Confirm Order
           </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white', paddingBottom: '100px' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', textAlign: 'center' },
  image: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' },
  counter: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#333', borderRadius: '5px', padding: '5px' },
  countBtn: { background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', width: '25px' },
  footer: { position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#111', padding: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #333' },
  payBtn: { padding: '15px 40px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }
};

export default OrderFood;