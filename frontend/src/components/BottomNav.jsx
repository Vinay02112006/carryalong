import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Plane, MessageSquare, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/parcels', icon: Package, label: 'Parcels' },
    { path: '/travel', icon: Plane, label: 'Travel' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-3 px-3 transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
