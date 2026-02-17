import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import ProductReviews from '../../components/shop/ProductReviews';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Debug: Fetch all IDs if not found
    const [availableIds, setAvailableIds] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const cleanId = id.trim();
                const docRef = doc(db, "products", cleanId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("Product not found");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product details.");
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        if (error) {
            const fetchAllIds = async () => {
                const snap = await getDocs(collection(db, "products"));
                setAvailableIds(snap.docs.map(d => d.id));
            };
            fetchAllIds();
        }
    }, [error]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Loader2 className="spin" size={40} />
            </div>
        );
    }

    if (error || !product) {
        // Check for legacy numeric IDs (Mock Data)
        const isLegacyId = !isNaN(id) && !isNaN(parseFloat(id));

        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>{error || "Product not found"}</h2>
                <p style={{ color: '#666' }}>Requested ID: {id}</p>

                {isLegacyId && (
                    <div style={{ margin: '1rem auto', padding: '1rem', backgroundColor: '#fff7ed', border: '1px solid #fdba74', borderRadius: '8px', maxWidth: '500px', color: '#9a3412' }}>
                        <strong>Note:</strong> It looks like you're trying to view an item from an older version of the store (likely saved in your Cart).
                        Please remove this item from your Cart and browse our new collection.
                    </div>
                )}

                <div style={{ margin: '2rem 0', textAlign: 'left', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    <strong>Available IDs in DB:</strong>
                    <ul style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                        {availableIds.map(aid => (
                            <li key={aid} style={{ color: aid === id.trim() ? 'green' : 'black' }}>
                                {aid} {aid === id.trim() && "(MATCHED!)"}
                            </li>
                        ))}
                    </ul>
                </div>

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

            {/* Reviews Section */}
            <ProductReviews productId={id} />
        </div>
    );
};

export default ProductDetail;
