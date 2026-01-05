import { Send, X } from "lucide-react"
import { useState } from "react"
import { useGetMessageHistory } from "@/hook/message/useGetMessageHistory"
import { useSendMessage } from "@/hook/message/useSendMessage"
import { useGetCurrentUser } from "@/hook/user/useGetCurrentUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQueryClient } from "@tanstack/react-query"

interface MessageThreadProps {
  conversationId: string
  otherUser: {
    id: string
    name: string
  }
  onClose: () => void
}

export default function MessageThread({ conversationId, otherUser, onClose }: MessageThreadProps) {
  const queryClient = useQueryClient()
  const { data: messages, isLoading } = useGetMessageHistory(conversationId, 50, 0)
  const { mutate: sendMessage, isPending } = useSendMessage()
  const { data: currentUser } = useGetCurrentUser()
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    sendMessage(
      {
        receiverId: otherUser.id,
        content: messageInput.trim(),
      },
      {
        onSuccess: () => {
          setMessageInput("")
          // Refetch messages to show the newly sent message
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
          // Also refetch conversations to update last message
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        },
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-96 bg-card border-r border-border h-screen overflow-y-auto shadow-xl flex flex-col z-50 fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-foreground">{otherUser.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4 flex flex-col">
            {messages.map((message: any) => {
              const isOwn = message.senderId === currentUser?.id

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      isOwn
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        isOwn ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border sticky bottom-0 bg-card/95 backdrop-blur-sm">
        <div className="flex gap-3">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isPending || !messageInput.trim()}
            size="icon"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
