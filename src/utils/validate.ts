import Joi from 'joi';
import { ItemStatus } from './variable';

export const createUserValidate = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

export const updateUserValidate = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).optional()
});

export const createEventValidate = Joi.object({
    event_name: Joi.string().min(3).max(30).required(),
    description: Joi.string().optional(),
    event_date_start: Joi.date().required(),
    event_date_end: Joi.date().required(),
    voucher_quantity: Joi.number().required(),
    voucher_released: Joi.number().required()
});

export const updateEventValidate = Joi.object({
    event_name: Joi.string().min(3).max(30).optional(),
    description: Joi.string().optional(),
    event_date_start: Joi.date().optional(),
    event_date_end: Joi.date().optional(),
    voucher_quantity: Joi.number().optional(),
    voucher_released: Joi.number().optional(),
});

export const createVoucherValidate = Joi.object({
    event_id: Joi.alternatives().try(Joi.string().min(3).max(30), Joi.number()).required(),
    event: Joi.object().optional(),
    voucher_code: Joi.string().min(3).max(30).optional(),
    issued_to: Joi.string().email().required(),
    issued_date: Joi.date().optional(),
    expired_date: Joi.date().optional(),
    status: Joi.string().optional().valid(ItemStatus.Active, ItemStatus.Inactive)
});

export const updateVoucherValidate = Joi.object({
    event_name: Joi.string().min(3).max(30).optional(),
    description: Joi.string().optional(),
    event_date_start: Joi.date().optional(),
    event_date_end: Joi.date().optional(),
    voucher_quantity: Joi.number().optional(),
    voucher_released: Joi.number().optional(),
    status: Joi.string().valid(ItemStatus.Active, ItemStatus.Inactive).optional()
});