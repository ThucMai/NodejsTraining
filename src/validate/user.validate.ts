import { Request, Response,NextFunction } from 'express';
import Joi from 'joi';

export const createUserRule = (req: Request, res: Response, next: NextFunction) => {
    const schema =  Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().optional(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
    });
    return validateUser(schema)(req, res, next);
}

export const updateUserRule = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().optional(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).optional()
    });
    return validateUser(schema)(req, res, next);
}

const validateUser = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
            } else{
                next();
            }
    }
}
