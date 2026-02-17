import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Star, Send } from 'lucide-react';
import styles from './WriteReview.module.css';

const WriteReview = ({ productId, onReviewAdded }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to write a review.");
            return;
        }

        setSubmitting(true);
        try {
            const reviewData = {
                productId,
                user: user.displayName || user.email,
                rating,
                comment,
                date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
            };

            await addDoc(collection(db, "reviews"), reviewData);
            setComment('');
            setRating(5);
            alert("Review submitted successfully!");
            if (onReviewAdded) onReviewAdded();

        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Write a Review</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={styles.starBtn}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                size={24}
                                fill={star <= rating ? "#facc15" : "none"}
                                color={star <= rating ? "#facc15" : "#e5e7eb"}
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    className={styles.textarea}
                    placeholder="Share your thoughts about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />

                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    <Send size={18} />
                    {submitting ? 'Submitting...' : 'Post Review'}
                </button>
            </form>
        </div>
    );
};

export default WriteReview;
