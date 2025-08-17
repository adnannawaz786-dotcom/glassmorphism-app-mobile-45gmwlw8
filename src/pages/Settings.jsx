import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Palette, 
  User, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Check
} from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('blue');

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedTheme = localStorage.getItem('theme') || 'blue';
    
    setDarkMode(savedDarkMode);
    setNotifications(savedNotifications);
    setSelectedTheme(savedTheme);
  }, []);

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleNotificationsToggle = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('notifications', newNotifications.toString());
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const themes = [
    { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500' },
    { id: 'purple', name: 'Purple Dream', color: 'bg-purple-500' },
    { id: 'pink', name: 'Rose Gold', color: 'bg-pink-500' },
    { id: 'green', name: 'Forest Green', color: 'bg-green-500' },
    { id: 'orange', name: 'Sunset Orange', color: 'bg-orange-500' }
  ];

  const SettingItem = ({ icon: Icon, title, subtitle, children, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 mb-3 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-white/10">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">{title}</h3>
            {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {children}
          <ChevronRight className="w-4 h-4 text-white/50" />
        </div>
      </div>
    </motion.div>
  );

  const Toggle = ({ checked, onChange }) => (
    <motion.div
      className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
        checked ? 'bg-blue-500' : 'bg-white/20'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      animate={{ backgroundColor: checked ? '#3b82f6' : 'rgba(255,255,255,0.2)' }}
    >
      <motion.div
        className="w-4 h-4 bg-white rounded-full"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 pt-8">
          <div className="p-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-white/70">Customize your experience</p>
          </div>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">User Profile</h2>
              <p className="text-white/70">Manage your account</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SettingItem
            icon={darkMode ? Moon : Sun}
            title="Dark Mode"
            subtitle={darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
            onClick={handleDarkModeToggle}
          >
            <Toggle checked={darkMode} onChange={handleDarkModeToggle} />
          </SettingItem>

          <SettingItem
            icon={Bell}
            title="Notifications"
            subtitle={notifications ? 'Push notifications enabled' : 'Push notifications disabled'}
            onClick={handleNotificationsToggle}
          >
            <Toggle checked={notifications} onChange={handleNotificationsToggle} />
          </SettingItem>

          <SettingItem
            icon={Palette}
            title="Theme"
            subtitle={`Current: ${themes.find(t => t.id === selectedTheme)?.name}`}
          >
            <div className={`w-4 h-4 rounded-full ${themes.find(t => t.id === selectedTheme)?.color}`} />
          </SettingItem>

          <SettingItem
            icon={Shield}
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
          />

          <SettingItem
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help and contact support"
          />
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 mb-6"
        >
          <h3 className="text-white font-semibold mb-4">Choose Theme</h3>
          <div className="grid grid-cols-5 gap-3">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleThemeChange(theme.id)}
                className="relative"
              >
                <div className={`w-12 h-12 rounded-full ${theme.color} flex items-center justify-center`}>
                  {selectedTheme === theme.id && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </div>
                <p className="text-xs text-white/70 mt-1 text-center">{theme.name.split(' ')[0]}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-center"
        >
          <p className="text-white/70 text-sm mb-2">Glassmorphism Todo App</p>
          <p className="text-white/50 text-xs">Version 1.0.0</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;