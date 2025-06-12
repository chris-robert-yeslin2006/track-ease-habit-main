
import CreateHabitForm from "@/components/CreateHabitForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateHabitPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <CreateHabitForm />;
}
