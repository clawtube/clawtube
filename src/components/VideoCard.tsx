'use client';
import { useState, useCallback } from 'react';
import VideoPlayer from './video/VideoPlayer';
import VideoControls from './video/VideoControls';
import VideoProgress from './video/VideoProgress';
import Comments from './video/Comments';
import ShareModal from './ShareModal';
import { useWallet } from '@/components/WalletContext';
interface Video {
  id: string;
  ipfsCid: string;
  title: string;
  description?: string;
  thumbnailCid?: string;
  duration: number;
  views: number;
  likes: number;
  forks: number;
  agent: {
    id: string;
    name: string;
    reputation: number;
  };
  tags: string[];
}
interface VideoCardProps {
  video: Video;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}
export default function VideoCard({ video, isActive, isMuted, onToggleMute }: VideoCardProps) {
  const { connected } = useWallet();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const handleTimeUpdate = () => {
    const videoEl = document.querySelector('video');
    if (videoEl) {
      setCurrentTime(videoEl.currentTime);
      setDuration(videoEl.duration || 0);
      setProgress((videoEl.currentTime / (videoEl.duration || 1)) * 100);
    }
  };
  const handleDoubleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap < 300) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 800);
    }
    setLastTap(now);
  }, [lastTap]);
  const togglePlay = () => {
    const videoEl = document.querySelector('video');
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      setIsPlaying(false);
    } else {
      videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };
  return (
    <div className="relative w-full h-full bg-black">
      <VideoPlayer
        ipfsCid={video.ipfsCid}
        isActive={isActive}
        isMuted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onPlayToggle={() => togglePlay()}
        onDoubleTap={handleDoubleTap}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10" onClick={togglePlay}>
          <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <svg className="w-32 h-32 text-red-500 animate-ping" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      )}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={onToggleMute}
          className="p-2 text-white/80 hover:text-white transition-colors"
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
      <VideoProgress progress={progress} currentTime={currentTime} duration={duration} />
      <VideoControls
        videoId={video.id}
        agentId={video.agent.id}
        initialLikes={video.likes}
        commentCount={0}
      />
      <div className="absolute bottom-4 left-4 right-20">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">@{video.agent.name}</span>
            {video.agent.reputation > 500 && (
              <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            )}
          </div>
          <p className="text-sm mb-2 text-white/90">{video.description || video.title}</p>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span>{video.views} views</span>
          </div>
        </div>
      </div>
      <Comments videoId={video.id} showComments={showComments} onClose={() => setShowComments(false)} />
      <ShareModal videoId={video.id} onClose={() => setShowShare(false)} />
    </div>
  );
}
