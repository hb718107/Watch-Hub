import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Star, User } from 'lucide-react';
import WriteReview from './WriteReview';
import styles from './ProductReviews.module.css';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const q = query(
                    collection(db, "reviews"),
                    where("productId", "==", productId)
                    // Note: Composite index might be needed for orderBy with where. 
                    // If fails, we'll sort client side.
                );

                const querySnapshot = await getDocs(q);
                const reviewsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Client-side sort to avoid index creation delay for user
                reviewsData.sort((a, b) => new Date(b.date) - new Date(a.date));

                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId, refreshTrigger]);

    const averageRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Customer Reviews</h2>

            <div className={styles.summary}>
                <div className={styles.averageRating}>
                    <span className={styles.ratingNumber}>{averageRating}</span>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={20}
                                fill={star <= Math.round(averageRating) ? "#facc15" : "none"}
                                color={star <= Math.round(averageRating) ? "#facc15" : "#e5e7eb"}
                            />
                        ))}
                    </div>
                    <span className={styles.reviewCount}>({reviews.length} reviews)</span>
                </div>
            </div>

            <WriteReview productId={productId} onReviewAdded={() => setRefreshTrigger(prev => prev + 1)} />

            <div className={styles.reviewsList}>
                {loading ? (
                    <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>
                                        <User size={16} />
                                    </div>
                                    <span className={styles.userName}>{review.user}</span>
                                </div>
                                <span className={styles.reviewDate}>{review.date}</span>
                            </div>
                            <div className={styles.reviewRating}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={14}
                                        fill={star <= review.rating ? "#facc15" : "none"}
                                        color={star <= review.rating ? "#facc15" : "#e5e7eb"}
                                    />
                                ))}
                            </div>
                            <p className={styles.reviewComment}>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
