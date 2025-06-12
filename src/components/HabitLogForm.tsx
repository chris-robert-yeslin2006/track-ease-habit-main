
import { useEffect, useState } from "react";
import { useHabits } from "@/contexts/HabitsContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface HabitLogFormProps {
  habitId: string;
  date: string;
}

export default function HabitLogForm({ habitId, date }: HabitLogFormProps) {
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState("");
  const { getHabitLogForDate, toggleHabitCompletion, updateHabitNotes } = useHabits();
  const { toast } = useToast();

  useEffect(() => {
    const log = getHabitLogForDate(habitId, date);
    setCompleted(log?.completed || false);
    setNotes(log?.notes || "");
  }, [habitId, date, getHabitLogForDate]);

  const handleCompletionToggle = () => {
    const newStatus = !completed;
    setCompleted(newStatus);
    toggleHabitCompletion(habitId, date, newStatus);
    
    toast({
      title: newStatus ? "Habit completed" : "Habit marked as not completed",
      description: `For ${new Date(date).toLocaleDateString()}`,
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleNotesSave = () => {
    updateHabitNotes(habitId, date, notes);
    
    toast({
      title: "Notes saved",
      description: `Notes updated for ${new Date(date).toLocaleDateString()}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="completed">Completed this habit</Label>
        <Switch
          id="completed"
          checked={completed}
          onCheckedChange={handleCompletionToggle}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add notes about your progress..."
          value={notes}
          onChange={handleNotesChange}
          className="min-h-[120px]"
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNotesSave}
          disabled={notes === getHabitLogForDate(habitId, date)?.notes}
          className="mt-2"
        >
          Save Notes
        </Button>
      </div>
    </div>
  );
}
