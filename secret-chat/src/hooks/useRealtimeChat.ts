import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Message } from "../components/MessageItem";
import { toast } from "sonner";

interface RealtimeChatReturn {
  messages: Message[];
  isConnected: boolean;
  userCount: number;
  typingUsers: string[];
  sendMessage: (content: string, type?: string, metadata?: any) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  error: string | null;
  currentUserId: string;
}

export const useRealtimeChat = (roomCode: string): RealtimeChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const userId = useRef(crypto.randomUUID());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeRoom = useCallback(async () => {
    if (!roomCode) return;

    try {
      const { error: roomError } = await supabase
        .from('rooms')
        .upsert({ code: roomCode, last_activity: new Date().toISOString() }, { onConflict: 'code' });

      if (roomError) throw roomError;

      const { data: existingMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('room_code', roomCode)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const formattedMessages = existingMessages?.map(msg => ({
        id: msg.id,
        type: msg.type as any,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        senderId: msg.sender_id,
        metadata: msg.metadata as any,
      })) || [];

      setMessages(formattedMessages);

    } catch (err) {
      setError('Failed to initialize chat room');
      toast.error('Failed to initialize room');
    }
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase.channel(`room:${roomCode}`, {
      config: {
        presence: {
          key: userId.current,
        },
      },
    });

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            type: payload.new.type,
            content: payload.new.content,
            timestamp: new Date(payload.new.created_at).getTime(),
            senderId: payload.new.sender_id,
            metadata: payload.new.metadata as any,
          };
          
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state);
        setUserCount(users.length);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        toast.success('New user joined');
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        toast.info('User left');
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== userId.current) {
          setTypingUsers(prev => {
            if (payload.isTyping) {
              return [...new Set([...prev, payload.userId])];
            } else {
              return prev.filter(id => id !== payload.userId);
            }
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await channel.track({ userId: userId.current, online_at: new Date().toISOString() });
          toast.success('Connected');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnected(false);
          setError('Connection failed');
          toast.error('Connection failed');
        }
      });

    channelRef.current = channel;
    initializeRoom();

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomCode, initializeRoom]);

  const sendMessage = useCallback(async (content: string, type: string = 'text', metadata: any = null) => {
    if (!roomCode || !content.trim()) return;

    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          room_code: roomCode,
          type,
          content,
          sender_id: userId.current,
          metadata,
        });

      if (insertError) throw insertError;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      await channelRef.current?.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: userId.current, isTyping: false },
      });

    } catch (err) {
      setError('Failed to send message');
      toast.error('Failed to send message');
    }
  }, [roomCode]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!channelRef.current) return;

    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: userId.current, isTyping },
    });

    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 3000);
    }
  }, []);

  return {
    messages,
    isConnected,
    userCount,
    typingUsers,
    sendMessage,
    setTyping,
    error,
    currentUserId: userId.current,
  };
};