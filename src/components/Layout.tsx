
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { HabitsProvider } from '@/contexts/HabitsContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HabitsProvider>
          <div className="min-h-screen bg-background">
            <NavBar />
            <main className="container py-6 px-4 sm:px-6">
              <Outlet />
            </main>
          </div>
        </HabitsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
