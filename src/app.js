import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import getRoutes from './routes/getRoutes.js';
import postRoutes from './routes/postRoutes.js';
import deleteRoutes from './routes/deleteRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API MEU-EXPOSITOR rodando 🚀');
});

app.use('/auth', authRoutes);
app.use('/get', getRoutes);
app.use('/post', postRoutes);
app.use('/delete', deleteRoutes);

export default app;

//ARQUIVO PRINCIPAL DA APLICAÇÃO