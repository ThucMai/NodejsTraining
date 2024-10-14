import { createVoucher, getVouchers, editVoucher, deleteVoucher } from '../controllers/voucher.controller';
import express, { Request, Response, NextFunction } from 'express';
// import { createUserRule, updateUserRule } from '../validate/user.validate';
import { authenticateJWT } from '../middleware/auth.middleware';
import cors from 'cors'
const voucher_router = express.Router();

/**
 * @swagger
 * /voucher:
 *   get:
 *     summary: Get vouchers
 *     description: This endpoint allows you to get vouchers.
 *     tags:
 *       - Voucher
 *     security:
 *     - bearerAuth: [] 
 *     responses:
 *       201:
 *         description: Voucher return
 *       400:
 *         description: Server error
 */
voucher_router.get('/', getVouchers);

/**
 * @swagger
 * /voucher/{id}:
 *   get:
 *     summary: Edit a voucher
 *     description: This endpoint allows you to edit a voucher.
 *     tags:
 *       - Voucher
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       201:
 *         description: Voucher return
 *       400:
 *         description: Voucher not found
 */
voucher_router.get('/:id', getVouchers);

/**
 * @swagger
 * /voucher:
 *   post:
 *     summary: Create new voucher
 *     description: This endpoint allows you to create new voucher.
 *     tags:
 *       - Voucher
 *     security:
 *     - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: string
 *                 example: "1a212f32se41"
 *               event:
 *                 type: Object
 *                 example: '{}'
 *               voucher_code:
 *                 type: string
 *                 example: "Kute-1518"
 *               issued_to:
 *                 type: string
 *                 example: "Johnson@gmailz.com"
 *               issued_date:
 *                 type: Date
 *                 example: "2024-09-26T09:25:18.375+00:00"
 *               expired_date:
 *                 type: Date
 *                 example: "2024-09-30T09:25:18.375+00:00"
 *             required:
 *               - event_id
 *               - event
 *               - voucher_code
 *               - issued_to 
 *               - issued_date 
 *               - expired_date
 *     responses:
 *       201:
 *         description: Voucher create successfully
 *       456:
 *         description: Some thing wrong
 */
voucher_router.post('/', createVoucher);

/**
 * @swagger
 * /voucher/{id}:
 *   put:
 *     summary: Edit voucher
 *     description: This endpoint allows you to edit voucher.
 *     tags:
 *       - Voucher
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: string
 *                 example: "1a212f32se41"
 *               event:
 *                 type: Object
 *                 example: '{}'
 *               voucher_code:
 *                 type: string
 *                 example: "Kute-1518"
 *               issued_to:
 *                 type: string
 *                 example: "Johnson@gmailz.com"
 *               issued_date:
 *                 type: Date
 *                 example: "2024-09-26T09:25:18.375+00:00"
 *               expired_date:
 *                 type: Date
 *                 example: "2024-09-30T09:25:18.375+00:00"
 *             required:
 *               - event_id
 *               - event
 *               - voucher_code
 *               - issued_to 
 *               - issued_date 
 *               - expired_date
 *     responses:
 *       201:
 *         description: Voucher update successfully
 *       456:
 *         description: Some thing wrong
 */
voucher_router.put('/:id', editVoucher);

/**
 * @swagger
 * /voucher/{id}:
 *   delete:
 *     summary: Delete voucher
 *     description: This endpoint allows you to delete voucher.
 *     tags:
 *       - Voucher
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       201:
 *         description: Voucher delete successfully
 *       456:
 *         description: Some thing wrong
 */
voucher_router.delete('/:id', deleteVoucher);

export default voucher_router;