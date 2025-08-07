import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import ReactMarkdown from 'react-markdown';

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
          {isUser ? (
            message
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold text-[hsl(var(--brown-dark))]">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          )}
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