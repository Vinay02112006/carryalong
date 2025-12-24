import { Link } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400">
            CarryAlong
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user && (
              <>
                <div className="text-sm">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ⭐ {user.rating.toFixed(1)} ({user.totalRatings})
                  </p>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
