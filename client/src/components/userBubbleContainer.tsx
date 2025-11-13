import { useMemo, useState, useRef, useEffect } from "react"
import UserBubble from "./userBubble"
import type { User } from "@/types/user"
import { useGetAllUsers } from "@/hook/user/useGetAllUsers"

interface UserBubblesContainerProps {
  currentUser: User | null
  onUserSelect: (user: User) => void
}

export default function UserBubblesContainer({
  currentUser,
  onUserSelect = (user) => console.log("Selected:", user),
}: UserBubblesContainerProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch all users
  const { data: users = [], isLoading } = useGetAllUsers();

  // Filter out current user
  const otherUsers = useMemo(() => {
    if (!currentUser) return users;
    return users.filter((u: User) => u.id !== currentUser.id);
  }, [users, currentUser]);

  // Calculate positions for surrounding bubbles in a circle
  const bubblePositions = useMemo(() => {
    const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 180 : 280
    const angle = (360 / otherUsers.length) * (Math.PI / 180)

    return otherUsers.map((_: User, index: number) => ({
      x: Math.cos(angle * index) * radius,
      y: Math.sin(angle * index) * radius,
    }))
  }, [otherUsers])

  // Mouse/Touch handlers - MOVED BEFORE useEffect
  const handleEnd = () => {
    setIsDragging(false)
  }

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

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY)
  }

  useEffect(() => {
    const handleMouseUp = () => handleEnd()
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  if (isLoading) {
    return <div>Loading users...</div>
  }

  if (!currentUser) {
    return <div>Please log in to view users</div>
  }

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
        {otherUsers.map((user: User, index: number) => (
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