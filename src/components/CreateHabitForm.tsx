
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "@/contexts/HabitsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CreateHabitForm() {
  const [habitName, setHabitName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createHabit } = useHabits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!habitName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createHabit(habitName.trim());
      toast({
        title: "Success",
        description: "Habit created successfully",
      });
      navigate('/');
    } catch (error: any) {
      console.error("Error creating habit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Habit</CardTitle>
          <CardDescription>
            Add a new habit to track in your daily routine
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="Enter habit name..."
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                disabled={isLoading}
                maxLength={50}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !habitName.trim()}
            >
              {isLoading ? "Creating..." : "Save Habit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
