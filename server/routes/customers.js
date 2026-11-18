import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// GET /api/customers - return all customers
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.execute(
            `SELECT customer_id, first_name, last_name, email, phone, created_at
             FROM customers
             ORDER BY customer_id`
        );
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

// GET /api/customers/:id - return one customer
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.execute(
            `SELECT customer_id, first_name, last_name, email, phone, created_at
             FROM customers
             WHERE customer_id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
});

export default router;
