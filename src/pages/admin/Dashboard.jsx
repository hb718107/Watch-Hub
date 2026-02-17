import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { DollarSign, ShoppingBag, Users, Package, Activity } from 'lucide-react'; // Changed icon to Activity logic if needed
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        customers: 0 // We might not track this perfectly implies users collection, but we'll try or mock
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Products Count
                const productsSnap = await getDocs(collection(db, "products"));
                const productsCount = productsSnap.size;

                // Fetch Orders for Revenue & Count
                const ordersQuery = query(collection(db, "orders"), orderBy("date", "desc")); // Assuming date string sorting works or use timestamp
                const ordersSnap = await getDocs(ordersQuery);
                const ordersData = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const totalRevenue = ordersData.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
                const totalOrders = ordersSnap.size;

                // Fetch Recent Orders (already sorted above, just slice)
                setRecentOrders(ordersData.slice(0, 5));

                setStats({
                    revenue: totalRevenue,
                    orders: totalOrders,
                    products: productsCount,
                    customers: new Set(ordersData.map(o => o.customer)).size // Unique customers from orders
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading Dashboard...</div>;
    }

    // Format currency to PKR
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);
    };

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>Dashboard</h1>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Rs</span>
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total Revenue</p>
                        <h3 className={styles.statValue}>{formatCurrency(stats.revenue)}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total Orders</p>
                        <h3 className={styles.statValue}>{stats.orders}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Products</p>
                        <h3 className={styles.statValue}>{stats.products}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Customers</p>
                        <h3 className={styles.statValue}>{stats.customers}</h3>
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                {/* Recent Orders */}
                <div className={styles.section}>
                    <h3>Recent Orders</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{formatCurrency(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Activity (Mock for now or remove if not desired, keeping mock data import removed so need to mock this or remove) */}
                {/* For now, removing Activity since we removed the import of mock data and didn't replace it with fetch logic yet.
                    To avoid errors, I will omit the Activity section or use a placeholder.
                */}
            </div>
        </div>
    );
};

export default Dashboard;
