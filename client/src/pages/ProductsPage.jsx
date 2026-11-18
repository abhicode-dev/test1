import { useEffect, useState } from 'react';
import { getProducts } from '../services/api.js';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(() => setError('Could not load products. Check that the backend and MySQL are running.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section>
            <div className="page-heading">
                <p className="eyebrow">DISCOVER YOUR NEXT FAVORITE</p>
                <h1>Our Products</h1>
                <p>Explore the products available in our store.</p>
            </div>

            {loading && <p>Loading products...</p>}
            {error && <p className="error" role="alert">{error}</p>}

            {!loading && !error && (
                <div className="product-grid">
                    {products.map(product => (
                        <article className="product-card" key={product.product_id}>
                            <img
                                src={product.image_url || 'https://placehold.co/600x400?text=Product'}
                                alt={product.product_name}
                            />
                            <div className="card-content">
                                <span className="category">{product.category || 'General'}</span>
                                <h2>{product.product_name}</h2>
                                <p>{product.description}</p>
                                <div className="card-bottom">
                                    <strong>₹{Number(product.price).toFixed(2)}</strong>
                                    <span>{product.stock_quantity} in stock</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            {!loading && !error && products.length === 0 && <p>No products found.</p>}
        </section>
    );
}
