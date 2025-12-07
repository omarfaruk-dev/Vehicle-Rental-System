import express, { Request, Response } from 'express';
import { userRoutes } from './modules/user/user.routes';
import { authRoutes } from './modules/auth/auth.routes';

import { vehicleRoutes } from './modules/vehicle/vehicle.routes';
import { bookingRoutes } from './modules/booking/booking.routes';

const app = express();

// middleware
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', vehicleRoutes);
app.use('/api/v1', bookingRoutes);



app.get('/', (req: Request, res: Response) => {
    res.send({
        success: true,
        message: 'Server is running',
    })
})

export default app;
