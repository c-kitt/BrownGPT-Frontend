import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  className?: string;
}

export const ChatBubble = ({ message, isUser, className }: ChatBubbleProps) => {
  return (
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "text-base leading-relaxed",
          isUser ? "chat-message-user" : "chat-message-ai",
          className
        )}
      >
        {message}
      </div>
    </div>
  );
};