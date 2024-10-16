import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || '';
export interface AuthRequest extends Request {
    user?: {
        user_id: string;
    };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden if token is invalid
            }
            // req.user = user;
            if (typeof user === 'object' && user) {
                req.user = req.user || { user_id: '' };
                req.user.user_id = user.user_id;
            }
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
