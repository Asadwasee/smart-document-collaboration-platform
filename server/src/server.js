import express from 'express';
import http from 'http'; // Socket.IO ke liye zaroori
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';

// Aliyan ke routes
import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

// Wasif ke routes
import commentRoutes from './routes/commentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

// Socket setup
import { initSocket } from './config/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP Server banaya Socket.IO ke liye
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Smart Document Collaboration Platform API is running...');
});

// Existing routes (Aliyan)
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/documents', documentRoutes);

// New routes (Wasif)
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/files', fileRoutes);

// Socket.IO initialize karein
initSocket(server);

// Global Error Handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON payload.' });
  }

  if (error?.name === 'ValidationError') {
    const details = Object.values(error.errors || {}).map((entry) => entry.message);
    return res.status(400).json({
      message: 'Validation failed.',
      details,
    });
  }

  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      message: `${duplicateField} already exists.`,
    });
  }

  const statusCode = error?.statusCode || 500;
  const message = error?.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({ message });
});

const startServer = async () => {
  try {
    await connectDB();

    // app.listen ki jagah server.listen run karenge
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();