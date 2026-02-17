import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import styles from './Checkout.module.css';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const total = getCartTotal();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            clearCart();
        }, 1500);
    };

    if (cartItems.length === 0 && !isSubmitted) {
        return (
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
                <h2>Cart is empty</h2>
                <Button onClick={() => navigate('/products')}>Browse Collection</Button>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
                <h1 className={styles.successTitle}>Thank You!</h1>
                <p className={styles.successText}>Your order has been placed successfully.</p>
                <p>Order ID: #WH-{Math.floor(Math.random() * 10000)}</p>
                <div style={{ marginTop: '2rem' }}>
                    <Button onClick={() => navigate('/')}>Return Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`container ${styles.pageContainer}`}>
            <h1 className={styles.title}>Checkout</h1>

            <div className={styles.layout}>
                {/* Form */}
                <div className={styles.formSection}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <h2 className={styles.sectionTitle}>Shipping Information</h2>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    required
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Payment Details</h2>

                        <div className={styles.formGroup}>
                            <label>Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="0000 0000 0000 0000"
                                required
                                maxLength="19"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    placeholder="MM/YY"
                                    required
                                    maxLength="5"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder="123"
                                    required
                                    maxLength="3"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="primary" className={styles.submitBtn}>
                            Place Order (Rs. {total.toLocaleString()})
                        </Button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <h3>Order Summary</h3>
                        <div className={styles.summaryItems}>
                            {cartItems.map(item => (
                                <div key={item.id} className={styles.summaryItem}>
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span>Rs. {total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
