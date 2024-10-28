import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { createConnection } from 'typeorm';

dotenv.config();

const connectDB = async () => {
    const isMysql = process.env.DB == 'mysql';
    try {
        if (isMysql) {
            await createConnection({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: Number(process.env.MYSQL_PORT),
                username: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                synchronize: true,  // Set to false to prevent TypeORM from trying to create tables
                entities: ['./dist/graphql/entities/*.js'],
            });
            console.log('MySql connected');
        } else {
            const mongoURI = process.env.MONGODB_URI as string;
            await mongoose.connect(mongoURI);
            console.log('MongoDB connected');
        }
    } catch (error) {
        console.error( isMysql ? 'Mysql' : 'MongoDB' + ' connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
