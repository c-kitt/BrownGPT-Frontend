export const TypingIndicator = () => {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="chat-message-ai flex items-center space-x-1">
        <div className="typing-dot w-2 h-2 bg-[hsl(var(--brown-red))] rounded-full"></div>
        <div className="typing-dot w-2 h-2 bg-[hsl(var(--brown-red))] rounded-full"></div>
        <div className="typing-dot w-2 h-2 bg-[hsl(var(--brown-red))] rounded-full"></div>
      </div>
    </div>
  );
};