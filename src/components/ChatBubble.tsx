import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  className?: string;
  options?: string[];
  onOptionClick?: (option: string) => void;
  isOnboarding?: boolean;
}

export const ChatBubble = ({ message, isUser, className, options, onOptionClick, isOnboarding = false }: ChatBubbleProps) => {
  const spacing = isOnboarding ? (isUser ? "mb-4" : "mb-4") : (isUser ? "mb-8" : "mb-12");
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start", spacing)}>
      <div className="max-w-[80%]">
        <div
          className={cn(
            "text-base leading-relaxed mt-8",
            isUser ? "chat-message-user" : "chat-message-ai",
            className
          )}
        >
          {message}
        </div>
        {options && options.length > 0 && !isUser && (
          <div className="mt-3 flex flex-wrap gap-2">
            {options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onOptionClick?.(option)}
                className="border-[hsl(var(--brown-dark))] text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))] flex items-center gap-2"
              >
                {option}
                {option === "See concentrations here" && (
                  <ExternalLink className="w-4 h-4" />
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};