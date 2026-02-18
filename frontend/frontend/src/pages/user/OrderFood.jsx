import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderFood = () => {
  const { id } = useParams(); // Booking ID
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null); // Store movie info here
  const [cart, setCart] = useState({}); 

  // --- 1. Fetch Menu AND Booking Details ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        // Fetch Menu
        const menuRes = await axios.get('/api/food');
        setMenu(menuRes.data);

        // Fetch Booking Details (To show Movie Name, Time, etc.)
        const bookingRes = await axios.get(`/api/bookings/${id}`, config);
        setBookingDetails(bookingRes.data);

      } catch (error) { 
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  // --- Cart Logic (Same as before) ---
  const addToCart = (item) => {
    setCart((prev) => {
      const currentQty = prev[item.name]?.qty || 0;
      return { ...prev, [item.name]: { price: item.price, qty: currentQty + 1 } };
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
      return { ...prev, [item.name]: { price: item.price, qty: currentQty - 1 } };
    });
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const handlePlaceOrder = async () => {
    if (calculateTotal() === 0) return alert("Select items first!");
    
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
      {/* --- NEW: Booking Context Header --- */}
      {bookingDetails && (
        <div style={styles.headerCard}>
          <div style={{flex: 1}}>
            <h2 style={{margin: 0, color: '#e50914'}}>
              Ordering Snacks for: {bookingDetails.showtime?.movie?.title}
            </h2>
            <p style={{margin: '5px 0', color: '#ccc'}}>
              📍 {bookingDetails.showtime?.theatre?.name} | 
              🕒 {new Date(bookingDetails.showtime?.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
           {/* Show existing seats to confirm context */}
          <div style={styles.seatBadge}>
            Seats: {bookingDetails.seats.join(', ')}
          </div>
        </div>
      )}

      <h3 style={{marginBottom: '20px', borderBottom:'1px solid #333', paddingBottom:'10px'}}>Menu</h3>
      
      <div style={styles.menuGrid}>
        {menu.map((item) => (
          <div key={item._id} style={styles.card}>
            {item.image && <img src={item.image} alt={item.name} style={styles.image} />}
            <h3>{item.name}</h3>
            <p style={{color: '#aaa', fontSize:'14px'}}>{item.category}</p>
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
             Pay & Confirm
           </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'white', paddingBottom: '100px' },
  headerCard: { 
    backgroundColor: '#222', padding: '20px', borderRadius: '12px', marginBottom: '30px', 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #333'
  },
  seatBadge: { backgroundColor: '#333', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid #333' },
  image: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' },
  counter: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#333', borderRadius: '5px', padding: '5px' },
  countBtn: { background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', width: '20px' },
  footer: { position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#111', padding: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #333', zIndex: 100 },
  payBtn: { padding: '12px 30px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }
};

export default OrderFood;