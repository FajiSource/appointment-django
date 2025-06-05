import React from 'react'
import SideNav from './SideNav'
import { useAuth } from '../context/AuthContext'

export default function Format({ children }) {
  const { user, logOut } = useAuth();  // Get user from AuthContext

  return (
    <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <SideNav />

        {/* Main Layout */}
        <div className="flex flex-col flex-1">
        <header className="bg-blue-500 text-white p-4 font-bold flex items-center justify-between gap-4 flex-none">
            <div className="flex items-center justify-center flex-none">
                <img src="src/resources/Logo.png" alt="Logo" width="50" height="50" className="object-contain" />
                <span>Appointment and Analytics Management System</span>
            </div>
               
            <button className="p-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-red-500 hover:text-white" 
            onClick={logOut}>Logout
            </button>
        </header>

        {/* Main Content */}
        <div className="flex flex-1">
            <main className="flex-1 p-5 bg-white">
                {children}
            </main>
        </div>

        {/* Footer */}
        <footer className="bg-blue-500 text-white p-4 text-center flex-none">
            {user ? `Welcome ${user.usertype} ${user.username}!` : 'Welcome, guest!'}
        </footer>
    </div>
  </div>
  )
}
