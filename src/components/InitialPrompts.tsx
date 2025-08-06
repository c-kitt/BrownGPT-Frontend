interface InitialPromptsProps {
  onPromptClick: (prompt: string) => void;
}

export const InitialPrompts = ({
  onPromptClick
}: InitialPromptsProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[hsl(var(--brown-dark))] mb-4 font-sans">
          How can I help, Bruno?
        </h1>
        <p className="text-xl text-[hsl(var(--brown-red))] font-medium">
          Welcome to BrownGPT. Let's make your Open Curriculum work for you.
        </p>
      </div>
    </div>
  );
};