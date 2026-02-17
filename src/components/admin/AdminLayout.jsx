import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Star, LogOut, Watch } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Watch size={24} />
                    <span>WatchHub Admin</span>
                </div>

                <nav className={styles.nav}>
                    <Link to="/admin" className={`${styles.navItem} ${isActive('/admin') ? styles.active : ''}`}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link to="/admin/products" className={`${styles.navItem} ${isActive('/admin/products') ? styles.active : ''}`}>
                        <Package size={20} />
                        Products
                    </Link>
                    <Link to="/admin/orders" className={`${styles.navItem} ${isActive('/admin/orders') ? styles.active : ''}`}>
                        <ShoppingCart size={20} />
                        Orders
                    </Link>
                    <Link to="/admin/reviews" className={`${styles.navItem} ${isActive('/admin/reviews') ? styles.active : ''}`}>
                        <Star size={20} />
                        Reviews
                    </Link>
                </nav>

                <div className={styles.footer}>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        Logout
                    </button>
                    <Link to="/" className={styles.backLink}>Back to Store</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
