import React from 'react';
import { Button } from 'hero-ui';
import { useEffect, useState } from 'react';

export default function Header({ onLogout }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold text-white">Employee Dashboard</h1>
      <Button styleType="ghost" onClick={onLogout}>Logout</Button>
    </header>
  );
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.theme === 'dark' ||
    (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded shadow text-sm"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
