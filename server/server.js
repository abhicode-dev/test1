import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import customerRoutes from './routes/customers.js';
import productRoutes from './routes/products.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res, next) => {
    try {
        await pool.query('SELECT 1');
        res.json({ message: 'API and database connection are working' });
    } catch (error) {
        next(error);
    }
});

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
    console.log(`Shopping API running at http://localhost:${PORT}`);
});
