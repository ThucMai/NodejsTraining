import { Request, Response,NextFunction } from 'express';
import { ItemStatus } from '../utils/variable';
import Joi from 'joi';

export const createVoucherRule = (req: Request, res: Response, next: NextFunction) => {
    const schema =  Joi.object({
        event_id: Joi.string().min(3).max(30).required(),
        event: Joi.object().optional(),
        voucher_code: Joi.string().min(3).max(30).optional(),
        issued_to: Joi.string().email().required(),
        issued_date: Joi.date().optional(),
        expired_date: Joi.date().optional(),
        status: Joi.string().optional().valid(ItemStatus.Active, ItemStatus.Inactive)
    });
    return validateEvent(schema)(req, res, next);
}

export const updateVoucherRule = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        event_name: Joi.string().min(3).max(30).optional(),
        description: Joi.string().optional(),
        event_date_start: Joi.date().optional(),
        event_date_end: Joi.date().optional(),
        voucher_quantity: Joi.number().optional(),
        voucher_released: Joi.number().optional(),
        status: Joi.string().valid(ItemStatus.Active, ItemStatus.Inactive).optional()
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
