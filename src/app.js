import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// rota base /
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

app.use('/auth', authRoutes);

export default app;
