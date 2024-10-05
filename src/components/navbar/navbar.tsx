'use client'; 
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';
import { doSignOut } from '../../firebase/auth';
import { listenToAuthChanges } from '@/lib/redux/features/auth/authSlice';

const Navbar = () => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(listenToAuthChanges());
    
    // Ensure dropdown is closed after login
    setDropdownOpen(false);
  }, [dispatch, isAuthenticated]);

  const handleSignOut = () => {
    doSignOut()
      .then(() => {
        console.log('User logged out successfully.');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/meal.jpeg" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            meatmeal
          </span>
        </a>
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <span className="text-gray-900 dark:text-white">Loading...</span>
          ) : isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="relative flex text-sm rounded-full focus:outline-none"
                style={{ padding: '0', margin: '0', backgroundColor: 'transparent', border: 'none' }}
              >
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src="/userpfp.jpg"
                  alt="User Icon"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link href="/auth/login" className="text-m font-medium text-gray-900 dark:text-white">
                Login
              </Link>
              <Link href="/auth/signup" className="text-m font-medium text-gray-900 dark:text-white">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
