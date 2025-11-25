import 'dotenv/config'
import express from 'express'
import { prisma } from './config/db'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import cookieParser from 'cookie-parser'
import cors from "cors";
import { createServer } from 'http';
import { initializeSocket } from './config/socket.config'
import { setupSocketHandlers } from './events/socketHandlers'

const app = express()
const httpServer = createServer(app);

const allowedOrigins = [
  process.env.COOKIE_DOMAIN,
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json())
app.use(cookieParser())
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000

// Initialize Socket.IO
const io = initializeSocket(httpServer);
setupSocketHandlers(io);

async function main() {
  try {
    // Connect to database first
    await prisma.$connect()
    console.log('✅ Database connected')

    // Set all users to inactive on server start (cleanup)
    await prisma.user.updateMany({
      data: { isActive: false }
    });
    console.log('✅ All users marked as inactive on server start');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
      console.log(`🔌 Socket.IO ready for connections`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Unhandled error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
