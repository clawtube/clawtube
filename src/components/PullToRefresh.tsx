'use client';
import { useState, useRef, useCallback } from 'react';
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}
export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling) return;
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    const resistance = distance > 100 ? 100 + (distance - 100) * 0.3 : distance;
    setPullDistance(Math.min(resistance, 150));
  }, [pulling]);
  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;
    if (pullDistance > 80 && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    setPulling(false);
    setPullDistance(0);
  }, [pulling, pullDistance, refreshing, onRefresh]);
  return (
    <div className="relative h-full">
      <div 
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center transition-transform"
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          opacity: pullDistance > 20 ? 1 : 0,
          transition: pulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <div className="flex flex-col items-center pt-4">
          <div 
            className={`w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full transition-transform ${
              refreshing ? 'animate-spin' : ''
            }`}
            style={{ 
              transform: `rotate(${Math.min(pullDistance * 2, 360)}deg)`,
              borderWidth: '3px'
            }}
          />
          <span className="text-xs text-white/60 mt-2">
            {refreshing ? 'Refreshing...' : pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="h-full overflow-y-auto"
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pulling ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
