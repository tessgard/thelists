import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white px-8 pt-12 pb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">The Lists</h1>
        <button
          onClick={() => navigate("/new-list")}
          className="px-3 py-1 bg-black text-white border border-black rounded hover:bg-gray-800 transition-colors text-xl"
          title="Create new list"
        >
          +
        </button>
      </div>
    </header>
  );
}

export default Header;
