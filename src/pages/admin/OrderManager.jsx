import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Eye, Loader2 } from 'lucide-react';
import styles from './ProductManager.module.css'; // Re-use styles for consistency

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const q = query(collection(db, "orders"), orderBy("date", "desc"));
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Format currency to PKR
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loader2 className="spin" size={40} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Order Manager</h1>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.date}</td>
                                <td>{order.items}</td>
                                <td className={styles.price}>{formatCurrency(order.total)}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        backgroundColor:
                                            order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' :
                                                order.status === 'Processing' ? 'rgba(59, 130, 246, 0.1)' :
                                                    order.status === 'Pending' ? 'rgba(249, 115, 22, 0.1)' :
                                                        'rgba(239, 68, 68, 0.1)',
                                        color:
                                            order.status === 'Delivered' ? '#10b981' :
                                                order.status === 'Processing' ? '#3b82f6' :
                                                    order.status === 'Pending' ? '#f97316' :
                                                        '#ef4444'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className={styles.actionBtn} title="View Details">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManager;
