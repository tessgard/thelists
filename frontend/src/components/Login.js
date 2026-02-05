import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    const result = await login(username.trim());
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-10 rounded-lg border border-gray-200 w-full max-w-md text-center">
        <h1 className="text-black text-3xl font-bold mb-3">The Lists</h1>
        <p className="text-gray-600 mb-8">Make lists</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-black"
          />
          {error && <p className="text-red-700 my-2 text-sm">{error}</p>}
          <button
            type="submit"
            className="px-3 py-3 bg-black text-white rounded-md text-base cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
