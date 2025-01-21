import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Access denied' });
            return;
        }

        jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
            if (err) {
                res.status(403).json({ message: 'Invalid token' });
                return;
            }

            req.user = user;
            next();
        });
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
        return;
    }
};