import { IEvent } from '../entities/event.entity';
import { createEventValidate, updateEventValidate } from '../../utils/validate';

export const createEventRule = (args: Partial<IEvent>) => {
    const schema = createEventValidate;

    return schema.validate(args, { abortEarly: false });
};

export const updateEventRule = (args: Partial<IEvent>) => {
    const schema = updateEventValidate;

    return schema.validate(args, { abortEarly: false });
}