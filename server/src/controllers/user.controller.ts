import { PrismaClient } from '../generated/client';
import type { Request, Response } from 'express'
import { z } from 'zod';

const prisma = new PrismaClient()

const createUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsedData = createUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: parsedData.error,
      })
    }

    const { name, email } = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' })
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      }
    })
    return res.status(201).json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "UserId is required" })
    }

    const searchUser = await prisma.user.findUnique({
      where: { id },
    })
    if (!searchUser) {
      return res.status(404).json({ error: "User not found" })
    }

    await prisma.user.delete({
      where: { id },
    })
    return res.status(200).json({ message: "User Deleted Successfully" })
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

}
export const getAllUser = async (req: Request, res: Response) => {

}
export const getUser = async (req: Request, res: Response) => {

}
export const updateUser = async (req: Request, res: Response) => {

}