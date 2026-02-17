import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Star, Trash2, Loader2 } from 'lucide-react';
import styles from './ProductManager.module.css';

const ReviewsManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "reviews"));
            const reviewsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewsData);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteDoc(doc(db, "reviews", id));
                setReviews(reviews.filter(r => r.id !== id));
            } catch (error) {
                console.error("Error deleting review:", error);
                alert("Failed to delete review.");
            }
        }
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
                <h1 className={styles.title}>All Reviews</h1>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>User</th>
                            <th>Product ID</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review.id}>
                                <td style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{review.date}</td>
                                <td>{review.user}</td>
                                <td>{review.productId}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>{review.rating}</span>
                                        <Star size={14} fill="#facc15" color="#facc15" />
                                    </div>
                                </td>
                                <td style={{ maxWidth: '300px' }}>{review.comment}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <button
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        onClick={() => handleDelete(review.id)}
                                        title="Delete Review"
                                    >
                                        <Trash2 size={18} />
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

export default ReviewsManager;
