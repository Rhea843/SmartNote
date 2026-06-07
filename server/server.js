import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/notes.routes.js';
import { authenticateToken } from './middlewares/auth.middleware.js';
import pinRoute from './routes/pin.route.js';
import archiveRoute from './routes/archive.route.js';
import trashRoute from './routes/trash.route.js';
import tagRoutes from './routes/tags.routes.js';
import noteTagRoutes from './routes/noteTags.routes.js';


const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/notes', pinRoute); 
app.use('/api/notes', archiveRoute);
app.use('/api/notes', trashRoute);
app.use('/api/tags', tagRoutes);
app.use('/api/notes', noteTagRoutes);



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

