import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import userRoute from './user';
import swaggerOutput from '../../logs/swagger_output.json';

const router = Router();

// Set up the routes
router.use('/user',  (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
}, userRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

export default router;
