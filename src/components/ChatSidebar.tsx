// src/components/ChatSidebar.tsx

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, BookOpen, Calendar, Menu, FileText, User, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

interface ChatSidebarProps {
  onNewChat: () => void;
  recentChats?: string[];
  onToggleSidebar?: () => void;
}

export const ChatSidebar = ({
  onNewChat,
  recentChats = [],
  onToggleSidebar
}: ChatSidebarProps) => {
  const { theme, setTheme } = useTheme();
  
  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="w-64 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] flex flex-col h-full">
      {/* Header with Brown crest and title */}
      <div className="p-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/lovable-uploads/0ef44bb7-cd5e-4b1a-a1a8-25c93a89fbd1.png" alt="Brown Bear Mascot" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-serif text-lg text-[hsl(var(--brown-dark))] font-bold">
              BrownGPT
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))] p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        
        <Button onClick={onNewChat} variant="outline" className="w-full justify-start space-x-2 border-[hsl(var(--brown-dark))] text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))]">
          <Plus className="w-4 h-4" />
          <span>New chat</span>
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start space-x-2 text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))]"
            onClick={() => handleOpenLink('https://cab.brown.edu/')}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Catalog</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start space-x-2 text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))]"
            onClick={() => handleOpenLink('https://registrar.brown.edu/academic-calendar/2025-2026-academic-calendar')}
          >
            <Calendar className="w-4 h-4" />
            <span>Academic Calendar</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start space-x-2 text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))]"
            onClick={() => handleOpenLink('https://bulletin.brown.edu/the-college/concentrations/')}
          >
            <FileText className="w-4 h-4" />
            <span>Concentration Guide</span>
          </Button>
        </div>
        
        {/* Disclaimer Box */}
        <div className="px-4 pb-4">
          <div className="border border-red-500 rounded-lg p-3 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-700 dark:text-red-300">
                <p className="font-semibold mb-1">Early Beta Version</p>
                <p>BrownGPT is in early development and may not be fully accurate. Always verify information with your academic advisors and refer to official Brown resources. Please allow 5 - 15 seconds for a response</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Spacer to push bottom items down */}
        <div className="flex-1" />
        
        {/* Theme Toggle */}
        <div className="px-4 pb-2">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-between p-2 rounded hover:bg-[hsl(var(--brown-light))] w-full transition-colors"
          >
            <span className="text-sm text-[hsl(var(--brown-dark))]">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className="w-9 h-9 flex items-center justify-center">
              {theme === 'light' ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
            </div>
          </button>
        </div>
        
        {/* About Me at bottom */}
        <div className="p-4 border-t border-[hsl(var(--sidebar-border))]">
          <Button 
            variant="ghost" 
            className="w-full justify-start space-x-2 text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))]"
            onClick={() => handleOpenLink('https://ckitt.me')}
          >
            <User className="w-4 h-4" />
            <span>About Me</span>
          </Button>
        </div>
      </div>
    </div>
  );
};