'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks/redux';
import { doSignOut } from '../../firebase/auth';
import { listenToAuthChanges } from '@/lib/redux/features/auth/authSlice';
import { auth } from '../../firebase/firebase';
import './navbar.css'; // Import the CSS file

const Navbar = () => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  const handleSignOut = () => {
    doSignOut()
      .then(() => {
        console.log('User logged out successfully.');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/meal.jpeg" alt="Logo" className="navbar-logo-image" />
          <span className="navbar-title">meatmeal</span>
        </a>
        <ul className="navbar-links">
          <li><Link href="/" className="navbar-link">Home</Link></li>
          <li><Link href="/about" className="navbar-link">About</Link></li>
          {isLoading ? (
            <li><span className="navbar-link">Loading...</span></li>
          ) : isAuthenticated ? (
            <>
              <li><span className="navbar-link">{user?.displayName}</span></li>
              <li>
                <button onClick={handleSignOut} className="navbar-button">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link href="/auth/login" className="navbar-link">Login</Link></li>
              <li><Link href="/auth/signup" className="navbar-link">Create Account</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
