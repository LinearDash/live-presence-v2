import { useMemo, useState, useRef, useEffect } from "react"
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
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const otherUsers = useMemo(() => users.filter((u) => u.id !== currentUser.id), [users, currentUser.id])

  // Calculate positions for surrounding bubbles in a circle - increased radius
  const bubblePositions = useMemo(() => {
    // Increased radius to prevent overlap - mobile: 180px, desktop: 280px
    const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 180 : 280
    const angle = (360 / otherUsers.length) * (Math.PI / 180)
    return otherUsers.map((_, index) => ({
      x: Math.cos(index * angle) * radius,
      y: Math.sin(index * angle) * radius,
    }))
  }, [otherUsers])

  // Mouse/Touch handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true)
    setStartPos({ x: clientX - pan.x, y: clientY - pan.y })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return
    setPan({
      x: clientX - startPos.x,
      y: clientY - startPos.y,
    })
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }

  useEffect(() => {
    const handleMouseUp = () => handleEnd()
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
    >
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
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
    </div>
  )
}