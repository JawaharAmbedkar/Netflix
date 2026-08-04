'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useUser } from '../context/UserContext';

export default function ProfileSidebar() {
  const { name, setName } = useUser();
  const { update: updateSession } = useSession();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(name);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(name);
  }, [name]);

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
    setError('');
  };

  const handleSaveClick = async () => {
    const trimmedName = inputValue.trim();
    if (!trimmedName) {
      setError('Please enter a name.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      const res = await fetch('/api/update-name', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update name');

      setName(data.name);
      setInputValue(data.name);
      await updateSession();
      setIsEditing(false);
      setShowSavedMsg(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to update name.');
      setShowSavedMsg(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveClick();
    if (e.key === 'Escape') {
      setInputValue(name);
      setIsEditing(false);
      setError('');
    }
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Open profile menu"
        className="ml-1 h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-white/[0.08] transition-all duration-300 hover:border-gold/30 hover:shadow-glow"
      >
        <img
          className="block h-full w-full object-cover"
          src="/profile/profilePic.jpg"
          width={40}
          height={40}
          alt="Profile"
        />
      </button>

      <div
        className={`
          absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl glass-strong shadow-card transition-all duration-300 ease-out
          ${open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}
        `}
      >
        <div className="border-b border-white/[0.06] p-4">
          <div className="font-semibold text-lg text-white">
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-white focus:border-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />
            ) : (
              name
            )}
          </div>

          <div className="mt-2">
            {isEditing ? (
              <button
                type="button"
                className="text-sm font-medium text-gold transition hover:text-gold-light"
                onClick={handleSaveClick}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save changes'}
              </button>
            ) : (
              <button
                type="button"
                className="text-sm text-warm-400 transition hover:text-warm-200"
                onClick={handleEditClick}
              >
                Edit name
              </button>
            )}
          </div>

          {showSavedMsg && <div className="mt-2 text-xs text-gold-light">Name updated</div>}
          {error && <div className="mt-2 text-xs text-red-400">{error}</div>}

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-light">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-soft" />
            Premium Member
          </div>
        </div>

        <div className="p-2">
          <button
            type="button"
            className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
