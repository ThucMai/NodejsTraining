import { IVoucher } from '../entities/voucher.entity';
import { createVoucherValidate, updateVoucherValidate } from '../../utils/validate';

export const createVoucherRule = (args: Partial<IVoucher>) => {
    const schema = createVoucherValidate;

    return schema.validate(args, { abortEarly: false });
};

export const updateVoucherRule = (args: Partial<IVoucher>) => {
    const schema = updateVoucherValidate;

    return schema.validate(args, { abortEarly: false });
}