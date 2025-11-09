import { useMemo } from "react"
import UserBubble from "./userBubble"
import type { User } from "@/types/user"

interface UserBubblesContainerProps {
  users: User[]
  currentUser: User
  onUserSelect: (user: User) => void
}

// Dummy data for testing
const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    colour: "#3B82F6",
    urls: [],
    totalActiveTime: 0,
    bio: "Software Developer",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActiveAt: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    isActive: true,
    colour: "#8B5CF6",
    urls: [],
    totalActiveTime: 0,
    bio: "Designer",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActiveAt: new Date(),
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    isActive: false,
    colour: "#EC4899",
    urls: [],
    totalActiveTime: 0,
    bio: "Product Manager",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActiveAt: new Date(),
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    isActive: true,
    colour: "#10B981",
    urls: [],
    totalActiveTime: 0,
    bio: "Marketing",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActiveAt: new Date(),
  },
  {
    id: "5",
    name: "Alex Brown",
    email: "alex@example.com",
    isActive: false,
    colour: "#F59E0B",
    urls: [],
    totalActiveTime: 0,
    bio: "Data Analyst",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActiveAt: new Date(),
  },
]

const currentUserDummy: User = {
  id: "current",
  name: "You",
  email: "you@example.com",
  isActive: true,
  colour: "#EF4444",
  urls: [],
  totalActiveTime: 0,
  bio: "Current User",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastActiveAt: new Date(),
}

export default function UserBubblesContainer({
  users = dummyUsers,
  currentUser = currentUserDummy,
  onUserSelect = (user) => console.log("Selected:", user),
}: Partial<UserBubblesContainerProps>) {
  const otherUsers = useMemo(() => users.filter((u) => u.id !== currentUser.id), [users, currentUser.id])

  // Calculate positions for surrounding bubbles in a circle
  const bubblePositions = useMemo(() => {
    const radius = 200
    const angle = (360 / otherUsers.length) * (Math.PI / 180)
    return otherUsers.map((_, index) => ({
      x: Math.cos(index * angle) * radius,
      y: Math.sin(index * angle) * radius,
    }))
  }, [otherUsers])

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Center bubble - current user */}
      <div
        className="absolute z-50 hover:scale-110 transition-transform duration-300 cursor-pointer"
        onClick={() => onUserSelect(currentUser)}
      >
        <UserBubble user={currentUser} isCurrentUser={true} size="lg" />
      </div>

      {/* Surrounding bubbles */}
      {otherUsers.map((user, index) => (
        <div
          key={user.id}
          className="absolute transition-transform duration-300 hover:scale-110 cursor-pointer z-20"
          style={{
            transform: `translate(${bubblePositions[index].x}px, ${bubblePositions[index].y}px)`,
          }}
          onClick={() => onUserSelect(user)}
        >
          <UserBubble user={user} isCurrentUser={false} size="md" />
        </div>
      ))}
    </div>
  )
}