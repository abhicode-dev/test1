import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// GET /api/products - return all products
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.execute(
            `SELECT product_id, product_name, description, price,
                    stock_quantity, category, image_url
             FROM products
             ORDER BY product_id`
        );
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

export default router;
