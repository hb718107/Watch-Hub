import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Watch, Search, Sun, Moon, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { getCartCount, setIsCartOpen } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, loginWithGoogle, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                {/* Logo */}
                <Link to="/" className={styles.logo}>
                    <Watch className={styles.logoIcon} />
                    <span>WatchHub</span>
                </Link>

                {/* Search Bar (Desktop) */}
                <div className={styles.searchContainer}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                {/* Desktop Navigation */}
                <div className={styles.desktopNav}>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Home</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Collection</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Our Story</NavLink>
                </div>

                {/* Icons */}
                <div className={styles.navIcons}>
                    <button onClick={toggleTheme} className={styles.themeBtn} aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <div className={styles.userProfile} onClick={() => { if (window.confirm('Logout?')) logout() }}>
                            <User className={styles.userAvatar} />
                            <span className={styles.userName}>{user.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
                        </div>
                    ) : (
                        <button onClick={loginWithGoogle} className={styles.loginBtn}>
                            Sign In
                        </button>
                    )}

                    <Link
                        to="/cart"
                        className={styles.cartBtn}
                        aria-label="Open Cart"
                    >
                        <ShoppingBag />
                        <span className={styles.cartCount}>{getCartCount()}</span>
                    </Link>

                    <button
                        className={styles.mobileMenuBtn}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <div style={{ padding: '1rem' }}>
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>
                    <NavLink to="/" onClick={toggleMobileMenu} className={styles.mobileLink}>Home</NavLink>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
