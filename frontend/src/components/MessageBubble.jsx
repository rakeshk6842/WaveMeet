import { formatDistanceToNow } from 'date-fns'

export default function MessageBubble({ message, isOwn, senderName }) {
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return 'just now'
    }
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-in`}>
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} gap-1`}>
        {!isOwn && (
          <span className="text-xs text-gray-600 px-3">{senderName}</span>
        )}
        <div
          className={`message-bubble ${isOwn ? 'message-sent' : 'message-received'}`}
        >
          <p className="text-gray-800 break-words">{message.content}</p>
          <span className={`text-xs ${isOwn ? 'text-gray-700' : 'text-gray-600'} mt-1 block`}>
            {formatTime(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}
