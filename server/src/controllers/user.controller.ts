import { PrismaClient } from '../generated/client';
import type { Request, Response } from 'express'
import { error } from 'node:console';
import { z } from 'zod';

const prisma = new PrismaClient()

const createUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});
const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Name must not be empty" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  colour: z.string().optional(),
  urlsToAdd: z.array(z.string()).optional(),
  urlsToRemove: z.array(z.string()).optional(),
  bio: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsedData = createUserSchema.safeParse(req.body);


    if (!parsedData.success) {
      const formattedErrors = parsedData.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        error: "Validation Failed",
        details: formattedErrors,
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
  try {
    const allUser = await prisma.user.findMany();
    if (!allUser) {
      return res.status(404).json({ error: "No User found" })
    }

    return res.status(200).json(allUser);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "UserId is required" })
    }
    const parsedData = updateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
      const formattedErrors = parsedData.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        error: "Validation Failed",
        details: formattedErrors,
      })
    }
    const { name, email, colour, urlsToAdd, urlsToRemove, bio } = parsedData.data;

    if (!name && !email && !colour && !urlsToAdd && !urlsToRemove && !bio) {
      return res.status(400).json({
        error: "At least one field must be provided for update"
      });
    }



    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" })
    }
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(colour && { colour }),
        ...(bio && { bio }),
        ...(urlsToAdd && {
          urls: [...(existingUser.urls || []), ...urlsToAdd]
        }),
        ...(urlsToRemove && {
          urls: existingUser.urls.filter(u => !urlsToRemove.includes(u))
        }),
      }
    })
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}