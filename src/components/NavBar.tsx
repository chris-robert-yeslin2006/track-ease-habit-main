import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, BarChart2, Image } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useHabits } from "@/contexts/HabitsContext";
import { Progress } from "@/components/ui/progress";
import { format, subDays, addDays } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';

// Custom Tooltip component (keeping for backward compatibility)
const CustomTooltip = ({ content, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-sky-700 bg-black rounded-md shadow-sm whitespace-nowrap">
          {content}
          {/* Tooltip arrow pointing up */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Image Node Component
const ImageNode = ({ src, position, onMove, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState(position || { x: 50, y: 50 });
  const nodeRef = useRef(null);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!nodeRef.current || !nodeRef.current.contains(document.activeElement)) return;
      
      const step = e.shiftKey ? 10 : 5;
      let newPos = { ...pos };
      
      switch (e.key) {
        case 'ArrowUp':
          newPos.y = Math.max(0, newPos.y - step);
          break;
        case 'ArrowDown':
          newPos.y = Math.min(100, newPos.y + step);
          break;
        case 'ArrowLeft':
          newPos.x = Math.max(0, newPos.x - step);
          break;
        case 'ArrowRight':
          newPos.x = Math.min(100, newPos.x + step);
          break;
        case 'Delete':
        case 'Backspace':
          onRemove && onRemove();
          return;
        default:
          return;
      }
      
      setPos(newPos);
      onMove && onMove(newPos);
      e.preventDefault();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pos, onMove, onRemove]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.stopPropagation();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const parent = nodeRef.current.parentElement.getBoundingClientRect();
    const x = ((e.clientX - parent.left) / parent.width) * 100;
    const y = ((e.clientY - parent.top) / parent.height) * 100;
    
    const newPos = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    };
    
    setPos(newPos);
    onMove && onMove(newPos);
    e.stopPropagation();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={nodeRef}
      className={`absolute w-12 h-12 cursor-move ${isDragging ? 'z-50' : 'z-10'}`}
      style={{ 
        top: `${pos.y}%`, 
        left: `${pos.x}%`, 
        transform: 'translate(-50%, -50%)'
      }}
      tabIndex={0}
      onMouseDown={handleDragStart}
      role="button"
      aria-label="Movable image node"
    >
      <div className="relative group">
        <img 
          src={src} 
          alt="User uploaded" 
          className="w-12 h-12 object-cover rounded-full border-2 border-blue-500"
        />
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove image"
        >
          ×
        </button>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-70 whitespace-nowrap pointer-events-none">
          Use arrow keys to move
        </div>
      </div>
    </div>
  );
};

// Level Progress component
const LevelProgress = () => {
  const { habits } = useHabits();
  const today = new Date();
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  
  // Calculate level based on number of habits and completed logs
  const calculateLevel = () => {
    let totalCompleted = 0;
    habits.forEach(habit => {
      totalCompleted += habit.logs.filter(log => log.completed).length;
    });
    
    return Math.max(1, Math.floor(totalCompleted / 5) + 1); // Every 5 completed habits = 1 level
  };
  
  const calculateProgress = () => {
    let totalCompleted = 0;
    habits.forEach(habit => {
      totalCompleted += habit.logs.filter(log => log.completed).length;
    });
    
    const progressToNextLevel = (totalCompleted % 5) / 5 * 100;
    return progressToNextLevel;
  };
  
  const currentLevel = calculateLevel();
  const progressPercent = calculateProgress();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImages([...images, { 
        id: Date.now().toString(),
        src: event.target.result,
        position: { x: 50, y: 50 } // Default position (center)
      }]);
      toast.success('Image added! Use arrow keys or drag to position it');
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Reset file input
  };

  const handleImageMove = (id, newPosition) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, position: newPosition } : img
    ));
  };

  const handleImageRemove = (id) => {
    setImages(images.filter(img => img.id !== id));
    toast('Image removed');
  };

  // Generate timeline of habit completion
  const generateTimeline = () => {
    // Create array of dates (past 15 days, today, and next 15 days)
    const dates = [];
    for (let i = 15; i >= 1; i--) {
      dates.push(subDays(today, i));
    }
    dates.push(today); // Today
    for (let i = 1; i <= 15; i++) {
      dates.push(addDays(today, i));
    }

    // For each date, check if there are completed habits
    return (
      <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 relative">
        {dates.map((date, index) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          const isPast = date < today;
          
          // Count completed habits for this date
          let completedCount = 0;
          let habitNotes = [];
          habits.forEach(habit => {
            const log = habit.logs.find(log => log.date === dateStr);
            if (log) {
              if (log.completed) completedCount++;
              if (log.notes && log.notes.trim() !== '') {
                habitNotes.push({
                  habitName: habit.name,
                  notes: log.notes
                });
              }
            }
          });
          
          // Determine node style based on completion
          let nodeClass = "w-12 h-12 rounded-full flex items-center justify-center relative z-10";
          let lineClass = "absolute left-1/2 transform -translate-x-1/2 w-1 bg-muted z-0";
          
          if (isToday) {
            nodeClass += " bg-blue-500 text-white ring-2 ring-primary animate-pulse";
            lineClass += " h-8 -bottom-8";
          } else if (completedCount > 0) {
            nodeClass += " bg-green-500 text-white";
            lineClass += isPast ? " h-8 -bottom-8" : " h-8 -top-8";
          } else {
            nodeClass += " bg-muted text-muted-foreground";
            lineClass += isPast ? " h-8 -bottom-8" : " h-8 -top-8";
          }
          
          // Don't show the line for the last item
          const showLine = index !== dates.length - 1;
          
          const dateNode = (
            <div key={dateStr} className="relative flex flex-col items-center justify-center">
              <div className={nodeClass}>
                {isToday ? (
                  <div className="text-xs font-bold">TODAY</div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-xs">{format(date, 'MMM d')}</div>
                    {completedCount > 0 && (
                      <div className="text-xs font-bold">{completedCount}</div>
                    )}
                  </div>
                )}
              </div>
              {showLine && <div className={lineClass}></div>}
            </div>
          );
          
          // If there are notes for this day, wrap the date in a HoverCard
          if (habitNotes.length > 0) {
            return (
              <HoverCard key={dateStr} openDelay={300} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <div className="cursor-pointer">
                    {dateNode}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{format(date, 'MMMM d, yyyy')}</h4>
                    <div className="divide-y">
                      {habitNotes.map((item, i) => (
                        <div key={i} className="py-2">
                          <p className="font-medium text-sm">{item.habitName}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          }
          
          // If no notes, return the date node directly
          return dateNode;
        })}
        
        {/* Render all image nodes */}
        {images.map(img => (
          <ImageNode 
            key={img.id}
            src={img.src}
            position={img.position}
            onMove={(newPos) => handleImageMove(img.id, newPos)}
            onRemove={() => handleImageRemove(img.id)} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 relative">
      <h3 className="font-semibold text-xl text-center">Your Habit Journey</h3>
      
      <div className="text-center mb-4">
        <span className="text-2xl font-bold">Level {currentLevel}</span>
        <Progress value={progressPercent} className="h-2 mt-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {5 - (currentLevel * 5 - habits.reduce((acc, habit) => acc + habit.logs.filter(log => log.completed).length, 0))} 
          more completions until level {currentLevel + 1}
        </p>
      </div>
      
      <div className="w-full flex justify-center">
        <ScrollArea className="h-[50vh] w-full">
          {generateTimeline()}
        </ScrollArea>
      </div>
      
      {/* Image upload button */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-5 w-5" />
                <span className="sr-only">Upload Image</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Add an image to your timeline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="w-full border-b">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <h1
            onClick={() => navigate('/')}
            className="text-l font-bold tracking-tight cursor-pointer"
          >
            Habit Tracker
          </h1>
          
          {isAuthenticated && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <BarChart2 className="h-5 w-5" />
                  <span className="sr-only">View Stats</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-md md:max-w-2xl">
                <LevelProgress />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="ml-auto flex items-center space-x-4 min-w-0">
          {isAuthenticated ? (
            <>
              {user?.email && (
                <CustomTooltip content={user.email}>
                  <div className="max-w-[150px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </CustomTooltip>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => navigate('/create-habit')}
              >
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">Create Habit</span>
              </Button>
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="default" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
