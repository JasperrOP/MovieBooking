import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/staff/food-orders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/staff/food-orders/${id}`, { status }, config);
      fetchOrders(); // Refresh list
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div style={{color:'white', padding:'40px'}}>Loading Orders...</div>;

  return (
    <div style={styles.container}>
      <h1 style={{marginBottom: '20px'}}>Kitchen Orders</h1>
      <div style={styles.grid}>
        {orders.length === 0 ? (
          <p>No active food orders.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <h3>Order ID: {order._id.slice(-6)}</h3>
              <p><strong>Customer:</strong> {order.user?.name}</p>
              <p><strong>Movie:</strong> {order.showtimeId?.movie?.title}</p>
              <hr style={{borderColor: '#333'}} />
              <ul>
                {order.foodItems.map((item, index) => (
                  <li key={index}>{item.name} x {item.quantity}</li>
                ))}
              </ul>
              <div style={styles.btnGroup}>
                <button 
                  style={{...styles.statusBtn, backgroundColor: '#f1c40f'}}
                  onClick={() => updateStatus(order._id, 'Ready')}
                >
                  Mark Ready
                </button>
                <button 
                  style={{...styles.statusBtn, backgroundColor: '#2ecc71'}}
                  onClick={() => updateStatus(order._id, 'Delivered')}
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: 'white', minHeight: '100vh', backgroundColor: '#1a1a1a' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  orderCard: { backgroundColor: '#2c2c2c', padding: '20px', borderRadius: '10px', border: '1px solid #444' },
  btnGroup: { display: 'flex', gap: '10px', marginTop: '15px' },
  statusBtn: { border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', color: 'black', fontWeight: 'bold', flex: 1 }
};

export default StaffDashboard;