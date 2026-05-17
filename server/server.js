import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/notes.routes.js';
import { authenticateToken } from './middlewares/auth.middleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('API working');
});

app.get('/api/authenticateToken', authenticateToken, (req, res) => {
  res.json({
    message: 'Protected route working',
    user: req.user
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

