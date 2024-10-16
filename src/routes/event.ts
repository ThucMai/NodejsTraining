import { createEvent, getEvents, getEvent, editEvent, deleteEvent } from '../controllers/event.controller';
import { editable, enterEdit, maintainEdit } from '../controllers/event_lock.controller';
import express, { Request, Response, NextFunction } from 'express';
// import { createUserRule, updateUserRule } from '../validate/user.validate';
import cors from 'cors'
const event_router = express.Router();

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Get events
 *     description: This endpoint allows you to get events.
 *     tags:
 *       - Event
 *     security:
 *     - bearerAuth: [] 
 *     responses:
 *       201:
 *         description: Event return
 *       400:
 *         description: Server error
 */
event_router.get('/', getEvents);

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Edit a event
 *     description: This endpoint allows you to edit a event.
 *     tags:
 *       - Event
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       201:
 *         description: Event return
 *       400:
 *         description: Event not found
 */
event_router.get('/:id', getEvent);

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Create new event
 *     description: This endpoint allows you to create new event.
 *     tags:
 *       - Event
 *     security:
 *     - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucher_name:
 *                 type: string
 *                 example: "Super sale 10.10"
 *               description:
 *                 type: text
 *                 example: "what ever you want"
 *               voucher_date_start:
 *                 type: string
 *                 example: "2024-10-01T01:25:18.375+00:00"
 *               voucher_date_end:
 *                 type: string
 *                 example: "2024-10-11T01:25:18.375+00:00"
 *               voucher_quantity:
 *                 type: number
 *                 example: "100"
 *               voucher_released:
 *                 type: number
 *                 example: "100"
 *             required:
 *               - voucher_name
 *               - description
 *               - voucher_date_start
 *               - voucher_date_end 
 *               - voucher_quantity 
 *               - voucher_released 
 *     responses:
 *       201:
 *         description: Event create successfully
 *       456:
 *         description: Some thing wrong
 */
event_router.post('/', createEvent);

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Edit event
 *     description: This endpoint allows you to edit event.
 *     tags:
 *       - Event
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
 *               voucher_name:
 *                 type: string
 *                 example: "Super sale 10.10"
 *               description:
 *                 type: text
 *                 example: "what ever you want"
 *               voucher_date_start:
 *                 type: string
 *                 example: "2024-10-01T01:25:18.375+00:00"
 *               voucher_date_end:
 *                 type: string
 *                 example: "2024-10-11T01:25:18.375+00:00"
 *               voucher_quantity:
 *                 type: number
 *                 example: "100"
 *               voucher_released:
 *                 type: number
 *                 example: "100"
 *             required:
 *               - voucher_name
 *               - description
 *               - voucher_date_start
 *               - voucher_date_end 
 *               - voucher_quantity 
 *               - voucher_released 
 *     responses:
 *       201:
 *         description: Event update successfully
 *       456:
 *         description: Some thing wrong
 */
event_router.put('/:id', editEvent);

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Delete event
 *     description: This endpoint allows you to delete event.
 *     tags:
 *       - Event
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       201:
 *         description: Event delete successfully
 *       456:
 *         description: Some thing wrong
 */
event_router.delete('/:id', deleteEvent);

/**
 * @swagger
 * /event/{id}/editable/me:
 *   post:
 *     summary: Check editable event
 *     description: This endpoint allows you to check editable event.
 *     tags:
 *       - Event/Lock
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Editable for you
 *       409:
 *         description: You cant edit
 */
event_router.post('/:id/editable/me', editable);

/**
 * @swagger
 * /event/{id}/editable/me:
 *   post:
 *     summary: Check editable event
 *     description: This endpoint allows you to check editable event.
 *     tags:
 *       - Event/Lock
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
 *                 example: "012313-3kd32s"
 *               user_id:
 *                 type: string
 *                 example: "012313-3kd32s"
 *               status:
 *                 type: string
 *                 example: "Locked"
 *               time_lock:
 *                 type: date
 *                 example: "2024-10-11T01:25:18.375+00:00"
 *             required:
 *               - event_id
 *               - user_id
 *               - time_lock
 *     responses:
 *       200:
 *         description: Editable for you
 *       409:
 *         description: You cant edit
 */
event_router.post('/:id/editable/release', enterEdit);

/**
 * @swagger
 * /event/{id}/editable/me:
 *   post:
 *     summary: Check editable event
 *     description: This endpoint allows you to check editable event.
 *     tags:
 *       - Event/Lock
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Editable for you
 *       409:
 *         description: You cant edit
 */
event_router.post('/:id/editable/maintain', maintainEdit);

export default event_router;