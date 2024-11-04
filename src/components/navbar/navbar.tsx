"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image component
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks/redux";
import { doSignOut } from "../../firebase/auth";
import { listenToAuthChanges } from "@/lib/redux/features/auth/authSlice";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, LogOut } from "lucide-react"; // Removed Utensils
import "./navbar.css";

export default function Navbar() {
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  const handleSignOut = () => {
    doSignOut()
      .then(() => {
        console.log("User logged out successfully.");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        <div className="navbar-content">
          {/* Brand and Logo */}
          <Link href="/" className="brand">
            <Image
              src="/logo/meal.jpeg"
              alt="Meatmeal Logo"
              width={50} 
              height={50} 
              className="brand-icon"
            />
            <span className="brand-text">meatmeal</span>
          </Link>

          {/* Authentication Links */}
          <div className="auth-section">
            {isLoading ? (
              <span className="loading-text">Loading...</span>
            ) : isAuthenticated ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    className="dropdown-trigger"
                    aria-label="User menu"
                  ></button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" className="dropdown-content">
                  <DropdownMenu.Item className="dropdown-item">
                    <User className="dropdown-item-icon" aria-hidden="true" />
                    <span>{user?.displayName}</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={handleSignOut}
                    className="dropdown-item"
                  >
                    <LogOut className="dropdown-item-icon" aria-hidden="true" />
                    <span>Log out</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : (
              <div className="auth-links">
                <Link href="/auth/login" className="auth-link">
                  Login
                </Link>
                <Link href="/auth/signup" className="create-account-link">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
