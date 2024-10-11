import { login, register } from '../controllers/auth.controller';
import express, { Request, Response,NextFunction } from 'express';
import { createUserRule, updateUserRule } from '../validate/user.validate';
import cors from 'cors'
const auth_router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to web
 *     description:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "itachi"
 *               password:
 *                 type: string
 *                 example: "thisispassword"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Login successfully
 *       400:
 *         description: error message
 */
auth_router.post('/login', login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a user
 *     description:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "UchihaItachi"
 *               name:
 *                 type: string
 *                 example: "Uchiha Itachi"
 *               email:
 *                 type: string
 *                 example: "itachi@uchiha.com"
 *               phone:
 *                 type: string
 *                 example: "03367876621"
 *               password:
 *                 type: string
 *                 example: "thisispassword@1"
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: error message
 */
auth_router.post('/register', register);

export default auth_router;