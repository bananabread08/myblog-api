import express, { Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as logger from './utils/logger';
import { MONGO_URI } from './config/config';
import * as middleware from './utils/middleware';
import { userRouter } from './routes/userRouter';
import { blogRouter } from './routes/blogRouter';

// MONGODB CONNECTION
logger.info(`connecting to: ${MONGO_URI}`);
async function connectDB() {
  await mongoose.connect(`${MONGO_URI}`);
}
connectDB()
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error(`error connecting to MongoDB: ${error.message}`);
  });

// MIDDLEWARES
const app = express();
morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

//API ROUTES
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'hello' });
});

app.use('/api/blogs', middleware.jwtAuth, blogRouter);
app.use('/api/users', userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
