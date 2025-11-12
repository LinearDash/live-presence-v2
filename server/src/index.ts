import 'dotenv/config'
import express from 'express'
import { PrismaClient } from './generated/client'
import userRoutes from './routes/user.routes.ts'
import authRoutes from './routes/auth.routes.ts'
import cookieParser from 'cookie-parser'
import cors from "cors";
import { createServer } from 'http';
import { initializeSocket } from './config/socket.config.ts'
import { setupSocketHandlers } from './events/socketHandlers.ts'

const app = express()
const prisma = new PrismaClient()
const httpServer = createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000

const io = initializeSocket(httpServer);
setupSocketHandlers(io);

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')

    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
      console.log(`✅ Socket.IO ready`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
