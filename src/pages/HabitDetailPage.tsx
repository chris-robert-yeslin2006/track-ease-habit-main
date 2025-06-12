
import HabitDetail from "@/components/HabitDetail";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HabitDetailPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <HabitDetail />;
}
