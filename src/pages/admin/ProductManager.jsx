import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { Plus, Pencil, Trash2, X, Save, Loader2, Upload } from 'lucide-react';
import styles from './ProductManager.module.css';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Luxary',
        image: '',
        description: '',
        isNew: false
    });

    const categories = ['Luxary', 'Sport', 'Smart'];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.image;

        console.log("Starting upload for:", imageFile.name);
        try {
            const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
            console.log("Reference created:", storageRef);

            const snapshot = await uploadBytes(storageRef, imageFile);
            console.log("Upload successful:", snapshot);

            const url = await getDownloadURL(storageRef);
            console.log("Download URL:", url);
            return url;
        } catch (err) {
            console.error("Upload failed details:", err);
            throw new Error(`Image Upload Failed: ${err.message}. (Check Console)`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = formData.image;
            if (imageFile) {
                imageUrl = await uploadImage();
            }

            const productData = {
                ...formData,
                image: imageUrl,
                price: parseFloat(formData.price),
                createdAt: new Date()
            };

            if (editingId) {
                const docRef = doc(db, "products", editingId);
                await updateDoc(docRef, productData);
                alert("Product updated successfully!");
            } else {
                await addDoc(collection(db, "products"), productData);
                alert("Product added successfully!");
            }

            setIsFormOpen(false);
            setEditingId(null);
            setImageFile(null);
            setFormData({ name: '', price: '', category: 'Men', image: '', description: '', isNew: false });
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            description: product.description || '',
            isNew: product.isNew || false
        });
        setEditingId(product.id);
        setImageFile(null);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product.");
            }
        }
    };

    if (loading && !isFormOpen && products.length === 0) {
        return (
            <div className={styles.loading}>
                <Loader2 className="spin" size={40} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Product Manager</h1>
                {!isFormOpen && (
                    <button className={styles.addButton} onClick={() => setIsFormOpen(true)}>
                        <Plus size={20} />
                        Add Product
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className={styles.formContainer}>
                    <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                className={styles.input}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Price (Rs.)</label>
                                <input
                                    type="number"
                                    name="price"
                                    className={styles.input}
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Category</label>
                                <select
                                    name="category"
                                    className={styles.select}
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Product Image</label>
                            {/* File Upload */}
                            <div style={{ marginBottom: '0.5rem' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className={styles.fileLabel} style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    border: '1px solid #d1d5db'
                                }}>
                                    <Upload size={18} />
                                    {imageFile ? imageFile.name : "Choose File"}
                                </label>
                            </div>

                            {/* URL Fallback */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="url"
                                    name="image"
                                    className={styles.input}
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="Or enter image URL..."
                                    disabled={!!imageFile}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const samples = [
                                            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1434056886845-dac89dd991cc?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1619134778706-c731e9c2049e?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1623998021446-45cd9b269056?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=1000&auto=format&fit=crop',
                                            'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop'
                                        ];
                                        const random = samples[Math.floor(Math.random() * samples.length)];
                                        setFormData(prev => ({ ...prev, image: random }));
                                        setImageFile(null);
                                    }}
                                    className={styles.actionBtn}
                                    style={{ width: 'auto', padding: '0 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                    title="Get random watch image"
                                >
                                    🎲 Random
                                </button>
                            </div>
                            {(formData.image || imageFile) && (
                                <div style={{ marginTop: '0.5rem', height: '100px', width: '100px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <img
                                        src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                                        alt="Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                name="description"
                                className={styles.textarea}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                name="isNew"
                                id="isNew"
                                checked={formData.isNew}
                                onChange={handleChange}
                                style={{ width: 'auto' }}
                            />
                            <label htmlFor="isNew" style={{ margin: 0 }}>Mark as New Arrival</label>
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingId(null);
                                    setFormData({ name: '', price: '', category: 'Men', image: '', description: '', isNew: false });
                                    setImageFile(null);
                                }}
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button type="submit" className={styles.submitBtn} disabled={uploading}>
                                {uploading ? (
                                    <>
                                        <Loader2 className="spin" size={18} />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        {editingId ? 'Update Product' : 'Save Product'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <img src={product.image} alt="" className={styles.productImage} />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '500' }}>{product.name}</div>
                                    </td>
                                    <td>{product.category}</td>
                                    <td className={styles.price}>Rs. {product.price.toLocaleString()}</td>
                                    <td>
                                        {product.isNew && (
                                            <span style={{ fontSize: '0.7em', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>NEW</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className={styles.actionBtn} onClick={() => handleEdit(product)}>
                                            <Pencil size={18} />
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(product.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
