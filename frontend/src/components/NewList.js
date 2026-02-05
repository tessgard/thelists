import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listsAPI } from "../api";

function NewList() {
  const [name, setName] = useState("");
  const [hasCheckboxes, setHasCheckboxes] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a list name");
      return;
    }

    try {
      await listsAPI.createList({
        name: name.trim(),
        is_ordered: false,
        has_checkboxes: hasCheckboxes,
      });
      navigate("/");
    } catch (error) {
      setError("Failed to create list. Please try again.");
      console.error("Error creating list:", error);
    }
  };

  return (
    <div className="flex justify-center py-10 px-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-gray-800 font-medium mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-black"
            />
          </div>

          <div className="mb-5">
            <label className="flex items-center gap-2.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={hasCheckboxes}
                onChange={(e) => setHasCheckboxes(e.target.checked)}
                className="w-[18px] h-[18px] cursor-pointer circular-checkbox"
              />
              <span>Checkboxes</span>
            </label>
          </div>

          {error && <p className="text-red-700 my-2 text-sm">{error}</p>}

          <div className="flex gap-2.5 justify-end mt-8">
            <button
              type="button"
              className="px-5 py-2.5 bg-white text-black border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-black text-white rounded-md text-sm cursor-pointer hover:bg-gray-800 transition-colors"
            >
              Create List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewList;
