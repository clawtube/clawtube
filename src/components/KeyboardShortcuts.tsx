'use client';
import { useEffect, useCallback } from 'react';
interface KeyboardShortcutsProps {
  onToggleMute: () => void;
  onTogglePlay: () => void;
  onLike: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleComments: () => void;
}
export default function KeyboardShortcuts({
  onToggleMute,
  onTogglePlay,
  onLike,
  onNext,
  onPrev,
  onToggleComments,
}: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        onTogglePlay();
        break;
      case 'ArrowUp':
        e.preventDefault();
        onPrev();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onNext();
        break;
      case 'm':
        onToggleMute();
        break;
      case 'l':
        onLike();
        break;
      case 'c':
        onToggleComments();
        break;
      case 'Home':
        e.preventDefault();
        onPrev();
        break;
      case 'End':
        e.preventDefault();
        onNext();
        break;
    }
  }, [onToggleMute, onTogglePlay, onLike, onNext, onPrev, onToggleComments]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  return (
    <div className="hidden">
    </div>
  );
}
