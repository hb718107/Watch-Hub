import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import Button from '../../components/common/Button';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>Product not found</h2>
                <Link to="/products" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                    Back to Collection
                </Link>
            </div>
        );
    }

    return (
        <div className={`container ${styles.pageContainer}`}>
            <Link to="/products" className={styles.backLink}>
                <ArrowLeft size={16} />
                Back to Collection
            </Link>

            <div className={styles.grid}>
                {/* Image Section */}
                <div className={styles.imageContainer}>
                    <img src={product.image} alt={product.name} className={styles.image} />
                </div>

                {/* Info Section */}
                <div className={styles.info}>
                    <span className={styles.category}>{product.category}</span>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.price}>Rs. {product.price.toLocaleString()}</p>

                    <div className={styles.description}>
                        <p>{product.description}</p>
                        <p>
                            Experience the perfect blend of style and functionality.
                            This timepiece is crafted with precision to ensure durability and elegance for any occasion.
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <Button onClick={() => addToCart(product)} className={styles.addToCartBtn}>
                            <ShoppingBag size={20} style={{ marginRight: '0.5rem' }} />
                            Add to Cart
                        </Button>
                    </div>

                    {/* Features / Trust Badges */}
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <Truck size={20} className={styles.featureIcon} />
                            <div>
                                <h4>Free Shipping</h4>
                                <p>On all orders over $200</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <ShieldCheck size={20} className={styles.featureIcon} />
                            <div>
                                <h4>2 Year Warranty</h4>
                                <p>Comprehensive protection</p>
                            </div>
                        </div>
                        <div className={styles.feature}>
                            <RefreshCw size={20} className={styles.featureIcon} />
                            <div>
                                <h4>Free Returns</h4>
                                <p>Within 30 days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
