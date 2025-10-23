export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(byte => chars[byte % chars.length])
    .join('');
};

export const validateRoomCode = (code: string): boolean => {
  const roomCodeRegex = /^[A-Za-z0-9]{16}$/;
  return roomCodeRegex.test(code);
};

export const formatTimeLeft = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};