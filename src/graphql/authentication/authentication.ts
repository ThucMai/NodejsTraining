import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || '';

export interface AuthContext {
    user?: { id: number };
}

export const authenticateJWT = async (req: Request): Promise<AuthContext> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    try {
        const decoded = jwt.verify(token, jwtSecret);
        
        if (typeof decoded === 'object' && decoded) {
            return { user: { id: decoded.id } };
        }
    } catch (error) {
        throw new Error('Forbidden');
    }
    return {};
};
