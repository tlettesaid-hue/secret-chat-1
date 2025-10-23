import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { TerminalHeader } from "../components/TerminalHeader";
import { RoomCodeDisplay } from "../components/RoomCodeDisplay";
import { generateRoomCode, validateRoomCode } from "../lib/roomUtils";
import { toast } from "sonner";
import { Zap, Link as LinkIcon, Shield, Clock, Eye, Trash2 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [generatedCode, setGeneratedCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const code = generateRoomCode();
    setGeneratedCode(code);
    toast.success("Secure room created!");
  };

  const handleJoinRoom = async () => {
    if (!validateRoomCode(joinCode)) {
      toast.error("Invalid room code format");
      return;
    }
    
    toast.success("Joining secure channel...");
    navigate(`/room/${joinCode}`);
  };

  const handleEnterRoom = () => {
    if (!generatedCode) return;
    navigate(`/room/${generatedCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-green-400 font-mono relative">
      <div className="scanline" />
      
      <div className="relative z-10 flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <TerminalHeader />

        <div className="border border-green-500/30 rounded-lg p-8 bg-black/80 backdrop-blur-sm glow-border">
          <div className="grid w-full grid-cols-2 mb-6 gap-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`py-2 px-4 rounded text-sm font-medium ${
                activeTab === "create" 
                  ? "bg-green-500 text-black" 
                  : "bg-black text-green-500/60 hover:bg-green-500/10"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab("join")}
              className={`py-2 px-4 rounded text-sm font-medium ${
                activeTab === "join" 
                  ? "bg-green-500 text-black" 
                  : "bg-black text-green-500/60 hover:bg-green-500/10"
              }`}
            >
              Join
            </button>
          </div>

          {activeTab === "create" && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-green-500/60">
                  Generate a secure, ephemeral chat room
                </p>
                
                <Button 
                  onClick={handleCreateRoom}
                  size="lg"
                  className="w-full gap-2 bg-green-500 hover:bg-green-600 text-black"
                >
                  <Zap className="w-5 h-5" />
                  Generate Secure Room
                </Button>
              </div>

              <RoomCodeDisplay code={generatedCode} />

              {generatedCode && (
                <Button 
                  onClick={handleEnterRoom}
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  <LinkIcon className="w-5 h-5" />
                  Enter Room
                </Button>
              )}
            </div>
          )}

          {activeTab === "join" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-green-500/60 uppercase tracking-wider block mb-2">
                    {'>'} Enter Room Code
                  </label>
                  <Input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="e.g., 8x7Fv9TqP1nE4R2m"
                    maxLength={16}
                    className="text-center text-lg tracking-widest bg-black border-green-500/30 text-green-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleJoinRoom();
                      }
                    }}
                  />
                  <p className="text-xs text-green-500/60 mt-2">
                    16-character alphanumeric code
                  </p>
                </div>

                <Button 
                  onClick={handleJoinRoom}
                  disabled={!validateRoomCode(joinCode)}
                  size="lg"
                  className="w-full gap-2 bg-green-500 hover:bg-green-600 text-black"
                >
                  <LinkIcon className="w-5 h-5" />
                  Join Chat Room
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, label: "Zero-Knowledge" },
            { icon: Clock, label: "5min Auto-Destruct" },
            { icon: Eye, label: "Anonymous" },
            { icon: Trash2, label: "No Persistence" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="border border-green-500/20 rounded-lg p-4 bg-black/50 backdrop-blur-sm text-center space-y-2"
            >
              <Icon className="w-6 h-6 text-green-400 mx-auto" />
              <p className="text-xs text-green-500/60">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center space-y-2">
