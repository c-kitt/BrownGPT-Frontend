// src/pages/Index.tsx

import { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatBubble } from "@/components/ChatBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { InitialPrompts } from "@/components/InitialPrompts";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  generateSessionId, 
  initializeSession, 
  setUserContext, 
  sendMessage as sendApiMessage,
  validateConcentration
} from "@/lib/api";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  options?: string[];
}

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior"];
const SEMESTER_OPTIONS = ["Fall 2025", "Spring 2026"];
const MAIN_ACTIONS = [
  "Recommend courses for my concentration",
  "Create a sample schedule",
  "Check my schedule for conflicts"
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showInitialPrompt, setShowInitialPrompt] = useState(true);
  const [questionStep, setQuestionStep] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [userResponses, setUserResponses] = useState<{
    year?: string, 
    semester?: string, 
    concentration?: string,
    properConcentration?: string
  }>({});
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [contextSet, setContextSet] = useState(false);
  const [recentChats, setRecentChats] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isAtBottom]);

  // Initialize on mount
  useEffect(() => {
    const startConversation = async () => {
      try {
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        
        try {
          await initializeSession(newSessionId);
          console.log("Backend session initialized");
        } catch (error) {
          console.log("Backend not connected, continuing in offline mode");
        }
        
        setTimeout(() => {
          addMessage("Hi! I'm BrownGPT, your AI course advisor. Let's get started. What year are you?", false, YEAR_OPTIONS);
        }, 500);
      } catch (error) {
        console.error("Error starting conversation:", error);
        addMessage("Hi! I'm BrownGPT. What year are you?", false, YEAR_OPTIONS);
      }
    };
    
    if (messages.length === 0) {
      startConversation();
    }
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    setIsAtBottom(isNearBottom);
  };

  // Helper function to check if we should show action buttons
  const shouldShowActions = (message: string) => {
    return contextSet && 
           !message.includes("error") && 
           !message.includes("Error") &&
           !message.includes("trouble");
  };

  // Regular addMessage for all messages
  const addMessage = (content: string, isUser: boolean, options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation history
    if (!options) {
      setConversationHistory(prev => {
        const updated = [...prev, `${isUser ? 'User' : 'Assistant'}: ${content}`];
        return updated.slice(-30);
      });
    }
  };

  // Special function for AI messages that may need follow-up
  const addAIMessage = (content: string, showFollowUp: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: false,
      timestamp: new Date(),
      options: undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Add follow-up message with action buttons if appropriate
    if (showFollowUp && shouldShowActions(content)) {
      setTimeout(() => {
        const followUpMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Is there anything else I can help with?",
          isUser: false,
          timestamp: new Date(),
          options: MAIN_ACTIONS
        };
        setMessages(prev => [...prev, followUpMessage]);
      }, 500);
    }
    
    // Update conversation history
    setConversationHistory(prev => {
      const updated = [...prev, `Assistant: ${content}`];
      return updated.slice(-30);
    });
  };

  const handleOptionClick = async (option: string) => {
    if (option === "See concentrations here") {
      window.open("https://bulletin.brown.edu/the-college/concentrations/", "_blank");
      return;
    }
    
    if (!hasStartedChat) {
      setHasStartedChat(true);
      setShowInitialPrompt(false);
    }
    
    addMessage(option, true);
    
    // Handle confirmation responses
    if (waitingForConfirmation) {
      if (option === "Yes") {
        await finalizeContext();
      } else {
        setWaitingForConfirmation(false);
        setQuestionStep(2);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage("No problem! Please type your concentration below:", false);
        }, 1000);
      }
      return;
    }
    
    // Handle main action options - THIS IS THE KEY FIX
    if (contextSet && MAIN_ACTIONS.includes(option)) {
      await handleMainAction(option);
      return;
    }
    
    // Handle onboarding responses
    if (!contextSet) {
      handleOnboardingResponse(option);
    }
  };

  const handleOnboardingResponse = (response: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      if (questionStep === 0) {
        setUserResponses(prev => ({ ...prev, year: response }));
        setQuestionStep(1);
        addMessage("Great! What semester are you planning for?", false, SEMESTER_OPTIONS);
      } else if (questionStep === 1) {
        setUserResponses(prev => ({ ...prev, semester: response }));
        setQuestionStep(2);
        addMessage("What's your concentration? Type it below (e.g., 'Computer Science', 'APMC', 'Economics'):", false, ["See concentrations here"]);
      }
    }, 1000);
  };

  const handleMainAction = async (action: string) => {
    setIsTyping(true);
    
    // Build the ACTUAL query based on the SPECIFIC action clicked
    let query = "";
    if (action === "Recommend courses for my concentration") {
      query = "What courses should I take for my concentration? Recommend specific courses.";
    } else if (action === "Create a sample schedule") {
      query = "Create a sample 4-course schedule for me this semester";
    } else if (action === "Check my schedule for conflicts") {
      query = "I want to check if my courses have schedule conflicts. What courses would you like me to check?";
    }
    
    console.log("[UI] Processing action:", action, "with query:", query);
    
    try {
      const response = await sendApiMessage(sessionId, query);
      setIsTyping(false);
      addAIMessage(response.response, true);
    } catch (error) {
      setIsTyping(false);
      console.error("Chat error:", error);
      addAIMessage("I'm having trouble processing that. Please try again.", false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!hasStartedChat) {
      setHasStartedChat(true);
      setShowInitialPrompt(false);
    }
    
    addMessage(message, true);
    
    if (questionStep === 2 && !contextSet) {
      // Handle concentration input
      setIsTyping(true);
      
      try {
        const validationResult = await validateConcentration(message);
        const properName = validationResult.proper_name || message;
        
        console.log(`[UI] Converted "${message}" to "${properName}"`);
        
        setUserResponses(prev => ({ 
          ...prev, 
          concentration: message,
          properConcentration: properName 
        }));
        
        setTimeout(() => {
          setIsTyping(false);
          setWaitingForConfirmation(true);
          addMessage(
            `Just to confirm - you're a ${userResponses.year} studying ${properName}, planning for ${userResponses.semester}. Is that correct?`, 
            false, 
            ["Yes", "No"]
          );
        }, 1500);
        
      } catch (error) {
        console.error('[UI] Error validating concentration:', error);
        setUserResponses(prev => ({ 
          ...prev, 
          concentration: message,
          properConcentration: message 
        }));
        
        setTimeout(() => {
          setIsTyping(false);
          setWaitingForConfirmation(true);
          addMessage(
            `Just to confirm - you're a ${userResponses.year} studying ${message}, planning for ${userResponses.semester}. Is that correct?`, 
            false, 
            ["Yes", "No"]
          );
        }, 1500);
      }
    } else if (contextSet) {
      // Regular chat after onboarding
      setIsTyping(true);
      
      // Include conversation history for context
      const contextualMessage = conversationHistory.length > 4
        ? `${message}\n\n[Context: ${conversationHistory.slice(-6).join(' | ')}]`
        : message;
      
      try {
        const response = await sendApiMessage(sessionId, contextualMessage);
        setIsTyping(false);
        // Add AI response with follow-up actions
        addAIMessage(response.response, true);
      } catch (error) {
        setIsTyping(false);
        console.error("[UI] API error:", error);
        addAIMessage("I'm having trouble connecting. Please try again.", false);
      }
    }
  };

  const finalizeContext = async () => {
    setIsTyping(true);
    
    const contextData = {
      concentration: userResponses.properConcentration || userResponses.concentration!,
      gradeLevel: userResponses.year!,
      semester: userResponses.semester!
    };
    
    console.log("[UI] Finalizing context with:", contextData);
    
    try {
      const response = await setUserContext(sessionId, contextData);
      console.log("[UI] Context set successfully:", response);
      
      setContextSet(true);
      setWaitingForConfirmation(false);
      setIsTyping(false);
      
      const chatTitle = `${userResponses.year} - ${userResponses.properConcentration || userResponses.concentration}`;
      setRecentChats(prev => [chatTitle, ...prev.slice(0, 9)]);
      
      // Show initial prompt with actions (no follow-up for this one)
      addMessage(
        "Perfect! I'm ready to help you. What would you like to do?",
        false,
        MAIN_ACTIONS
      );
    } catch (error) {
      console.error("[UI] Failed to set context:", error);
      setIsTyping(false);
      setContextSet(false);
      setWaitingForConfirmation(false);
      addMessage("There was an error setting up your profile. Please refresh and try again.", false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStartedChat(false);
    setShowInitialPrompt(true);
    setIsTyping(false);
    setQuestionStep(0);
    setUserResponses({});
    setWaitingForConfirmation(false);
    setContextSet(false);
    setConversationHistory([]);
    
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    setTimeout(() => {
      addMessage("Hi! I'm BrownGPT, your AI course advisor. Let's get started. What year are you?", false, YEAR_OPTIONS);
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
        {/* Mobile header */}
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
            {/* Show initial prompt until user starts interacting */}
            {showInitialPrompt && messages.length > 0 && (
              <div className="mb-8">
                <InitialPrompts onPromptClick={handleSendMessage} />
              </div>
            )}
            
            {/* Messages */}
            {messages.length > 0 && (
              <div className={`space-y-0 ${!showInitialPrompt ? 'mt-auto' : ''}`}>
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
          placeholder={
            contextSet 
              ? "Ask me anything about courses..." 
              : questionStep === 2 
                ? "Type your concentration..."
                : "Select an option above"
          }
        />
      </div>
    </div>
  );
};

export default Index;