import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, BookOpen, Calendar } from "lucide-react";

interface ChatSidebarProps {
  onNewChat: () => void;
  recentChats?: string[];
}
export const ChatSidebar = ({
  onNewChat,
  recentChats = []
}: ChatSidebarProps) => {
  return <div className="w-64 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] flex flex-col h-full">
      {/* Header with Brown crest and title */}
      <div className="p-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <img src="/lovable-uploads/0ef44bb7-cd5e-4b1a-a1a8-25c93a89fbd1.png" alt="Brown Bear Mascot" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-serif text-lg text-[hsl(var(--brown-dark))] font-bold">
            BrownGPT
          </span>
        </div>
        
        <Button onClick={onNewChat} variant="outline" className="w-full justify-start space-x-2 border-[hsl(var(--brown-dark))] text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))]">
          <Plus className="w-4 h-4" />
          <span>New chat</span>
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start space-x-2 text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))]">
          <BookOpen className="w-4 h-4" />
          <span>Course Catalog</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start space-x-2 text-[hsl(var(--brown-dark))] hover:bg-[hsl(var(--brown-light))]">
          <Calendar className="w-4 h-4" />
          <span>Academic Calendar</span>
        </Button>
      </div>

    </div>;
};