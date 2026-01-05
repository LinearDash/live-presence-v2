import { X, LogOut, Settings } from "lucide-react"
import type { User } from "@/types/user"
import { useAuth } from "@/hook/useAuth"

interface CurrentUserSidebarProps {
  user: User
  onClose: () => void
}

export default function CurrentUserSidebar({ user, onClose }: CurrentUserSidebarProps) {
  const { logout } = useAuth();
  console.log('current user sidebar rendered', user);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?"

  const handleLogout = async () => {
    await logout();
    onClose();
    window.location.reload(); // Refresh to show login screen
  }

  return (
    <div className="w-96 bg-card border-l border-border h-screen overflow-y-auto shadow-xl flex flex-col z-50 fixed right-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Your Profile</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* User avatar section */}
        <div className="flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg mb-4"
            style={{ backgroundColor: user.colour || '#3B82F6' }}
          >
            {initials}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${user.isActive ? "bg-green-400" : "bg-gray-500"}`} />
            <span className="text-sm font-medium text-muted-foreground">
              {user.isActive ? "Active Now" : "Offline"}
            </span>
          </div>
        </div>

        {/* Name and email */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">{user.name}</h3>
          {user.email && <p className="text-sm text-muted-foreground break-all">{user.email}</p>}
        </div>

        {/* Bio */}
        {user.bio && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bio</p>
            <p className="text-sm text-foreground">{user.bio}</p>
          </div>
        )}

        {/* URLs section */}
        {user.urls && user.urls.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Links</p>
            <div className="space-y-2">
              {user.urls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 break-all hover:underline transition-colors block"
                >
                  {url}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Stats section */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Active Time</p>
            <p className="text-lg font-semibold text-foreground">{formatTime(user.totalActiveTime || 0)}</p>
          </div>

          {user.lastActiveAt && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Active</p>
              <p className="text-sm text-foreground">{formatDate(user.lastActiveAt)}</p>
            </div>
          )}

          {user.createdAt && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Member Since</p>
              <p className="text-sm text-foreground">{formatDate(user.createdAt)}</p>
            </div>
          )}

          {user.updatedAt && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Updated</p>
              <p className="text-sm text-foreground">{formatDate(user.updatedAt)}</p>
            </div>
          )}
        </div>

        {/* Color indicator */}
        <div className="pt-4 border-t border-border flex items-center gap-3">
          <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: user.colour || '#3B82F6' }} />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme Color</p>
            <p className="text-sm font-mono text-foreground">{user.colour || '#3B82F6'}</p>
          </div>
        </div>

        {/* Settings and Logout buttons */}
        <div className="pt-4 border-t border-border space-y-3">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-colors font-semibold"
          >
            <Settings size={18} />
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors font-semibold"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
