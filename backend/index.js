// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import authRoutes from './routes/auth.js';
// import marketRoutes from './routes/market.js';






// // import { setupWebSocket } from './websocket.js';

// // Load environment variables
// dotenv.config();

// // Create Express app
// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/markets', marketRoutes);
// app.use('/api/market', marketRoutes);
// app.use('/api/market/currencies', marketRoutes);
// app.use('/api/market/stats', marketRoutes); 
// app.use('/api', marketRoutes);
// app.use('/api/v3/market', marketRoutes); 
// app.use('/api/v3/announcements', marketRoutes);
// //allTickers
// app.use('/api/v1/market', marketRoutes);
// app.use('/api/v1/market', marketRoutes);
// //spotdata
// app.use('/api/v1/market/spotdata', marketRoutes);
// //trending
// app.use('/api/v1/market/trending', marketRoutes);
// //topgainers
// app.use('/api/v1/top-gainers', marketRoutes);
// //toplosers
// app.use('/api/v1/top-losers', marketRoutes);
// app.use('/api/market', marketRoutes);








// // Health check route
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'ok' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     message: err.message || 'Internal Server Error',
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-platform')
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });

// // Setup WebSocket server
// // setupWebSocket(server);

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received, shutting down gracefully');
//   server.close(() => {
//     console.log('Server closed');
//     mongoose.connection.close(false, () => {
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     });
//   });
// });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import marketRoutes from './routes/market.js';
import { Server } from 'socket.io';       // ✅ Import Socket.IO
import http from 'http';                  // ✅ Required to create HTTP server for Socket.IO
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/market/currencies', marketRoutes);
app.use('/api/market/stats', marketRoutes);
app.use('/api', marketRoutes);
app.use('/api/v3/market', marketRoutes);
app.use('/api/v3/announcements', marketRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/market/spotdata', marketRoutes);
app.use('/api/v1/market/trending', marketRoutes);
app.use('/api/v1/top-gainers', marketRoutes);
app.use('/api/v1/top-losers', marketRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  // Handle MongoDB buffering timeout
  if (err.message && err.message.includes('buffering timed out')) {
    return res.status(503).json({
      message: 'Database connection error. Please try again later.',
      error: 'DATABASE_TIMEOUT'
    });
  }
  
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ✅ Create HTTP server for Socket.IO
const server = http.createServer(app);

// ✅ Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST']
  }
});

// ✅ Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  // Emit dummy welcome message
  socket.emit('welcome', { message: 'Socket is working 🎉' });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

// ✅ Connect MongoDB with proper options
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-platform';
console.log('📡 Attempting to connect to MongoDB...');
console.log('Using Atlas:', mongoUri.includes('mongodb.net') ? 'YES' : 'NO (Local)');

let mongoConnectAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;
let isConnected = false;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 5
    });
    if (!isConnected) {
      console.log('✅ Connected to MongoDB');
      isConnected = true;
    }
    mongoConnectAttempts = 0; // Reset on successful connection
  } catch (err) {
    mongoConnectAttempts++;
    console.error(`❌ MongoDB connection error (attempt ${mongoConnectAttempts}/${MAX_RETRIES}):`, err.message);
    
    if (mongoConnectAttempts < MAX_RETRIES) {
      console.log(`🔄 Retrying in ${RETRY_DELAY/1000} seconds...`);
      setTimeout(connectMongoDB, RETRY_DELAY);
    } else {
      console.error('❌ Max retries reached. MongoDB connection failed.');
      console.log('⚠️ Server running without database connection. Check your MongoDB Atlas IP whitelist.');
    }
  }
};

connectMongoDB();

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  if (isConnected) {
    console.log('⚠️ MongoDB disconnected - attempting to reconnect...');
    isConnected = false;
    mongoConnectAttempts = 0;
    setTimeout(connectMongoDB, RETRY_DELAY);
  }
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error event:', err.message);
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
