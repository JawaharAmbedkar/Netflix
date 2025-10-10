'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useUser } from '../context/UserContext'; // adjust path if needed

export default function ProfileSidebar() {
  const { name, setName } = useUser(); // use context instead of local session
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(name);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(name); // sync input with current name
  }, [name]);

  // Close dropdown if clicking outside
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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/signin');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setInputValue(name);
    setShowSavedMsg(false);
  };

  const handleSaveClick = async () => {
    const trimmedName = inputValue.trim() || 'New User';

    try {
      const res = await fetch('/api/update-name', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update name');

      // ✅ Update context instantly
      setName(trimmedName);
      setInputValue(trimmedName);
      setIsEditing(false);
      setShowSavedMsg(true);
    } catch (err) {
      console.error(err);
      alert('Failed to update name in database');
      setInputValue(name); // revert input to current context name
      setShowSavedMsg(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveClick();
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      <div className="ml-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <img
          className="rounded-lg"
          src="/profile/profilePic.jpg"
          width={50}
          height={50}
          alt="profile"
        />
      </div>

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
                type="button"
                className="text-sm text-green-400 mt-1"
                onClick={handleSaveClick}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="text-sm text-gray-400"
                onClick={handleEditClick}
              >
                Edit Name
              </button>
            )}
          </div>

          {showSavedMsg && (
            <div className="text-xs text-yellow-400 mt-1">
              Name updated! Log out and sign in again to see the permanent change.
            </div>
          )}

          <div className="text-m text-gray-400 mt-2">Netflix+ Member</div>
        </div>

        <div className="p-2 space-y-2">
          <button
            type="button"
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
