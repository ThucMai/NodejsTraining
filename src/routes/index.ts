import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import authRoute from './auth';
import userRoute from './user';
import eventRoute from './event';
import voucherRoute from './voucher';
import swaggerOutput from '../../logs/swagger_output.json';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Set up the routes
router.use('/', authRoute);
router.use('/user', authenticateJWT, userRoute);
router.use('/event', authenticateJWT, eventRoute);
router.use('/voucher', authenticateJWT, voucherRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

export default router;
