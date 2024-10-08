import express from 'express';
import connectDB from './database';
import dotenv from 'dotenv';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './controllers/user.controller';

dotenv.config();
const port = process.env.PORT;
const app = express();

connectDB();

app.use(express.json());

app.get('/', getAllUsers);
app.get('/:id', getUserById);
app.post('/', createUser);
app.put('/:id', updateUser);
app.delete('/:id', deleteUser);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
