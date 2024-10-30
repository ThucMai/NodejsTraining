import express, { Application } from 'express';
import connectDB from './database';
import dotenv from 'dotenv';
import router from './routes/index';
import {startAgendaJobs} from './database_health'
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { index_schema } from './graphql/schema/index.schema';
import { Query } from 'mongoose';
import { authenticateJWT } from './graphql/authentication/authentication';

class App {
    public app: Application;
    private port: string | number;

    constructor() {
        dotenv.config();
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.connectDatabase();
        if (process.env.DB != 'mysql') {
            this.checkDatabaseHealth();
        } else {
            this.graphQLSetup();
        }
        this.middlewares();
        this.routes();
    }

    private connectDatabase(): void {
        connectDB();
    }

    private graphQLSetup(): void {
        const root = {
        hello: () => 'Hello world!',
        };
    
        this.app.use('/graphql', async (req, res, next) => {
            try {
                const context = await authenticateJWT(req);
                graphqlHTTP({
                    schema: index_schema,
                    rootValue: root,
                    graphiql: true,
                    context,
                })(req, res);
            } catch (error) {
                res.status(403).send('Forbidden');
            }
        });
    }

    private checkDatabaseHealth(): void {
        startAgendaJobs();
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
