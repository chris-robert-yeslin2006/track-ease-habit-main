
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/habits" />;
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Gamepad2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Habit Tracker</CardTitle>
          <CardDescription className="text-lg mt-2">
            Track your daily habits and build consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-center text-muted-foreground">
            Build better habits and improve your life one day at a time. 
            Log in or create an account to get started.
          </p>
          <div className="flex flex-col space-y-3">
            <Button 
              size="lg" 
              className="w-full" 
              asChild
            >
              <a href="/login">Login</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full" 
              asChild
            >
              <a href="/register">Register</a>
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Keep moving. You can!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
