import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import meetingRoutes from './routes/meeting.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/meetings', meetingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
}); 