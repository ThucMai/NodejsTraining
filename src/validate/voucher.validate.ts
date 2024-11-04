import { Request, Response,NextFunction } from 'express';
import { ItemStatus } from '../utils/variable';
import { createVoucherValidate, updateVoucherValidate } from '../utils/validate';
import Joi from 'joi';

export const createVoucherRule = (req: Request, res: Response, next: NextFunction) => {
    const schema =  createVoucherValidate;
    return validateEvent(schema)(req, res, next);
}

export const updateVoucherRule = (req: Request, res: Response, next: NextFunction) => {
    const schema = updateVoucherValidate;
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
