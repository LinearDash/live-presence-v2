import { UserX } from "lucide-react"
import type { UserBubbleProps } from "@/types/user"

export default function UserBubble({ user, isCurrentUser = false, size = "md" }: UserBubbleProps) {
  const sizeClasses = {
    sm: "w-20 h-20 text-xs",
    md: "w-28 h-28 text-sm",
    lg: "w-40 h-40 text-base",
  }

  const sizeClass = sizeClasses[size]

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col items-center">
      {/* Bubble */}
      <div
        className={`${sizeClass} rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden group`}
        style={{
          backgroundColor: user.colour,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10 pointer-events-none" />

        {/* Bubble content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <div className="font-bold text-center leading-tight">{initials}</div>
          <div className="text-xs opacity-80 mt-1 truncate px-2">{user.name}</div>
        </div>

        {/* Activity indicator */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background transition-all flex items-center justify-center bg-background">
          {user.isActive ? (
            <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-500/50" />
          ) : (
            <UserX size={14} className="text-red-400" strokeWidth={3} />
          )}
        </div>

        {/* Hover effect ring */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
      </div>

      {/* Name label below for larger bubbles */}
      {size === "lg" && isCurrentUser && (
        <div className="mt-4 text-center">
          <p className="text-foreground font-semibold text-lg">{user.name}</p>
          <p className="text-muted-foreground text-xs">You</p>
        </div>
      )}
    </div>
  )
}