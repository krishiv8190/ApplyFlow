import express from 'express';
import applicationRouter from './routes/application.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/applications', applicationRouter);

export default app;
