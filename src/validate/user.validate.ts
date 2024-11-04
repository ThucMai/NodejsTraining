import { Request, Response,NextFunction } from 'express';
import { createUserValidate, updateUserValidate } from '../utils/validate';
import Joi from 'joi';

export const createUserRule = (req: Request, res: Response, next: NextFunction) => {
    const schema =  createUserValidate;
    return validateUser(schema)(req, res, next);
}

export const updateUserRule = (req: Request, res: Response, next: NextFunction) => {
    const schema = updateUserValidate;
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
