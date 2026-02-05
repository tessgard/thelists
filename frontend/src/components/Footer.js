import React from "react";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <footer className="bg-white px-8 py-4 mt-auto">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-sm text-gray-600">Logged in as {user.username}</span>
        <button
          onClick={logout}
          className="px-4 py-2 bg-black text-white border border-black rounded hover:bg-gray-800 transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    </footer>
  );
}

export default Footer;
