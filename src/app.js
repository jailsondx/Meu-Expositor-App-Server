import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import collectionsRoutes from './routes/collections.routes.js';
import getRoutes from './routes/getRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// rota base /
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

app.use('/auth', authRoutes);
app.use('/collection', collectionsRoutes);
app.use('/get', getRoutes);
app.use('/post', postRoutes);

export default app;
