import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatBubble } from "@/components/ChatBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { InitialPrompts } from "@/components/InitialPrompts";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      setIsTyping(false);
      
      // Simple responses based on the initial prompts
      let response = "";
      if (userMessage.toLowerCase().includes("concentration") || userMessage.toLowerCase().includes("major")) {
        response = "Great! I'd love to help you with your concentration. What field are you interested in or currently studying? Brown's Open Curriculum gives you incredible flexibility to explore your passions.";
      } else if (userMessage.toLowerCase().includes("semester") || userMessage.toLowerCase().includes("planning")) {
        response = "Planning ahead is smart! What semester are you thinking about? I can help you map out course sequences and make sure you're on track for your goals.";
      } else if (userMessage.toLowerCase().includes("year") || userMessage.toLowerCase().includes("freshman") || userMessage.toLowerCase().includes("sophomore")) {
        response = "Thanks for letting me know! Each year at Brown brings unique opportunities. I can help you navigate course selection, research opportunities, and make the most of your time on the Hill.";
      } else {
        response = "That's a great question! As your Brown academic assistant, I'm here to help you navigate the Open Curriculum, plan your courses, explore concentrations, and make the most of your Brown experience. What would you like to know more about?";
      }
      
      addMessage(response, false);
    }, 1500);
  };

  const handleSendMessage = (message: string) => {
    if (!hasStartedChat) {
      setHasStartedChat(true);
    }
    
    addMessage(message, true);
    simulateAIResponse(message);
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStartedChat(false);
    setIsTyping(false);
  };

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar onNewChat={handleNewChat} />
      
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            {!hasStartedChat ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <InitialPrompts onPromptClick={handleSendMessage} />
              </div>
            ) : (
              <div className="space-y-0">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                  />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            )}
          </div>
        </ScrollArea>
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder={hasStartedChat ? "Ask anything about Brown..." : "Ask anything"}
        />
      </div>
    </div>
  );
};

export default Index;
