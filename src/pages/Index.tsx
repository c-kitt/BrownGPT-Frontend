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

const QUESTIONS = [
  "What's your concentration?",
  "What semester/year are you planning for?", 
  "What year are you?"
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);

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
    
    // Log user response
    console.log(`User response to question ${currentQuestionIndex}: ${userMessage}`);
    
    // Store user response
    const updatedResponses = [...userResponses, userMessage];
    setUserResponses(updatedResponses);
    
    // Simulate AI thinking time
    setTimeout(() => {
      setIsTyping(false);
      
      // Check if we need to ask the next question
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        const nextQuestion = QUESTIONS[currentQuestionIndex + 1];
        addMessage(nextQuestion, false);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered, provide summary response
        console.log('All user responses:', updatedResponses);
        const response = "Perfect! I now have all the information I need to help you. Based on your responses, I can assist you with course planning, concentration requirements, and making the most of Brown's Open Curriculum. What would you like to explore first?";
        addMessage(response, false);
      }
    }, 1500);
  };

  const handleSendMessage = (message: string) => {
    if (!hasStartedChat) {
      setHasStartedChat(true);
      // Start with first question
      addMessage(message, true);
      setTimeout(() => {
        addMessage(QUESTIONS[0], false);
        setCurrentQuestionIndex(0);
      }, 1000);
    } else {
      addMessage(message, true);
      simulateAIResponse(message);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStartedChat(false);
    setIsTyping(false);
    setCurrentQuestionIndex(0);
    setUserResponses([]);
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
