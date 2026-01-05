import { useMemo, useState } from "react"
import UserBubble from "./userBubble"
import type { User } from "@/types/user"
import { useGetAllUsers } from "@/hook/user/useGetAllUsers"
import { useGetCurrentUser } from "@/hook/user/useGetCurrentUser"
import UserSidebar from "./sidebar/userSidebar"
import CurrentUserSidebar from "./sidebar/currentUserSidebar"
import LoadingPage from "./common/loadingPage"


export default function UserBubblesContainer({ showAllUsers }: { showAllUsers: boolean }) {
  const { data: currentUser, isLoading: isLoadingCurrentUser, error: currentUserError } = useGetCurrentUser();
  const { data: users = [], isLoading: isLoadingUsers } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Filter out current user
  const otherUsers = useMemo(() => {
    if (!currentUser) return users;
    return users.filter((u: User) => u.id !== currentUser.id);
  }, [users, currentUser]);

  //Active users only
  const activeUsers = useMemo(() => {
    return otherUsers.filter((user: User) => user.isActive);
  }, [otherUsers]);

  // Calculate positions for surrounding bubbles in a circle
  const bubblePositions = useMemo(() => {
    const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 180 : 280
    const angle = (360 / otherUsers.length) * (Math.PI / 180)

    return otherUsers.map((_: User, index: number) => ({
      x: Math.cos(angle * index) * radius,
      y: Math.sin(angle * index) * radius,
    }))
  }, [otherUsers])

  // Loading states
  if (isLoadingCurrentUser || isLoadingUsers) {
    return (
      <LoadingPage message="Loading users..." />
    )
  }

  // Error state
  if (currentUserError) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-muted-foreground">Failed to load current user</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // No current user (not logged in)
  if (!currentUser) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">👤</div>
          <p className="text-muted-foreground">Please log in to see users</p>
        </div>
      </div>
    )
  }

  if (showAllUsers) {
    return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Center bubble - current user */}
        <div
          className="absolute z-50 hover:scale-110 transition-transform duration-300 cursor-pointer"
          onClick={() => setSelectedUser(currentUser)}
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
            onClick={() => setSelectedUser(user)}
          >
            <UserBubble user={user} isCurrentUser={false} size="md" />
          </div>
        ))}
      </div>
      {/* Sidebar - showAllUsers */}
      {selectedUser && selectedUser.id === currentUser.id ? (
        <CurrentUserSidebar
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      ) : selectedUser ? (
        <UserSidebar
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMessage={() => {
            // TODO: Handle open DM with user
            console.log('Open DM with:', selectedUser.id);
          }}
        />
      ) : null}
    </div>
  )
  } else {
    return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Center bubble - current user */}
        <div
          className="absolute z-50 hover:scale-110 transition-transform duration-300 cursor-pointer"
          onClick={() => setSelectedUser(currentUser)}
        >
          <UserBubble user={currentUser} isCurrentUser={true} size="lg" />
        </div>

        {/* Surrounding bubbles */}
        {activeUsers.map((user: User, index: number) => (
          <div
            key={user.id}
            className="absolute transition-transform duration-300 hover:scale-110 cursor-pointer z-20"
            style={{
              transform: `translate(${bubblePositions[index].x}px, ${bubblePositions[index].y}px)`,
            }}
            onClick={() => setSelectedUser(user)}
          >
            <UserBubble user={user} isCurrentUser={false} size="md" />
          </div>
        ))}
      </div>
      {/* Sidebar - activeUsersOnly */}
      {selectedUser && selectedUser.id === currentUser.id ? (
        <CurrentUserSidebar
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      ) : selectedUser ? (
        <UserSidebar
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMessage={() => {
            // TODO: Handle open DM with user
            console.log('Open DM with:', selectedUser.id);
          }}
        />
      ) : null}
    </div>
  )
  }
  
}