import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import authRoute from './auth';
import userRoute from './user';
import eventRoute from './event';
import swaggerOutput from '../../logs/swagger_output.json';

const router = Router();

// Set up the routes
router.use('/', authRoute);
router.use('/user', userRoute);
router.use('/event', eventRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

export default router;
