import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageItem, Message } from "./MessageItem";
import { Timer, Send, LogOut, Paperclip, Users } from "lucide-react";
import { formatTimeLeft } from "../lib/roomUtils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useRealtimeChat } from "../hooks/useRealtimeChat";

export const ChatRoom = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [newMessage, setNewMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(5 * 60 * 1000);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    messages,
    isConnected,
    userCount,
    typingUsers,
    sendMessage: sendRealtimeMessage,
    setTyping,
    error,
    currentUserId,
  } = useRealtimeChat(roomCode || "");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          handleLeaveRoom();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await sendRealtimeMessage(newMessage, 'text');
    setNewMessage("");
    
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#00FF80']
    });

    setTimeLeft(5 * 60 * 1000);
  };

  const handleTyping = () => {
    setTyping(true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 2000);
  };

  const isWarningTime = timeLeft < 60 * 1000;

  return (
    <div className="min-h-screen flex flex-col bg-black text-green-400 font-mono">
      <div className="border-b border-green-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xs">
              <span className="text-green-500/60">ROOM:</span>{" "}
              <span className="text-green-400">{roomCode}</span>
            </div>
            
            <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded border ${
              isConnected 
                ? 'border-green-500/30 text-green-400' 
                : 'border-red-500/30 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
            </div>
            
            {userCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-green-500/60">
                <Users className="w-3 h-3" />
                <span>{userCount}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm ${
              isWarningTime ? 'text-red-400 animate-pulse' : 'text-green-400'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{formatTimeLeft(timeLeft)}</span>
            </div>
            
            <button
              onClick={() => navigate("/")}
              className="gap-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 px-3 py-1 rounded text-sm"
            >
              <LogOut className="w-4 h-4 inline mr-1" />
              Leave
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-green-500/60 text-sm">
              <p>{'>'} No messages yet</p>
              <p className="text-xs mt-2">Start the conversation...</p>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message, index) => (
              <MessageItem
                key={`${message.id}-${index}`}
                message={message}
                isOwnMessage={message.senderId === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-500/60 mb-4">
            <span>{typingUsers.length} {typingUsers.length === 1 ? 'person' : 'people'} typing</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-green-500/20 bg-black/50 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 border border-green-500/30 text-green-400 hover:bg-green-500/10 p-2 rounded"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            
            <input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 bg-black border border-green-500/30 text-green-400 placeholder-green-500/40 px-3 py-2 rounded"
              disabled={!isConnected}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="gap-2 flex-shrink-0 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-green-500/60 mt-2 text-center">
            Messages self-destruct after {formatTimeLeft(timeLeft)} · Max 5MB files
          </p>
        </div>
      </div>
    </div>
  );
};