import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/type';
import { jwtSecret } from '../utils/variable';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden if token is invalid
            }

            if (typeof user === 'object' && user) {
                req.user = req.user || { id: '' };
                req.user.id = user.id;
            }
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
