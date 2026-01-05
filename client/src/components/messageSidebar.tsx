import { X } from "lucide-react"
import { useState } from "react"
import { useGetConversations } from "@/hook/message/useGetConversations"
import { useGetCurrentUser } from "@/hook/user/useGetCurrentUser"
import MessageThread from "./messageThread"

interface MessageSidebarProps {
  onClose: () => void
}

interface SelectedConversation {
  id: string
  otherUser: {
    id: string
    name: string
  }
}

export default function MessageSidebar({ onClose }: MessageSidebarProps) {
  const { data: conversations, isLoading: conversationsLoading } = useGetConversations()
  const { data: currentUser } = useGetCurrentUser()
  const [selectedConversation, setSelectedConversation] = useState<SelectedConversation | null>(null)

  if (selectedConversation) {
    return (
      <MessageThread
        conversationId={selectedConversation.id}
        otherUser={selectedConversation.otherUser}
        onClose={() => setSelectedConversation(null)}
      />
    )
  }

  console.log(conversations);
  
  return (
    <div className="w-96 bg-card border-r border-border h-screen overflow-y-auto shadow-xl flex flex-col z-50 fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Messages</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {conversationsLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        ) : conversations && conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((conversation: any) => {
              // participants already has only the other user
              const otherUser = conversation.participants[0]
              const lastMessage = conversation.lastMessage

              return (
                <button
                  key={conversation.id}
                  onClick={() =>
                    setSelectedConversation({
                      id: conversation.id,
                      otherUser: {
                        id: otherUser?.id,
                        name: otherUser?.name,
                      },
                    })
                  }
                  className="w-full p-4 hover:bg-muted rounded-lg cursor-pointer transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                      style={{ backgroundColor: otherUser?.colour || '#3b82f6' }}
                    >
                      {otherUser?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {otherUser?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
