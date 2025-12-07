import express, { Request, Response } from 'express';
import { userRoutes } from './modules/user/user.routes';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();

// middleware
app.use(express.json());

app.use('/api', userRoutes);

app.use('/api', authRoutes);



app.get('/', (req: Request, res: Response) => {
    res.send({
        success: true,
        message: 'Server is running',
    })
})

export default app;
