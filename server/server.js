import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

// Initialize Express
const app = express();

// Connect to database
await connectDB();
await connectCloudinary()

// Middlewares
app.use(cors());

// Webhooks need the RAW body for signature verification — register these
// BEFORE express.json() and don't let the JSON parser touch them.
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Now the normal JSON parser for everything else
app.use(express.json());

// Clerk Middleware - Apply only to protected routes
app.use('/api/educator', clerkMiddleware(), educatorRouter);

// Public routes
app.get('/', (req, res) => res.send("API Working"));

app.use('/api/course', clerkMiddleware(), courseRouter)
app.use('/api/user', clerkMiddleware(), userRouter)

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});