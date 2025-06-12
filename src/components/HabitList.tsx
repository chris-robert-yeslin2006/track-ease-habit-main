
import { useNavigate } from "react-router-dom";
import { useHabits } from "@/contexts/HabitsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";

export default function HabitList() {
  const { habits, selectHabit } = useHabits();
  const navigate = useNavigate();

  const handleHabitClick = (id: string) => {
    selectHabit(id);
    navigate(`/habits/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Habits</h1>
        <Button onClick={() => navigate('/create-habit')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>
      
      <div className="flex items-center mb-4">
        <CalendarIcon className="mr-2 h-5 w-5" />
        <span>{format(new Date(), 'MMMM yyyy')}</span>
      </div>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="font-semibold text-lg mb-2">No habits yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your habits by creating your first one
              </p>
              <Button onClick={() => navigate('/create-habit')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Habit
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {habits.map((habit) => (
            <Card 
              key={habit.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleHabitClick(habit.id)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <h3 className="font-medium">{habit.name}</h3>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
