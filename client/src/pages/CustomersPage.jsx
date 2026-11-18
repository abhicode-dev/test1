import { useEffect, useMemo, useState } from 'react';
import { getCustomers } from '../services/api.js';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getCustomers()
            .then(setCustomers)
            .catch(() => setError('Could not load customers. Check that the backend and MySQL are running.'))
            .finally(() => setLoading(false));
    }, []);

    const filteredCustomers = useMemo(() => {
        const term = search.trim().toLowerCase();
        return customers.filter(customer =>
            `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(term)
        );
    }, [customers, search]);

    return (
        <section>
            <div className="page-heading">
                <p className="eyebrow">CUSTOMER DIRECTORY</p>
                <h1>Customers</h1>
                <p>Customer names and contact details loaded from the MySQL database.</p>
            </div>

            <label className="search-label" htmlFor="customer-search">Search customers</label>
            <input
                id="customer-search"
                className="search-input"
                type="search"
                placeholder="Search by customer name..."
                value={search}
                onChange={event => setSearch(event.target.value)}
            />

            {loading && <p>Loading customers...</p>}
            {error && <p className="error" role="alert">{error}</p>}

            {!loading && !error && (
                <>
                    <p className="result-count">{filteredCustomers.length} customer(s) found</p>
                    <div className="customer-list">
                        {filteredCustomers.map(customer => (
                            <article className="customer-card" key={customer.customer_id}>
                                <div className="avatar" aria-hidden="true">
                                    {customer.first_name?.[0]}{customer.last_name?.[0]}
                                </div>
                                <div className="customer-info">
                                    <h2>{customer.first_name} {customer.last_name}</h2>
                                    <p>{customer.email}</p>
                                    <p>{customer.phone || 'Phone not provided'}</p>
                                </div>
                                <span className="customer-id">ID #{customer.customer_id}</span>
                            </article>
                        ))}
                    </div>
                    {filteredCustomers.length === 0 && <p>No matching customers found.</p>}
                </>
            )}
        </section>
    );
}
