'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useVideoFeed } from '@/hooks/useVideoFeed';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import VideoCard from './VideoCard';
import VideoSkeleton from './VideoSkeleton';
import PullToRefresh from './PullToRefresh';
import KeyboardShortcuts from './KeyboardShortcuts';
interface Video {
  id: string;
  ipfsCid: string;
  title: string;
  description?: string;
  thumbnailCid?: string;
  duration: number;
  agent: {
    id: string;
    name: string;
    reputation: number;
  };
  views: number;
  likes: number;
  forks: number;
  tags: string[];
}
export default function VideoFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [globalMuted, setGlobalMuted] = useState(true);
  const { videos, loading, loadingMore, fetchVideos, loadMore, refresh } = useVideoFeed();
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);
  const { goToNext, goToPrev } = useKeyboardNavigation(containerRef, currentIndex, videos.length);
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    const newIndex = Math.round(scrollTop / viewportHeight);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentIndex(newIndex);
    }
    const scrollBottom = scrollTop + viewportHeight;
    const threshold = scrollHeight - viewportHeight * 2;
    if (scrollBottom > threshold && !loadingMore && videos.length > 0) {
      loadMore(videos[videos.length - 1].id);
    }
  }, [currentIndex, videos.length loadingMore, loadMore, videos]);
  const toggleGlobalMute = useCallback(() => {
    setGlobalMuted(prev => {
      const newState = !prev;
      document.querySelectorAll('video').forEach((video) => {
        (video as HTMLVideoElement).muted = newState;
      });
      return newState;
    });
  }, []);
  const togglePlayCurrent = useCallback(() => {
    const videoElements = document.querySelectorAll('video');
    const currentVideo = videoElements[currentIndex] as HTMLVideoElement;
    if (currentVideo) {
      if (currentVideo.paused) {
        currentVideo.play();
      } else {
        currentVideo.pause();
      }
    }
  }, [currentIndex]);
  const likeCurrent = useCallback(() => {
    window.dispatchEvent(new CustomEvent('likeVideo', { detail: { index: currentIndex } }));
  }, [currentIndex]);
  if (loading) {
    return <VideoSkeleton />;
  }
  return (
    <>
      <KeyboardShortcuts
        onToggleMute={toggleGlobalMute}
        onTogglePlay={togglePlayCurrent}
        onLike={likeCurrent}
        onNext={goToNext}
        onPrev={goToPrev}
      />
      <PullToRefresh onRefresh={async () => {
        const response = await fetch('/api/videos');
        const data = await response.json();
        setVideos(data.videos);
      }}>
        <div 
          ref={containerRef}
          className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black"
          style={{ 
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
          onScroll={handleScroll}
        >
          {videos.map((video, index) => (
            <div 
              key={video.id}
              className="w-full h-screen snap-start snap-always flex items-center justify-center bg-black"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative h-full w-full md:h-[90vh] md:w-auto md:aspect-[9/16] md:max-w-[calc(90vh*9/16)] bg-black">
                <VideoCard 
                  video={video} 
                  isActive={index === currentIndex}
                  isMuted={globalMuted}
                  onToggleMute={toggleGlobalMute}
                />
              </div>
            </div>
          ))}
          {loadingMore && (
            <div className="w-full h-screen flex items-center justify-center bg-black">
              <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"/>
            </div>
          )}
        </div>
      </PullToRefresh>
    </>
  );
}
