import { useState } from "react";
import { Download, ImageIcon, FileText } from "lucide-react";

export interface Message {
  id: string;
  type: "text" | "image" | "file" | "system";
  content: string;
  timestamp: number;
  senderId: string;
  metadata?: any;
}

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageItem = ({ message, isOwnMessage }: MessageItemProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getMessageStyles = () => {
    if (message.type === "system") {
      return "bg-gray-800 border border-gray-600 text-gray-300 mx-auto max-w-md text-center";
    }

    if (isOwnMessage) {
      return "bg-gradient-to-br from-green-500 to-green-600 text-black border border-green-400 ml-auto mr-4";
    } else {
      return "bg-gradient-to-br from-red-500 to-red-600 text-white border border-red-400 mr-auto ml-4";
    }
  };

  const getSenderText = () => {
    if (message.type === "system") return "System";
    return isOwnMessage ? "You" : "Anonymous";
  };

  if (message.type === "system") {
    return (
      <div className={`rounded-lg px-4 py-2 my-2 text-sm ${getMessageStyles()}`}>
        <div className="text-xs opacity-75">{message.content}</div>
        <div className="text-xs opacity-50 mt-1">{formatTime(message.timestamp)}</div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl px-4 py-3 my-3 max-w-md relative ${getMessageStyles()}`}>
      
      {!isOwnMessage && (
        <div className="absolute -left-2 top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-red-500"></div>
      )}
      {isOwnMessage && (
        <div className="absolute -right-2 top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-green-500"></div>
      )}

      <div className="mb-2">
        {message.type === "text" && (
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        )}

        {message.type === "image" && (
          <div className="space-y-2">
            <div className="relative rounded-lg overflow-hidden bg-black/20">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white/50" />
                </div>
              )}
              <img
                src={message.content}
                alt="Shared image"
                className={`max-w-full h-auto rounded-lg transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        )}

        {message.type === "file" && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20">
              <FileText className="w-6 h-6" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {message.metadata?.name || "File"}
                </p>
                <p className="text-xs opacity-75">
                  {(message.metadata?.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`flex items-center justify-between text-xs opacity-75 ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}>
        <span className="font-medium">{getSenderText()}</span>
        <span>{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};