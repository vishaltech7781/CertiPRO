import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  BookOpen,
  Award,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  LayoutDashboard,
  Compass,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded bg-ink-900 text-white flex items-center justify-center font-bold text-base tracking-wider font-sans">
                CP
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-ink-900 leading-none">
                  CertiPro
                </span>
                <span className="text-[10px] text-surface-400 uppercase tracking-wider font-medium mt-0.5">
                  Verified Learning
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <Link
                to="/courses"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/courses')
                    ? 'text-ink-900 bg-surface-100 font-semibold'
                    : 'text-ink-700 hover:text-ink-900 hover:bg-surface-50'
                }`}
              >
                Explore Courses
              </Link>
              <Link
                to="/courses?sort=popular"
                className="px-3 py-1.5 rounded-md text-ink-700 hover:text-ink-900 hover:bg-surface-50 transition-colors"
              >
                Trending
              </Link>
              <Link
                to="/certificate/verify/VRF-7D2F8A1E90"
                className="px-3 py-1.5 rounded-md text-ink-700 hover:text-ink-900 hover:bg-surface-50 transition-colors"
              >
                Verify Certificate
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search skills, topics, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-50 border border-surface-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-ink-900 placeholder:text-surface-400 focus:outline-none focus:border-ink-800 focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-surface-400 absolute left-2.5 top-2 pointer-events-none" />
            </form>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 hover:text-ink-900 px-2.5 py-1.5 rounded hover:bg-surface-100"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/my-learning"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 hover:text-ink-900 px-2.5 py-1.5 rounded hover:bg-surface-100"
                >
                  <BookOpen className="w-4 h-4" />
                  My Learning
                </Link>

                <Link
                  to="/certificates"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink-700 hover:text-ink-900 px-2.5 py-1.5 rounded hover:bg-surface-100"
                >
                  <Award className="w-4 h-4" />
                  Certificates
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent-700 bg-accent-50 border border-accent-200 px-2 py-1 rounded hover:bg-accent-100"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-8 h-8 rounded bg-ink-800 text-white font-medium text-xs flex items-center justify-center hover:bg-ink-700 focus:outline-none focus:ring-2 focus:ring-ink-600"
                    aria-label="User menu"
                  >
                    {getInitials(user.name)}
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-surface-200 py-1.5 z-50 text-xs"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-surface-100">
                        <p className="font-semibold text-ink-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-surface-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-ink-700 hover:bg-surface-50"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Dashboard
                      </Link>

                      <Link
                        to="/my-learning"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-ink-700 hover:bg-surface-50"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        My Learning
                      </Link>

                      <Link
                        to="/certificates"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-ink-700 hover:bg-surface-50"
                      >
                        <Award className="w-3.5 h-3.5" />
                        My Certificates
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-ink-700 hover:bg-surface-50"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        Profile
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-ink-700 hover:bg-surface-50"
                      >
                        Settings
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-accent-700 font-semibold hover:bg-accent-50 border-t border-surface-100"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Admin Portal
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 border-t border-surface-100 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded text-ink-700 hover:bg-surface-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search skills, topics, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-50 border border-surface-200 rounded-md pl-9 pr-3 py-2 text-xs text-ink-900"
            />
            <Search className="w-4 h-4 text-surface-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </form>

          <nav className="flex flex-col space-y-1 text-sm font-medium pt-2">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-ink-800 hover:bg-surface-100"
            >
              Explore Courses
            </Link>
            <Link
              to="/courses?sort=popular"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-ink-800 hover:bg-surface-100"
            >
              Trending Courses
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded text-ink-800 hover:bg-surface-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-learning"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded text-ink-800 hover:bg-surface-100"
                >
                  My Learning
                </Link>
                <Link
                  to="/certificates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded text-ink-800 hover:bg-surface-100"
                >
                  My Certificates
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded text-ink-800 hover:bg-surface-100"
                >
                  Profile & Settings
                </Link>
              </>
            )}
            <Link
              to="/certificate/verify/VRF-7D2F8A1E90"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-ink-800 hover:bg-surface-100"
            >
              Verify Certificate
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded text-accent-700 font-semibold hover:bg-accent-50"
              >
                Administrator Portal
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

