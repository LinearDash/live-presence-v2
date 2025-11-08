import 'dotenv/config'
import express from 'express'
import { PrismaClient } from './generated/client'
import userRoutes from './routes/user.routes.ts'
import cors from "cors";

const app = express()
const prisma = new PrismaClient()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 3000

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
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
