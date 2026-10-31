import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminShell: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: 'Platform Analytics', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Manage Courses', path: '/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Manage Categories', path: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
    { label: 'Learner Accounts', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-surface-100 font-sans text-ink-900">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-ink-900 text-surface-200 border-r border-ink-800 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-accent-600 text-white flex items-center justify-center font-bold text-xs tracking-wider">
              CP
            </span>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight leading-none">CertiPro Admin</h2>
              <span className="text-[10px] text-accent-500 font-medium">Curriculum Operations</span>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 text-xs">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-medium transition-colors ${
                  active
                    ? 'bg-ink-800 text-white font-semibold'
                    : 'text-surface-300 hover:text-white hover:bg-ink-800/60'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-ink-800 text-xs">
          <Link
            to="/courses"
            className="flex items-center gap-2 px-3 py-2 text-surface-400 hover:text-white hover:bg-ink-800/50 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit to Learner View
          </Link>
          <div className="mt-2 px-3 py-1.5 bg-ink-800 rounded text-[11px] text-surface-400">
            Signed in: <span className="text-white font-medium">{user?.name}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

