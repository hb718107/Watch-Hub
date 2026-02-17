import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import ProductCard from '../../components/common/ProductCard';
import { categories as categoryData } from '../../data/products';
import styles from './ProductList.module.css';

const ProductList = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOption, setSortOption] = useState('default');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // DB State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Products from Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Sync with URL search param
    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchTerm(query);
        } else {
            setSearchTerm('');
        }

        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    const categories = ['All', ...categoryData.map(c => c.name)];

    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (sortOption === 'low-high') return a.price - b.price;
                if (sortOption === 'high-low') return b.price - a.price;
                return 0; // Default order
            });
    }, [products, searchTerm, selectedCategory, sortOption]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Loader2 className="spin" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={styles.clearBtn} style={{ marginTop: '1rem' }}>Retry</button>
            </div>
        );
    }

    return (
        <div className={`container ${styles.pageContainer}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Our Collection</h1>
                <p className={styles.subtitle}>Explore our precision-crafted timepieces.</p>
            </div>

            <div className={styles.controls}>
                {/* Search */}
                <div className={styles.searchWrapper}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search watches..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Desktop Filters & Sort */}
                <div className={styles.filterActions}>
                    <div className={styles.categories}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.activeCategory : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <select
                        className={styles.sortSelect}
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="default">Sort by: Default</option>
                        <option value="low-high">Price: Low to High</option>
                        <option value="high-low">Price: High to Low</option>
                    </select>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    className={styles.mobileFilterToggle}
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                    <SlidersHorizontal size={20} />
                    <span>Filters</span>
                </button>
            </div>

            {/* Mobile Filters Drawer (Simplified as inline for now) */}
            {isMobileFilterOpen && (
                <div className={styles.mobileFilters}>
                    <div className={styles.categories}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.activeCategory : ''}`}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setIsMobileFilterOpen(false);
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Grid */}
            <div className={styles.grid}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className={styles.noResults}>
                        <p>No products found matching your criteria.</p>
                        <button
                            className={styles.clearBtn}
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
