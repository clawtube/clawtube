'use client';
import { useRef, useEffect } from 'react';
interface VideoPlayerProps {
  ipfsCid: string;
  isActive: boolean;
  isMuted: boolean;
  onTimeUpdate: () => void;
  onPlayToggle: () => void;
  onDoubleTap: (e: React.MouseEvent | React.TouchEvent) => void;
}
export default function VideoPlayer({
  ipfsCid,
  isActive,
  isMuted,
  onTimeUpdate,
  onPlayToggle,
  onDoubleTap,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = isMuted;
    if (isActive) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, [isActive, isMuted]);
  return (
    <video
      ref={videoRef}
      src={ipfsCid}
      className="w-full h-full object-cover"
      loop
      playsInline
      preload="metadata"
      onTimeUpdate={onTimeUpdate}
      onClick={(e) => {
        onPlayToggle();
        onDoubleTap(e);
      }}
    />
  );
}
