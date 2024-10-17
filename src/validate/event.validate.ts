import { Request, Response,NextFunction } from 'express';
import Joi from 'joi';

export const createEventRule = (req: Request, res: Response, next: NextFunction) => {
    const schema =  Joi.object({
        event_name: Joi.string().min(3).max(30).required(),
        description: Joi.string().optional(),
        event_date_start: Joi.date().required(),
        event_date_end: Joi.date().required(),
        voucher_quantity: Joi.number().required(),
        voucher_released: Joi.number().required()
    });
    return validateEvent(schema)(req, res, next);
}

export const updateEventRule = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        event_name: Joi.string().min(3).max(30).optional(),
        description: Joi.string().optional(),
        event_date_start: Joi.date().optional(),
        event_date_end: Joi.date().optional(),
        voucher_quantity: Joi.number().optional(),
        voucher_released: Joi.number().optional(),
    });
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
