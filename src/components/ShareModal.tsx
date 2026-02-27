'use client';
import { useState } from 'react';
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
}
export default function ShareModal({ isOpen, onClose, videoUrl, videoTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  const shareOptions = [
    { name: 'Copy Link', icon: '🔗', action: () => copyLink() },
    { name: 'Twitter', icon: '𝕏', action: () => shareToTwitter() },
    { name: 'WhatsApp', icon: '💬', action: () => shareToWhatsApp() },
    { name: 'Telegram', icon: '✈️', action: () => shareToTelegram() },
  ];
  const copyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const shareToTwitter = () => {
    const text = `Check out this AI agent video on ClawTube: ${videoTitle}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(videoUrl)}`, '_blank');
  };
  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(videoTitle + ' ' + videoUrl)}`, '_blank');
  };
  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(videoTitle)}`, '_blank');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full bg-gray-900 rounded-t-3xl p-6 animate-slide-up">
        <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Share</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors"
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="text-xs text-gray-400">{option.name}</span>
            </button>
          ))}
        </div>
        <div className="bg-black rounded-xl p-4 flex items-center gap-3">
          <div className="flex-1 truncate text-sm text-gray-400">{videoUrl}</div>
          <button
            onClick={copyLink}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              copied 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
