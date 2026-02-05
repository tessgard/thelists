import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listsAPI, itemsAPI } from "../api";

function Dashboard() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedListIds, setExpandedListIds] = useState([]);
  const [expandedListsData, setExpandedListsData] = useState({});
  const [newItemContents, setNewItemContents] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLists = async () => {
    try {
      const response = await listsAPI.getLists();
      const sortedLists = [...response.data].sort((a, b) => a.id - b.id);
      setLists(sortedLists);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleListExpansion = async (listId, e) => {
    e.stopPropagation();

    if (expandedListIds.includes(listId)) {
      setExpandedListIds(expandedListIds.filter((id) => id !== listId));
      const newData = { ...expandedListsData };
      delete newData[listId];
      setExpandedListsData(newData);
      const newContents = { ...newItemContents };
      delete newContents[listId];
      setNewItemContents(newContents);
    } else {
      try {
        const response = await listsAPI.getList(listId);
        setExpandedListIds([...expandedListIds, listId]);
        setExpandedListsData({
          ...expandedListsData,
          [listId]: response.data,
        });
      } catch (error) {
        console.error("Error fetching list details:", error);
      }
    }
  };

  const handleAddItem = async (e, listId) => {
    e.preventDefault();
    const content = newItemContents[listId] || "";
    if (!content.trim()) return;

    try {
      const listData = expandedListsData[listId];
      const response = await itemsAPI.createItem({
        list: parseInt(listId),
        content: content.trim(),
        order: listData.items.length,
      });
      setExpandedListsData({
        ...expandedListsData,
        [listId]: {
          ...listData,
          items: [...listData.items, response.data],
        },
      });
      setNewItemContents({
        ...newItemContents,
        [listId]: "",
      });

      // Update the item count in the lists array
      setLists(
        lists.map((list) =>
          list.id === listId
            ? { ...list, items_count: list.items_count + 1 }
            : list,
        ),
      );
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (itemId, listId) => {
    try {
      await itemsAPI.deleteItem(itemId);
      const listData = expandedListsData[listId];
      setExpandedListsData({
        ...expandedListsData,
        [listId]: {
          ...listData,
          items: listData.items.filter((item) => item.id !== itemId),
        },
      });

      // Update the item count in the lists array
      setLists(
        lists.map((list) =>
          list.id === listId
            ? { ...list, items_count: list.items_count - 1 }
            : list,
        ),
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleToggleCheck = async (itemId, listId) => {
    try {
      const response = await itemsAPI.toggleCheck(itemId);
      const listData = expandedListsData[listId];
      setExpandedListsData({
        ...expandedListsData,
        [listId]: {
          ...listData,
          items: listData.items.map((item) =>
            item.id === itemId ? response.data : item,
          ),
        },
      });
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  const handleDeleteList = async (listId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        await listsAPI.deleteList(listId);
        setLists(lists.filter((list) => list.id !== listId));
        setExpandedListIds(expandedListIds.filter((id) => id !== listId));
        const newData = { ...expandedListsData };
        delete newData[listId];
        setExpandedListsData(newData);
        const newContents = { ...newItemContents };
        delete newContents[listId];
        setNewItemContents(newContents);
      } catch (error) {
        console.error("Error deleting list:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="py-5">
      {lists.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No lists yet</p>
          <button
            className="px-5 py-2.5 bg-black text-white rounded-md text-sm cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => navigate("/new-list")}
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {lists.map((list) => {
            const isExpanded = expandedListIds.includes(list.id);
            const listData = expandedListsData[list.id];

            return (
              <div
                key={list.id}
                className="bg-white rounded-lg border border-gray-200 transition-all hover:shadow-sm"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2.5">
                    <h3
                      className="text-gray-800 text-lg font-medium m-0 flex-1 cursor-pointer"
                      onClick={(e) => toggleListExpansion(list.id, e)}
                    >
                      {list.name}
                    </h3>
                    <button
                      className="bg-transparent border-none text-xl text-gray-400 cursor-pointer p-0 w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-red-50 hover:text-red-700"
                      onClick={(e) => handleDeleteList(list.id, e)}
                      title="Delete list"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {isExpanded && listData && (
                  <div className="border-t border-gray-200 p-5">
                    {listData.items.length === 0 ? (
                      <div></div>
                    ) : (
                      <ul className="list-none pl-0 space-y-2 mb-4">
                        {listData.items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2">
                            {listData.has_checkboxes && (
                              <input
                                type="checkbox"
                                checked={item.is_checked}
                                onChange={() => handleToggleCheck(item.id, list.id)}
                                className="w-4 h-4 cursor-pointer circular-checkbox"
                              />
                            )}
                            <span
                              className={
                                item.is_checked
                                  ? "flex-1 text-sm line-through text-gray-400"
                                  : "flex-1 text-sm text-gray-800"
                              }
                            >
                              {item.content}
                            </span>
                            <button
                              className="bg-transparent border-none text-lg text-gray-400 cursor-pointer p-0 w-5 h-5 flex items-center justify-center rounded transition-all hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleDeleteItem(item.id, list.id)}
                              title="Delete item"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <form
                      onSubmit={(e) => handleAddItem(e, list.id)}
                      className="flex gap-2.5"
                    >
                      <input
                        type="text"
                        value={newItemContents[list.id] || ""}
                        onChange={(e) =>
                          setNewItemContents({
                            ...newItemContents,
                            [list.id]: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black text-white rounded-md text-sm cursor-pointer hover:bg-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
