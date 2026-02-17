import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import styles from './Cart.module.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
                <h1 className={styles.emptyTitle}>Your Cart is Empty</h1>
                <p className={styles.emptyText}>Find your perfect timepiece in our collection.</p>
                <Link to="/products">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className={`container ${styles.pageContainer}`}>
            <h1 className={styles.title}>Shopping Cart</h1>

            <div className={styles.layout}>
                {/* Cart Items List */}
                <div className={styles.itemsList}>
                    {cartItems.map(item => (
                        <div key={item.id} className={styles.item}>
                            <Link to={`/products/${item.id}`} className={styles.imageLink}>
                                <img src={item.image} alt={item.name} className={styles.image} />
                            </Link>

                            <div className={styles.itemDetails}>
                                <Link to={`/products/${item.id}`} className={styles.itemName}>{item.name}</Link>
                                <div className={styles.itemMeta}>
                                    <p className={styles.itemPrice}>Rs. {item.price.toLocaleString()}</p>
                                    <p className={styles.itemCategory}>{item.category}</p>
                                </div>
                            </div>

                            <div className={styles.controls}>
                                <div className={styles.quantity}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className={styles.qtyVal}>{item.quantity}</span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <button
                                    className={styles.removeBtn}
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className={styles.itemTotal}>
                                Rs. {(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className={styles.summary}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>

                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>Rs. {getCartTotal().toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>

                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <span>Total</span>
                        <span>Rs. {getCartTotal().toLocaleString()}</span>
                    </div>

                    <Button
                        variant="primary"
                        className={styles.checkoutBtn}
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                        <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </Button>

                    <div className={styles.secure}>
                        <p>Secure Checkout</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
