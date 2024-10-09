import express, { Application } from 'express';
import connectDB from './database';
import dotenv from 'dotenv';
import router from './routes/index';

class App {
    public app: Application;
    private port: string | number;

    constructor() {
        dotenv.config();
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.connectDatabase();
        this.middlewares();
        this.routes();
    }

    private connectDatabase(): void {
        connectDB();
    }

    private middlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.app.use('/', router);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default App;
