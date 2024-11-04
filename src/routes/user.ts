import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import express, { Request, Response,NextFunction } from 'express';
import { createUserRule, updateUserRule } from '../validate/user.validate';
import cors from 'cors'
const user_router = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: This endpoint allows you to get all users
 *     description: Get all users in user table
 *     tags:
 *       - User
 *     security:
 *     - bearerAuth: [] 
 *     responses:
 *       201:
 *         description: Get users successfully
 */
user_router.get('/', getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: This endpoint allows you to get a user by id
 *     description: Get user by id
 *     tags:
 *       - User
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *     responses:
 *       201:
 *         description: Get user successfully
 *       404:
 *         description: User not found
 */
user_router.get('/:id', getUserById);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: This endpoint allows you to create a new user.
 *     tags:
 *       - User
 *     security:
 *     - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *                 example: "thisispassword"
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
user_router.post('/', createUserRule, createUser);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Edit a new user
 *     description: This endpoint allows you to edit a new user.
 *     security:
 *     - bearerAuth: [] 
 *     tags:
 *       - User
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
 *               name:
 *                 type: string
 *                 example: "Uchiha Itachi"
 *               username:
 *                 type: string
 *                 example: "UchihaItachi"
 *               email:
 *                 type: string
 *                 example: "itachi@uchiha.com"
 *               phone:
 *                 type: string
 *                 example: "03367876621"
 *               password:
 *                 type: string
 *                 example: "thisispassword"
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *     responses:
 *       201:
 *         description: User Edited successfully
 *       400:
 *         description: Invalid input
 */
user_router.put('/:id', updateUserRule, updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: This endpoint allows you to delete a user.
 *     tags:
 *       - User
 *     security:
 *     - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       201:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid input
 */
user_router.delete('/:id', cors({
    origin: 'http://localhost:3000', //Only allow this domain request
}), deleteUser);

export default user_router;