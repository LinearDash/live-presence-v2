import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/client';
import z from 'zod';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from '../services/sessionService';

const prisma = new PrismaClient()

const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 character' }),
  name: z.string().min(2, { message: 'Name must be at least 2 character' }).optional(),
  colour: z.string().optional(),
  bio: z.string().optional(),
})
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
export const register = async (req: Request, res: Response) => {
  try {
    const parsedData = registerSchema.safeParse(req.body);

    if (!parsedData.success) {
      const formattedErrors = parsedData.error.issues.map((error) => ({
        field: error.path.join('.'),
        message: error.message
      }))
      return res.status(400).json({
        error: "Validation Error",
        details: formattedErrors,
      })
    }

    const { email, password, bio, colour, name } = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        colour,
        bio
      }
    })
    const session = await createSession(user.id);

    res.cookie('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    })
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        colour: user.colour,
        bio: user.bio
      }
    })
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.safeParse(req.body);
    console.log(parsedData);


    if (!parsedData.success) {
      const formattedErrors = parsedData.error.issues.map((error) => ({
        field: error.path.join('.'),
        message: error.message
      }))
      return res.status(400).json({
        message: 'Validation Failed',
        details: formattedErrors
      })
    }

    const { email, password } = parsedData.data;

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid email" })
    }
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid Password' })
    }
    const session = await createSession(user.id);

    res.cookie('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        colour: user.colour,
        bio: user.bio,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.session_token;

    if (token) {
      await deleteSession(token);
    }
    res.clearCookie('session_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return res.status(200).json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
}
