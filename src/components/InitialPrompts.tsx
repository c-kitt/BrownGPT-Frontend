import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
interface InitialPromptsProps {
  onPromptClick: (prompt: string) => void;
}
export const InitialPrompts = ({
  onPromptClick
}: InitialPromptsProps) => {
  const prompts = [{
    title: "What's your concentration?",
    description: "Tell me about your major or area of study",
    icon: "🎓"
  }, {
    title: "What semester/year are you planning for?",
    description: "Help me understand your timeline",
    icon: "📅"
  }, {
    title: "What year are you?",
    description: "Freshman, sophomore, junior, or senior?",
    icon: "📚"
  }];
  return <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--brown-dark))] mb-2 font-sans text-center">How can I help, Bruno?</h1>
        <p className="text-lg text-[hsl(var(--brown-red))] font-medium text-center">
          Welcome to BrownGPT. Let's make your Open Curriculum work for you.
        </p>
      </div>
      
      <div className="grid gap-4">
        {prompts.map((prompt, index) => <Card key={index} className="p-0 overflow-hidden border border-[hsl(var(--brown-dark))] hover:shadow-md transition-shadow">
            <Button onClick={() => onPromptClick(prompt.title)} variant="ghost" className="w-full h-auto p-6 justify-start text-left hover:bg-[hsl(var(--brown-light))]">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{prompt.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-[hsl(var(--brown-dark))] font-sans mb-1">
                    {prompt.title}
                  </h3>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm">
                    {prompt.description}
                  </p>
                </div>
              </div>
            </Button>
          </Card>)}
      </div>
    </div>;
};