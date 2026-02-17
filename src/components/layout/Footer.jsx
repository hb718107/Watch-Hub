import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '4rem 0 2rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                    {/* Brand */}
                    <div>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>WatchHub</h3>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Premium timepieces for the modern individual. Quality, elegance, and precision in every detail.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li style={{ marginBottom: '0.5rem' }}><a href="/" style={{ color: '#aaa' }}>Home</a></li>
                            <li style={{ marginBottom: '0.5rem' }}><a href="/products" style={{ color: '#aaa' }}>Collection</a></li>
                            <li style={{ marginBottom: '0.5rem' }}><a href="/about" style={{ color: '#aaa' }}>About Us</a></li>
                            <li style={{ marginBottom: '0.5rem' }}><a href="/contact" style={{ color: '#aaa' }}>Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Contact Us</h4>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>123 Watch Street, New York, NY</p>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>+1 (555) 123-4567</p>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>support@watchhub.com</p>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Newsletter</h4>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>Subscribe for latest offers.</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="Your email"
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: 'none',
                                    width: '100%',
                                    outline: 'none'
                                }}
                            />
                            <button style={{
                                backgroundColor: 'var(--color-accent)',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '4px'
                            }}>
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid #333',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>&copy; 2026 WatchHub. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Facebook size={20} color="#888" style={{ cursor: 'pointer' }} />
                        <Twitter size={20} color="#888" style={{ cursor: 'pointer' }} />
                        <Instagram size={20} color="#888" style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
