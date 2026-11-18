import { useState } from 'react';
import ProductsPage from './pages/ProductsPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';

export default function App() {
    const [page, setPage] = useState('products');

    return (
        <div className="app-shell">
            <header className="topbar">
                <a className="brand" href="#" onClick={() => setPage('products')}>
                    ShopEase
                </a>
                <nav aria-label="Main navigation">
                    <button
                        className={page === 'products' ? 'nav-link active' : 'nav-link'}
                        onClick={() => setPage('products')}
                    >
                        Products
                    </button>
                    <button
                        className={page === 'customers' ? 'nav-link active' : 'nav-link'}
                        onClick={() => setPage('customers')}
                    >
                        Customers
                    </button>
                </nav>
            </header>

            <main className="container">
                {page === 'products' ? <ProductsPage /> : <CustomersPage />}
            </main>

            <footer>ShopEase learning project · React + Express + MySQL</footer>
        </div>
    );
}
