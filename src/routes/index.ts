import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import userRoute from './user';
import authRoute from './auth';
import swaggerOutput from '../../logs/swagger_output.json';

const router = Router();

// Set up the routes
router.use('/user', userRoute);
router.use('/', authRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

export default router;
