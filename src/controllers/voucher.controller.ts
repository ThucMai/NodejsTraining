import { Request, Response } from 'express';
import { VoucherService } from '../services/voucher.service';

const voucherService = new VoucherService();

export const getVouchers = async (req: Request, res: Response) => {
    try {
        const result = await voucherService.getVouchers(req.params.id);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createVoucher = async (req: Request, res: Response) => {
    try {
        const result = await voucherService.createVoucher(req.body);
        res.status(result.success ? 200 : 400).json({ data: result });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    
};

export const editVoucher = async (req: Request, res: Response) => {
    try {
        const result = await voucherService.editVoucher(req.params.id, req.body);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}

export const deleteVoucher = async (req: Request, res: Response) => {
    try {
        const result = await voucherService.deleteVoucher(req.params.id);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
}
