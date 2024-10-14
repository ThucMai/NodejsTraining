import { Request, Response } from 'express';
import { VoucherService } from '../services/voucher.service';

const voucherService = new VoucherService();

export const getVouchers = async (req: Request, res: Response) => {
    const result = await voucherService.getVouchers(req.params.id);
    res.json(result);
};

export const createVoucher = async (req: Request, res: Response) => {
    const result = await voucherService.createVoucher(req.body);
    res.json(result);
};

export const editVoucher = async (req: Request, res: Response) => {
    const result = await voucherService.editVoucher(req.params.id, req.body);
    res.json(result);
}

export const deleteVoucher = async (req: Request, res: Response) => {
    const result = await voucherService.deleteVoucher(req.params.id);
    res.json(result);
}
