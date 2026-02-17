import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import WatchClock from '../components/common/WatchClock';
import { categories as staticCategories } from '../data/products'; // Fallback or use DB

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const q = query(
                    collection(db, "products"),
                    where("isNew", "==", true),
                    limit(4)
                );
                const querySnapshot = await getDocs(q);
                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFeaturedProducts(products);
            } catch (error) {
                console.error("Error fetching featured products:", error);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <div className="home-page fade-in">
            {/* Hero Section */}
            <section className="hero" style={{
                height: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-background)',
                position: 'relative',
                overflow: 'hidden',
                padding: '0 1rem'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(57, 255, 20, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: 0
                }}></div>

                <div className="hero-content" style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    marginTop: '8rem'
                }}>
                    <WatchClock />

                    <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '1rem', letterSpacing: '2px' }}>
                        TIMELESS ELEGANCE
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: 'var(--color-text-light)', fontWeight: '300', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        Discover our exclusive collection of premium timepieces designed for those who appreciate precision and style.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyItems: 'center', justifyContent: 'center' }}>
                        <Link to="/products">
                            <Button variant="primary">Shop Collection</Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="outline">Our Story</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="container" style={{ padding: '6rem 1rem' }}>
                <div className="text-center" style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Collection</h2>
                    <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--color-accent)', margin: '0 auto' }}></div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '3rem'
                }}>
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center" style={{ marginTop: '4rem' }}>
                    <Link to="/products">
                        <Button variant="outline" style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>
                            View All Watches
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Categories Section */}
            <section style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 1rem' }}>
                <div className="container">
                    <h2 className="text-center" style={{ marginBottom: '3rem' }}>Browse by Category</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {staticCategories.map(cat => (
                            <Link key={cat.id} to={`/products?category=${cat.name}`} style={{
                                height: '250px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                overflow: 'hidden',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${cat.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transition: 'transform 0.5s ease',
                                    zIndex: 1
                                }} className="cat-bg"></div>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    zIndex: 2
                                }}></div>
                                <h3 style={{
                                    position: 'relative',
                                    zIndex: 3,
                                    color: 'white',
                                    fontSize: '1.8rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontWeight: 'bold'
                                }}>{cat.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
