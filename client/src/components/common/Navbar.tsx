'use client';

import { useAuth } from '@/contexts/AuthContext';
import { FaBarcode, FaBars, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  onOpenScanner: () => void;
}

export function Navbar({ onOpenScanner }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold truncate">
          Inventory Management
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
            {user?.email}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onOpenScanner}
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative group"
              aria-label="Open barcode scanner (Press 'B')"
            >
              <FaBarcode className="w-5 h-5 relative z-10" />
              <span className="animate-ping absolute top-0 right-0 inline-flex h-4 w-4 rounded-full bg-sky-400 opacity-75"></span>
            </button>
    
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
              aria-label="Logout"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {user?.email}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onOpenScanner();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaBarcode className="w-5 h-5" />
                <span>Scanner</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}