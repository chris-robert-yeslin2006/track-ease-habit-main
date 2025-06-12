import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface HabitLog {
  id?: string;
  habit_id?: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  logs: HabitLog[];
}

interface HabitsContextProps {
  habits: Habit[];
  selectedHabit: Habit | null;
  selectedDate: Date;
  createHabit: (name: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  selectHabit: (id: string | null) => void;
  setSelectedDate: (date: Date) => void;
  toggleHabitCompletion: (habitId: string, date: string, completed: boolean) => Promise<void>;
  updateHabitNotes: (habitId: string, date: string, notes: string) => Promise<void>;
  getHabitLogForDate: (habitId: string, date: string) => HabitLog | undefined;
}

export const HabitsContext = createContext<HabitsContextProps>({
  habits: [],
  selectedHabit: null,
  selectedDate: new Date(),
  createHabit: async () => {},
  deleteHabit: async () => {},
  selectHabit: () => {},
  setSelectedDate: () => {},
  toggleHabitCompletion: async () => {},
  updateHabitNotes: async () => {},
  getHabitLogForDate: () => undefined,
});

export const HabitsProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Load habits from Supabase when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchHabits();
    } else {
      setHabits([]);
      setSelectedHabit(null);
    }
  }, [isAuthenticated, user]);

  // Set up real-time updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const habitsChannel = supabase
      .channel('public:habits')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'habits' },
        (payload) => {
          console.log('Habits change received!', payload);
          fetchHabits();
        }
      )
      .subscribe();

    const logsChannel = supabase
      .channel('public:habit_logs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'habit_logs' },
        (payload) => {
          console.log('Habit logs change received!', payload);
          fetchHabits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(habitsChannel);
      supabase.removeChannel(logsChannel);
    };
  }, [isAuthenticated, user]);

  // Update selected habit whenever habits change
  useEffect(() => {
    if (selectedHabit) {
      const updatedHabit = habits.find(h => h.id === selectedHabit.id);
      setSelectedHabit(updatedHabit || null);
    }
  }, [habits]);

  const fetchHabits = async () => {
  try {
    if (!user) return;

    // ✅ Fetch only habits where user_id = current user
    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id) // <-- add this line
      .order('created_at', { ascending: false });

    if (habitsError) throw habitsError;

    if (!habitsData.length) {
      setHabits([]);
      return;
    }

    // Fetch habit logs only for this user's habits
    const { data: logsData, error: logsError } = await supabase
      .from('habit_logs')
      .select('*')
      .in('habit_id', habitsData.map(habit => habit.id));

    if (logsError) throw logsError;

    // Combine habits with their logs
    const habitsWithLogs: Habit[] = habitsData.map(habit => {
      const habitLogs = logsData
        ? logsData.filter(log => log.habit_id === habit.id)
        : [];

      return {
        id: habit.id,
        name: habit.name,
        logs: habitLogs.map(log => ({
          id: log.id,
          habit_id: log.habit_id,
          date: log.date,
          completed: log.completed,
          notes: log.notes || '',
        })),
      };
    });

    setHabits(habitsWithLogs);
  } catch (error) {
    console.error('Error fetching habits:', error);
    toast({
      title: "Error",
      description: "Failed to load your habits",
      variant: "destructive",
    });
  }
};


  const createHabit = async (name: string) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to create a habit");
      }

      // Create a new habit with the user_id field
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => [{
        id: data.id,
        name: data.name,
        logs: [],
      }, ...prev]);
      
      toast({
        title: "Habit created",
        description: `${name} has been added to your habits`,
      });
    } catch (error) {
      console.error('Error creating habit:', error);
      toast({
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      // Delete habit (cascade will now automatically remove logs)
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      const habitToDelete = habits.find(habit => habit.id === id);
      if (habitToDelete) {
        setHabits(habits.filter(habit => habit.id !== id));
        if (selectedHabit?.id === id) {
          setSelectedHabit(null);
        }
        toast({
          title: "Habit deleted",
          description: `${habitToDelete.name} has been removed from your habits`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const selectHabit = (id: string | null) => {
    if (id === null) {
      setSelectedHabit(null);
      return;
    }
    
    const habit = habits.find(h => h.id === id);
    setSelectedHabit(habit || null);
  };

  const getHabitLogForDate = (habitId: string, date: string): HabitLog | undefined => {
    const habit = habits.find(h => h.id === habitId);
    return habit?.logs.find(log => log.date === date);
  };

  const toggleHabitCompletion = async (habitId: string, date: string, completed: boolean) => {
    try {
      const existingLog = getHabitLogForDate(habitId, date);
      
      if (existingLog?.id) {
        // Update existing log
        const { error } = await supabase
          .from('habit_logs')
          .update({ completed })
          .eq('id', existingLog.id);

        if (error) throw error;
      } else {
        // Create new log
        const { error } = await supabase
          .from('habit_logs')
          .insert([{ 
            habit_id: habitId, 
            date, 
            completed, 
            notes: ''
          }]);

        if (error) throw error;
      }

      // Local state is updated via the real-time subscription
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      toast({
        title: "Error",
        description: "Failed to update habit status",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateHabitNotes = async (habitId: string, date: string, notes: string) => {
    try {
      const existingLog = getHabitLogForDate(habitId, date);
      
      if (existingLog?.id) {
        // Update existing log
        const { error } = await supabase
          .from('habit_logs')
          .update({ notes })
          .eq('id', existingLog.id);

        if (error) throw error;
      } else {
        // Create new log with notes but not completed
        const { error } = await supabase
          .from('habit_logs')
          .insert([{ 
            habit_id: habitId, 
            date, 
            completed: false, 
            notes 
          }]);

        if (error) throw error;
      }

      // Local state is updated via the real-time subscription
    } catch (error) {
      console.error('Error updating habit notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <HabitsContext.Provider 
      value={{ 
        habits, 
        selectedHabit, 
        selectedDate,
        createHabit, 
        deleteHabit, 
        selectHabit,
        setSelectedDate,
        toggleHabitCompletion,
        updateHabitNotes,
        getHabitLogForDate,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => useContext(HabitsContext);
