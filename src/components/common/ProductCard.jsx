import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from './Button';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className={styles.card}>
            <Link to={`/products/${product.id}`} className={styles.imageContainer}>
                <img src={product.image} alt={product.name} className={styles.image} />
                {product.isNew && <span className={styles.badge}>New Arrival</span>}
            </Link>

            <div className={styles.details}>
                <span className={styles.category}>{product.category}</span>
                <Link to={`/products/${product.id}`} className={styles.name}>
                    {product.name}
                </Link>
                <span className={styles.price}>Rs. {product.price.toLocaleString()}</span>

                <Button
                    variant="secondary"
                    className={styles.addBtn}
                    onClick={() => addToCart(product)}
                >
                    <ShoppingBag size={16} style={{ marginRight: '0.5rem' }} />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
