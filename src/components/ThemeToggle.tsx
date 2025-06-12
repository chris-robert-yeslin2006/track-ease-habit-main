
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full"
    >
      {theme === 'dark' ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-blue-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
