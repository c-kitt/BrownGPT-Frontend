import { useState, useEffect, useRef } from "react";
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
  const [recentChats, setRecentChats] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isAtBottom]);

  // Auto-start conversation when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage("Hi there! Let's get started. What year are you?", false, YEAR_OPTIONS);
      }, 500);
    }
  }, []);

  // Handle scroll detection
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    setIsAtBottom(isNearBottom);
  };

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
    if (option === "See concentrations here") {
      window.open("https://www.brown.edu/academics/undergraduate/concentrations", "_blank");
      return;
    }
    
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
        addMessage("What concentration are you interested in or currently studying? (Type below!)", false, ["See concentrations here"]);
      } else {
        // Concentration question answered
        console.log(`User concentration: ${response}`);
        const finalResponses = { ...userResponses, concentration: response };
        setUserResponses(finalResponses);
        console.log('All user responses:', finalResponses);
        
        // Save this chat to recent chats
        const chatTitle = `${finalResponses.year} - ${finalResponses.concentration}`;
        setRecentChats(prev => [chatTitle, ...prev.slice(0, 9)]); // Keep max 10 recent chats
        
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
    
    // Trigger initial message after a short delay
    setTimeout(() => {
      addMessage("Hi there! Let's get started. What year are you?", false, YEAR_OPTIONS);
    }, 500);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        fixed lg:relative z-50 lg:z-auto transition-transform duration-300 ease-in-out
      `}>
        <ChatSidebar 
          onNewChat={handleNewChat} 
          recentChats={recentChats}
          onToggleSidebar={toggleSidebar}
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Mobile header with menu button */}
        <div className="lg:hidden flex items-center p-4 border-b border-[hsl(var(--sidebar-border))]">
          <button
            onClick={toggleSidebar}
            className="text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))] p-2 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 font-serif text-lg text-[hsl(var(--brown-dark))] font-bold">
            BrownGPT
          </span>
        </div>
        
        <ScrollArea className="flex-1" onScroll={handleScroll}>
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
                    isOnboarding={questionStep < 3}
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={scrollRef} />
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
