export const TerminalHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-green-400 glow-text">
        🔒 SECRET
      </h1>
      <p className="text-green-500/60 text-sm font-mono">
        TEMPORARY ENCRYPTED CHAT · SELF-DESTRUCTING MESSAGES
      </p>
      <div className="mt-4 text-xs text-green-500/40 font-mono">
        {">"} SECURE CHANNEL ACTIVE · END-TO-END ENCRYPTED
      </div>
    </div>
  );
};