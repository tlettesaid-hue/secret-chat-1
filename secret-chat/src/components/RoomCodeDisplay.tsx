import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface RoomCodeDisplayProps {
  code: string;
}

export const RoomCodeDisplay = ({ code }: RoomCodeDisplayProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Room code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy room code");
    }
  };

  if (!code) return null;

  return (
    <div className="border border-green-500/30 rounded-lg p-4 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-green-500/60 mb-1">Room Code</p>
          <p className="text-lg font-mono tracking-widest text-green-400">{code}</p>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-green-500/40 mt-2">
        Share this code with others to invite them to the chat
      </p>
    </div>
  );
};