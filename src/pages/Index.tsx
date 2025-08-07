import { useState, useEffect } from "react";
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
  options?: string[];
}

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior"];
const SEMESTER_OPTIONS = ["Fall 2025", "Spring 2026"];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [questionStep, setQuestionStep] = useState(0); // 0: year, 1: semester, 2: concentration
  const [userResponses, setUserResponses] = useState<{year?: string, semester?: string, concentration?: string}>({});

  // Auto-start conversation when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage("Hi there! Let's get started. What year are you?", false, YEAR_OPTIONS);
      }, 500);
    }
  }, []);

  const addMessage = (content: string, isUser: boolean, options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionClick = (option: string) => {
    if (!hasStartedChat) {
      setHasStartedChat(true);
    }
    addMessage(option, true);
    handleResponse(option);
  };

  const handleResponse = (response: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (questionStep === 0) {
        // Year question answered
        console.log(`User year: ${response}`);
        setUserResponses(prev => ({ ...prev, year: response }));
        setQuestionStep(1);
        addMessage("What semester are you planning for?", false, SEMESTER_OPTIONS);
      } else if (questionStep === 1) {
        // Semester question answered
        console.log(`User semester: ${response}`);
        setUserResponses(prev => ({ ...prev, semester: response }));
        setQuestionStep(2);
        addMessage("What concentration are you interested in or currently studying?", false);
      } else {
        // Concentration question answered
        console.log(`User concentration: ${response}`);
        const finalResponses = { ...userResponses, concentration: response };
        setUserResponses(finalResponses);
        console.log('All user responses:', finalResponses);
        addMessage("Perfect! I now have all the information I need to help you. Based on your responses, I can assist you with course planning, concentration requirements, and making the most of Brown's Open Curriculum. What would you like to explore first?", false);
      }
    }, 1500);
  };

  const handleSendMessage = (message: string) => {
    if (!hasStartedChat) {
      setHasStartedChat(true);
    }
    
    if (questionStep === 2) {
      // Handle concentration input
      addMessage(message, true);
      handleResponse(message);
    } else {
      // Regular chat after onboarding
      addMessage(message, true);
      // Add basic AI response for now
      setTimeout(() => {
        addMessage("I'm here to help with your Brown academic questions!", false);
      }, 1000);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStartedChat(false);
    setIsTyping(false);
    setQuestionStep(0);
    setUserResponses({});
  };

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar onNewChat={handleNewChat} />
      
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            {!hasStartedChat && (
              <InitialPrompts onPromptClick={handleSendMessage} />
            )}
            {messages.length > 0 && (
              <div className="space-y-0">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    options={message.options}
                    onOptionClick={handleOptionClick}
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
