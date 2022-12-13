import { init } from './config/mongoConfig';
import { passportInit } from './config/passportConfig';
import express from 'express';
import passport from 'passport';
import cors from 'cors';
import indexRouter from './routes';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import postRouter from './routes/postRoutes';
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//mongoDB & passport
init(app);
passportInit(passport);
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api', authRouter);
app.use('/api/profile/', userRouter);
app.use('/api/posts', postRouter);
