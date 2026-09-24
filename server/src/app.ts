import cors from 'cors';
import express from 'express';
import applicationRouter from './routes/application.routes.js';
import authRouter from './routes/auth.routes.js';
import gmailRouter from './routes/gmail.routes.js';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://apply-flow-phi.vercel.app'],
  }),
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/gmail', gmailRouter);

export default app;
