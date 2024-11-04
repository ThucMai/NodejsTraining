import { Request, Response,NextFunction } from 'express';
import { createEventValidate, updateEventValidate } from '../utils/validate';
import Joi from 'joi';

export const createEventRule = (req: Request, res: Response, next: NextFunction) => {
    const schema =  createEventValidate;
    return validateEvent(schema)(req, res, next);
}

export const updateEventRule = (req: Request, res: Response, next: NextFunction) => {
    const schema = updateEventValidate;
    return validateEvent(schema)(req, res, next);
}

const validateEvent = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        } else{
            next();
        }
    }
}
