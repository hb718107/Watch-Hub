import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import styles from './Checkout.module.css';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isGiftWrapped, setIsGiftWrapped] = useState(false);
    const GIFT_WRAP_COST = 200;

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

    const subtotal = getCartTotal();
    const total = subtotal + (isGiftWrapped ? GIFT_WRAP_COST : 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            items: cartItems,
            subtotal,
            giftWrap: isGiftWrapped,
            total,
            paymentMethod,
            shippingDetails: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode
            },
            status: 'Processing',
            date: new Date().toISOString(),
            createdAt: new Date()
        };

        try {
            await addDoc(collection(db, "orders"), orderData);
            setIsSubmitted(true);
            clearCart();
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
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

                        <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Payment Method</h2>

                        <div className={styles.paymentMethods} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <label style={{
                                flex: 1,
                                padding: '1rem',
                                border: `2px solid ${paymentMethod === 'card' ? 'var(--color-accent)' : '#eee'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                />
                                <span>Credit Card</span>
                            </label>
                            <label style={{
                                flex: 1,
                                padding: '1rem',
                                border: `2px solid ${paymentMethod === 'cod' ? 'var(--color-accent)' : '#eee'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="fade-in">
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
                            </div>
                        )}

                        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isGiftWrapped}
                                    onChange={(e) => setIsGiftWrapped(e.target.checked)}
                                    style={{ width: '1.2rem', height: '1.2rem' }}
                                />
                                <div>
                                    <span style={{ fontWeight: '500', display: 'block' }}>Add Gift Verification (+Rs. 200)</span>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Premium packaging with a personalized note card.</span>
                                </div>
                            </label>
                        </div>

                        <Button type="submit" variant="primary" className={styles.submitBtn} style={{ marginTop: '2rem' }}>
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

                        <div className={styles.summaryRow} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                            <span>Subtotal</span>
                            <span>Rs. {subtotal.toLocaleString()}</span>
                        </div>

                        {isGiftWrapped && (
                            <div className={styles.summaryRow} style={{ color: 'var(--color-accent)' }}>
                                <span>Gift Wrap</span>
                                <span>Rs. {GIFT_WRAP_COST}</span>
                            </div>
                        )}

                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>

                        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
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
