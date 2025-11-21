import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  isActive: z.boolean().default(false),
  colour: z.string().default('#3B82F6'),
  urls: z.array(z.string()).default([]),
  totalActiveTime: z.number().default(0),
  bio: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastActiveAt: z.date(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  colour: z.string().optional(),
  bio: z.string().optional(),
});

export const userBubblePropsSchema = z.object({
  user: userSchema,
  isCurrentUser: z.boolean().optional().default(false),
  size: z.enum(['sm', 'md', 'lg']).optional().default('md'),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserBubbleProps = z.infer<typeof userBubblePropsSchema>;