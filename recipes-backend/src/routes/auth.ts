import { Request, Response } from 'express';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = express.Router();
const JWT_SECRET = 'your-secret-key';

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const [existingUsers]: any = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result]: any = await pool.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        const token = jwt.sign(
            { id: result.insertId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const [users]: any = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        const token = jwt.sign(
            { id: users[0].id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;