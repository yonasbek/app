'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, User, ChevronDown, Menu, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { subActivityService } from '@/services/subactivityService';

interface TopBarProps {
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
}

const SEEN_NOTIFS_KEY = 'seenNotifications';

export default function TopBar({ onSidebarToggle, sidebarCollapsed }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: '', fullName: '', email: '', role: ''});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const fetchLockRef = useRef(false);
  const router = useRouter();

  // Load user info from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('userId') ?? '';
      const fullName = localStorage.getItem('fullName') ?? '';
      const email = localStorage.getItem('email') ?? '';
      const roleStr = localStorage.getItem('role') ?? '';
      
      // Handle role - can be string or object
      let roleName = '';
      if (roleStr) {
        try {
          const role = JSON.parse(roleStr);
          // If role is an object, extract the name property
          roleName = typeof role === 'object' && role !== null ? (role.name || '') : role;
        } catch {
          // If parsing fails, treat as string
          roleName = roleStr;
        }
      }
      
      setUserInfo({
        id,
        fullName: fullName ? JSON.parse(fullName) : '',
        email: email ? JSON.parse(email) : '',
        role: roleName,
      });
    }
  }, []);

  // Local seen notifications
  const loadSeenIds = (): string[] => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(SEEN_NOTIFS_KEY);
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const saveSeenIds = (ids: string[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SEEN_NOTIFS_KEY, JSON.stringify(ids));
  };

  const markNotificationSeenLocal = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    const seen = new Set(loadSeenIds());
    seen.add(id.toString());
    saveSeenIds(Array.from(seen));
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userInfo.id || fetchLockRef.current) return;
    fetchLockRef.current = true;
    if (!showNotifications) setLoadingNotifications(true);

    try {
      const rawNotifs = await subActivityService.getNotifications(userInfo.id);
      const seenIds = new Set(loadSeenIds());

      const formatted = rawNotifs
        .map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          created_at: n.created_at,
          read: n.is_read || seenIds.has(n.id.toString()),
          category: n.category
        }))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(formatted);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]);
    } finally {
      if (!showNotifications) setLoadingNotifications(false);
      fetchLockRef.current = false;
    }
  }, [userInfo.id, showNotifications]);

  useEffect(() => {
    if (userInfo.id) {
      fetchNotifications();
      const interval = window.setInterval(fetchNotifications, 60_000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [userInfo.id, fetchNotifications]);

  // Handle click
  const handleNotificationClick = async (notif: any) => {
    if (!notif.read) {
      markNotificationSeenLocal(notif.id);
      await subActivityService.markNotificationSeen(notif.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const timeAgo = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className={`fixed top-0 right-0 h-16 z-20 transition-all duration-300 ease-in-out left-0 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}`}>
      <div className="h-full bg-app-card border-b border-app-secondary px-4 sm:px-6 flex items-center justify-between shadow-sm">
        {/* Sidebar Toggle & Welcome */}
        <div className="flex items-center space-x-4">
          <button onClick={onSidebarToggle} className="lg:hidden p-2 rounded-lg hover:bg-app-accent transition-colors">
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-lg font-medium text-neutral-800">Welcome back!</h1>
            <p className="text-sm text-neutral-500">Manage your office operations efficiently</p>
          </div>
        </div>

        {/* Notifications & User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifications(prev => !prev)} className="p-2 rounded-lg hover:bg-app-accent transition-colors relative">
              <Bell className="w-5 h-5 text-neutral-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 bg-rose-600 rounded-full flex items-center justify-center text-xs text-white font-medium">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-app-card rounded-lg shadow-lg border border-app-secondary">
                <div className="p-4 border-b border-app-secondary flex items-center justify-between">
                  <h3 className="font-medium text-neutral-800">Notifications</h3>
                  <button className="text-xs text-neutral-500" onClick={() => { setNotifications([]); saveSeenIds([]); }}>Clear</button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {loadingNotifications && <div className="p-4 text-center text-sm text-neutral-500">Loading...</div>}
                  {!loadingNotifications && notifications.length === 0 && <div className="p-4 text-center text-sm text-neutral-500">No notifications</div>}
                  {!loadingNotifications && notifications.map(n => (
                    <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-4 border-b border-app-accent hover:bg-app-accent transition-colors cursor-pointer ${n.read ? 'opacity-60 line-through' : ''}`}>
                      <p className="text-sm font-medium text-neutral-800">{n.title}</p>
                      <p className="text-xs text-neutral-500 truncate">{n.message}</p>
                      <p className="text-xs text-neutral-400 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-app-secondary">
                  <button onClick={() => router.push('/')} className="text-sm text-neutral-600 hover:text-neutral-700 font-medium">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 sm:space-x-3 p-1.5 rounded-lg hover:bg-app-accent transition-colors">
              <div className="w-8 h-8 bg-app-foreground rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-neutral-800">{userInfo.fullName}</p>
                <p className="text-xs text-neutral-500">{userInfo.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-app-card rounded-lg shadow-lg border border-app-secondary">
                <div className="p-4 border-b border-app-secondary">
                  <p className="font-medium text-neutral-800">{userInfo.fullName}</p>
                  <p className="text-sm text-neutral-500">{userInfo.email}</p>
                </div>

                <button className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-app-accent hover:text-app-foreground transition-colors duration-200">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium text-sm text-neutral-600">Settings</span>
                </button>

                <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm text-neutral-600 hover:text-red-700">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
