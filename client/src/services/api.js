const API_BASE_URL = 'http://localhost:5000/api';

async function getJson(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

export function getProducts() {
    return getJson('/products');
}

export function getCustomers() {
    return getJson('/customers');
}
