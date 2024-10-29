import { IUser } from '../entities/user.entity';
import { createUserValidate, updateUserValidate } from '../../utils/validate';

export const createUserRule = (args: Partial<IUser>) => {
    const schema = createUserValidate;

    return schema.validate(args, { abortEarly: false });
};

export const updateUserRule = (args: Partial<IUser>) => {
    const schema = updateUserValidate;

    return schema.validate(args, { abortEarly: false });
}