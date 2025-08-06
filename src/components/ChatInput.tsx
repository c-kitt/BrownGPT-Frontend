import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Ask anything" }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 bg-background border-t border-[hsl(var(--border))] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[56px] max-h-32 resize-none border-[hsl(var(--brown-dark))] focus:ring-[hsl(var(--brown-red))] focus:border-[hsl(var(--brown-red))]",
              "text-base font-serif pr-12"
            )}
          />
          <Button
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            size="icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[hsl(var(--brown-red))] hover:bg-[hsl(var(--brown-red))/90] text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};