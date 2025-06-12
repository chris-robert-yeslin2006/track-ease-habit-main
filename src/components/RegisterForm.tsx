import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set the form to visible after component mounts for entrance animation
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password);
      toast({
        title: "Success",
        description: "Account created successfully.track your habits and level-up",
      });
      
      // Animate out before navigation
      setIsVisible(false);
      setTimeout(() => navigate('/login'), 300);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15 
      } 
    },
    hover: { 
      rotate: [0, 15, -15, 0], 
      transition: { duration: 0.5 } 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "exit"}
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <motion.div 
              className="flex justify-center mb-4"
              variants={logoVariants}
              whileHover="hover"
            >
              <Gamepad2 className="h-12 w-12 text-primary" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl text-center">Register</CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-center">
                Create an account to track your habits
              </CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
              >
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:scale-[1.01]"
                />
              </motion.div>
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
              >
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:scale-[1.01]"
                />
              </motion.div>
              <motion.div 
                className="space-y-2"
                variants={itemVariants}
              >
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:scale-[1.01]"
                />
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <motion.div 
                variants={itemVariants}
                className="w-full"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ 
                        rotate: 360 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1, 
                        ease: "linear" 
                      }}
                      className="mr-2"
                    >
                      <Loader2 className="h-4 w-4" />
                    </motion.div>
                  ) : null}
                  <span>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </span>
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 bg-white bg-opacity-30"
                    initial={{ width: "0%" }}
                    animate={isLoading ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 2 }}
                  />
                </Button>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="text-center text-sm"
              >
                Already have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal transition-all duration-300 hover:text-primary hover:underline" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}