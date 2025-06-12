
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHabits } from "@/contexts/HabitsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, isEqual, parseISO } from "date-fns";
import { ArrowLeft, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import HabitLogForm from "./HabitLogForm";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HabitDetail() {
  const { habitId } = useParams<{ habitId: string }>();
  const { habits, selectHabit, selectedHabit, selectedDate, setSelectedDate, deleteHabit } = useHabits();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (habitId) {
      selectHabit(habitId);
    }
    return () => {
      // Clean up when unmounting
      selectHabit(null);
    };
  }, [habitId, selectHabit]);

  if (!selectedHabit) {
    return (
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Habits
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center py-8">Habit not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDeleteHabit = async () => {
    try {
      await deleteHabit(selectedHabit.id);
      navigate('/');
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Habits
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Habit
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the habit "{selectedHabit.name}" and all associated logs.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteHabit}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <h1 className="text-3xl font-bold mb-6">{selectedHabit.name}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Calendar</CardTitle>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="mx-2 text-sm">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full pointer-events-auto"
              modifiers={{
                completed: (date) => {
                  const dateString = format(date, 'yyyy-MM-dd');
                  const log = selectedHabit.logs.find(log => log.date === dateString);
                  return !!log && log.completed;
                },
                selected: (date) => isEqual(date, selectedDate)
              }}
              modifiersClassNames={{
                completed: "bg-primary text-primary-foreground",
                selected: "border-primary"
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HabitLogForm 
              habitId={selectedHabit.id} 
              date={format(selectedDate, 'yyyy-MM-dd')} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
