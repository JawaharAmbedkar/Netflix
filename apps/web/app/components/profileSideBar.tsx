'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function ProfileSidebar() {
  const { data: session, update: refreshSession } = useSession();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('New User');
  const [inputValue, setInputValue] = useState('');

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync name with session
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
      setInputValue(session.user.name);
    }
  }, [session?.user?.name]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/signin');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setInputValue(name);
  };

  const handleSaveClick = async () => {
    const trimmedName = inputValue.trim() || "New User";

    // Optimistic update for instant UI feedback
    setName(trimmedName);
    setIsEditing(false);

    try {
      const res = await fetch("/api/update-name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update name");

      // Refresh session to update JWT with new name
      await refreshSession();
    } catch (err) {
      console.error(err);
      alert("Failed to update name in database");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveClick();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Profile Image */}
      <div className="ml-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <img
          className="rounded-lg"
          src="/profile/profilePic.jpg"
          width="50px"
          alt="profile"
        />
      </div>

      {/* Sidebar Dropdown */}
      <div
        className={`
          absolute right-0 mt-2 w-60 bg-black text-white rounded-lg shadow-lg transition-all duration-300 ease-out
          transform origin-top-right
          ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="font-semibold text-lg">
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-gray-800 px-2 py-1 rounded text-white w-full"
              />
            ) : (
              name
            )}
          </div>

          <div className="mt-1">
            {isEditing ? (
              <button
                className="text-sm text-green-400 mt-1"
                onClick={handleSaveClick}
              >
                Save
              </button>
            ) : (
              <button
                className="text-sm text-gray-400"
                onClick={handleEditClick}
              >
                Edit Name
              </button>
            )}
          </div>

          <div className="text-m text-gray-400 mt-2">Netflix+ Member</div>
        </div>

        <div className="p-2 space-y-2">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md text-red-400"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
