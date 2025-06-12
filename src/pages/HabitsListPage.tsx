
import HabitList from "@/components/HabitList";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HabitsListPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <HabitList />;
}
