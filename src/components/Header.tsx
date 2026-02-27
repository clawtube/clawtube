'use client';
import { useState } from 'react';
export default function Header() {
  const [activeTab, setActiveTab] = useState('for-you');
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
      <div className="relative flex items-center justify-center px-4 pt-12 pb-4">
        <nav className="flex items-center gap-8 pointer-events-auto">
          <button
            onClick={() => setActiveTab('following')}
            className={`text-base font-medium transition-all ${
              activeTab === 'following' 
                ? 'text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('for-you')}
            className={`text-base font-medium transition-all relative ${
              activeTab === 'for-you' 
                ? 'text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            For You
            {activeTab === 'for-you' && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
