'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function ProfileSidebar() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('New User'); // Default name
  const [inputValue, setInputValue] = useState(name);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

 const handleLogout = async () => {
  console.log("Logging out...");
  await signOut({ redirect: false });  // Sign out but don’t redirect automatically
  router.push('/signin');               // Redirect manually to sign in page
};

  const handleEditClick = () => {
    setIsEditing(true);
    setInputValue(name);
  };

  const handleSaveClick = () => {
    setName(inputValue.trim() || 'New User');
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    }
  };

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

      {/* Sidebar Dropdown with Transition */}
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
              <button className="text-sm text-gray-400" onClick={handleEditClick}>
                Edit Name
              </button>
            )}
          </div>

          <div className="text-m text-gray-400 mt-2">Netflix+ Member</div>
        </div>

        <div className="p-2 space-y-2">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md text-red-400"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
