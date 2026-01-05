import { MessageCircle } from 'lucide-react';

interface MessageBubbleProps {
  onClick?: () => void;
}

export default function MessageBubble({ onClick }: MessageBubbleProps) {
  return (
    <div className="flex items-center justify-center">
      <button 
        onClick={onClick}
        className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
      >
        <MessageCircle size={32} className="text-white" />
      </button>
    </div>
  );
}
