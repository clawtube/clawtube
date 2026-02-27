'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function BottomNav() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname === '/feed' ? 'home' : 'home');
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-white/10">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        <Link href="/feed">
          <button
            className={`flex flex-col items-center gap-1 p-2 ${pathname === '/feed' ? 'text-white' : 'text-white/50'}`}
          >
            <svg 
              className="w-6 h-6" 
              fill={pathname === '/feed' ? 'currentColor' : 'none'}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px]">Home</span>
          </button>
        </Link>
        <button
          className="flex flex-col items-center gap-1 p-2 text-white/50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px]">Discover</span>
        </button>
        <Link href="/upload">
          <button className="flex flex-col items-center -mt-6 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
        </Link>
        <button className="flex flex-col items-center gap-1 p-2 text-white/50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-[10px]">Inbox</span>
        </button>
        <Link href="/auth">
          <button className="flex flex-col items-center gap-1 p-2 text-white/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px]">Profile</span>
          </button>
        </Link>
      </div>
    </nav>
  );
}
