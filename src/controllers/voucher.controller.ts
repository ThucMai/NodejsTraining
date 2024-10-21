import { Request, Response } from 'express';
import { VoucherService } from '../services/voucher.service';

const voucherService = new VoucherService();

export const getVouchers = async (req: Request, res: Response) => {
    try {
        const result = await voucherService.getVouchers(req.params.id);
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createVoucher = async (req: Request, res: Response) => {
    try {
        const result = await voucherService.createVoucher(req.body);
        if (result) {
            res.status(200).json({ data: result });
        } else {
            res.status(400).json({ message: 'Create fail' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Create fail' });
    }
    
};

export const editVoucher = async (req: Request, res: Response) => {
    try {
        const result = await voucherService.editVoucher(req.params.id, req.body);
        if (!result) {
            res.status(200).json({ data: result });
        } else {
            res.status(400).json({ message: 'Update failed' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }

}

export const deleteVoucher = async (req: Request, res: Response) => {
    try {
        const result = await voucherService.deleteVoucher(req.params.id);
        res.status(200).json({ message: 'User delete '+ result ? 'successfully' : 'failed'});
    } catch (error) {
        res.status(400).json({ message: 'User delete failed'});
    }
}
