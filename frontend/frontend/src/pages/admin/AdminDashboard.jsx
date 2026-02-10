import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    // Get user info to make sure they are actually an admin
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || userInfo.role !== 'admin') {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
                <h1>Access Denied</h1>
                <p>You must be an Admin to view this page.</p>
                <button className="btn" onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>

            <div style={styles.grid}>
                {/* Card 1: Manage Movies */}
                <div style={styles.card}>
                    <h3>🎬 Movies</h3>
                    <p>Add new movies to the database.</p>
                    <Link to="/admin/add-movie">
                        <button className="btn">Add Movie</button>
                    </Link>
                </div>

                {/* Card 2: Manage Theatres */}
                <div style={styles.card}>
                    <h3>🏢 Theatres</h3>
                    <p>Register new theatre locations.</p>
                    <Link to="/admin/add-theatre">
                        <button className="btn">Add Theatre</button>
                    </Link>
                </div>

                {/* Card 3: Manage Screens */}
                <div style={styles.card}>
                    <h3>📺 Screens</h3>
                    <p>Add screens and seat layouts.</p>
                    <Link to="/admin/add-screen">
                        <button className="btn">Add Screen</button>
                    </Link>
                </div>
                {/* Card 4: Schedule Shows */}
                <div style={styles.card}>
                    <h3>📅 Schedule</h3>
                    <p>Create showtimes & prices.</p>
                    <Link to="/admin/schedule-show">
                        <button className="btn" style={{ backgroundColor: '#e87c03' }}>Schedule</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        color: 'white',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    grid: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    card: {
        backgroundColor: 'var(--bg-card)',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        textAlign: 'center',
    }
};

export default AdminDashboard;