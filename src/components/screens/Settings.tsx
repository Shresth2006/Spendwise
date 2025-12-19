import { ArrowLeft, User, Bell, Moon, Database, LogOut, ChevronRight, Wallet } from 'lucide-react';
import BottomNavigation from '../BottomNavigation';
import { useState } from 'react';
import { useDarkMode } from '../DarkModeProvider';

interface SettingsProps {
  userName: string;
  navigateTo: (screen: string) => void;
  onLogout: () => void;
}

export default function Settings({ userName, navigateTo, onLogout }: SettingsProps) {
  // Use the dark mode context instead of local state
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('home')} className="text-purple-600 dark:text-purple-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-purple-900 dark:text-white text-2xl">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl mb-1">{userName || 'User'}</h3>
              <p className="text-purple-100">user@example.com</p>
            </div>
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-2 border border-purple-100 dark:border-gray-700">
          <h3 className="text-purple-900 dark:text-white px-4 pt-3 pb-2">Account</h3>
          
          <button className="w-full flex items-center gap-4 p-4 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-2xl transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-purple-900 dark:text-white">Edit Name</p>
              <p className="text-purple-600 dark:text-purple-400">{userName || 'Update your display name'}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400 dark:text-gray-500" />
          </button>

          <button className="w-full flex items-center gap-4 p-4 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-2xl transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-purple-900 dark:text-white">Budget Preferences</p>
              <p className="text-purple-600 dark:text-purple-400">₹50,000 monthly budget</p>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400 dark:text-gray-500" />
          </button>
        </div>

        {/* Preferences */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-2 border border-purple-100 dark:border-gray-700">
          <h3 className="text-purple-900 dark:text-white px-4 pt-3 pb-2">Preferences</h3>
          
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-purple-900 dark:text-white">Notifications</p>
              <p className="text-purple-600 dark:text-purple-400">Budget alerts and reminders</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                notifications ? 'bg-purple-600 dark:bg-purple-500' : 'bg-purple-200 dark:bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications ? 'left-6' : 'left-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
              <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-purple-900 dark:text-white">Dark Mode</p>
              <p className="text-purple-600 dark:text-purple-400">Toggle app theme</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                darkMode ? 'bg-purple-600 dark:bg-purple-500' : 'bg-purple-200 dark:bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                darkMode ? 'left-6' : 'left-1'
              }`}></div>
            </button>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-2 border border-purple-100 dark:border-gray-700">
          <h3 className="text-purple-900 dark:text-white px-4 pt-3 pb-2">Data & Privacy</h3>
          
          <button className="w-full flex items-center gap-4 p-4 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-2xl transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-purple-900 dark:text-white">Data Sync Status</p>
              <p className="text-green-600 dark:text-green-400">Synced 2 minutes ago</p>
            </div>
            <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
          </button>
        </div>

        {/* App Info */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-purple-100 dark:border-gray-700">
          <div className="space-y-2 text-center">
            <p className="text-purple-600 dark:text-purple-400">SpendWise v1.0.0</p>
            <p className="text-purple-500 dark:text-gray-400">Built with care for smart spenders</p>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-4 flex items-center justify-center gap-3 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" onClick={onLogout}>
          <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-red-600 dark:text-red-400">Logout</span>
        </button>

        {/* Disclaimer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
          <p className="text-blue-900 dark:text-blue-300 mb-1">Privacy Notice</p>
          <p className="text-blue-700 dark:text-blue-400">
            SpendWise is designed for personal finance tracking. Please do not store sensitive PII or confidential data in this application.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation active="settings" onNavigate={navigateTo} />
    </div>
  );
}