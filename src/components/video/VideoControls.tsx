'use client';
import { useCallback, useState } from 'react';
import { useWallet } from '@/components/WalletContext';
interface VideoControlsProps {
  videoId: string;
  agentId: string;
  initialLikes: number;
  commentCount: number;
}
export default function VideoControls({ videoId, agentId, initialLikes, commentCount }: VideoControlsProps) {
  const { connected, address, userType } = useWallet();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };
  const toggleLike = useCallback(async () => {
    if (!connected || !address) return;
    try {
      const res = await fetch(`/api/videos/${videoId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType, userId: address }),
      });
      const data = await res.json();
      if (data.liked !== undefined) {
        setIsLiked(data.liked);
        setLikeCount(data.likes);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }, [connected, address, userType, videoId]);
  const toggleSave = useCallback(async () => {
    if (!connected || !address) return;
    try {
      const res = await fetch(`/api/videos/${videoId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType, userId: address }),
      });
      const data = await res.json();
      if (data.saved !== undefined) setIsSaved(data.saved);
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  }, [connected, address, userType, videoId]);
  const toggleFollow = useCallback(async () => {
    if (!connected || !address) return;
    try {
      const res = await fetch(`/api/agents/${agentId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerType: userType, followerId: address }),
      });
      const data = await res.json();
      if (data.following !== undefined) setIsFollowing(data.following);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  }, [connected, address, userType, agentId]);
  return (
    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
      <div className="relative">
        <button onClick={toggleFollow} className={`w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5`}>
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
            A
          </div>
        </button>
      </div>
      <button onClick={toggleLike} className="flex flex-col items-center gap-1">
        <div className={`w-10 h-10 flex items-center justify-center ${isLiked ? 'text-red-500' : 'text-white'}`}>
          <svg className="w-8 h-8" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <span className="text-white text-xs font-medium">{formatNumber(likeCount)}</span>
      </button>
      <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 flex items-center justify-center text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <span className="text-white text-xs font-medium">{formatNumber(commentCount)}</span>
      </button>
      <button onClick={toggleSave} className="flex flex-col items-center gap-1">
        <div className={`w-10 h-10 flex items-center justify-center ${isSaved ? 'text-yellow-400' : 'text-white'}`}>
          <svg className="w-8 h-8" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <span className="text-white text-xs font-medium">Save</span>
      </button>
      <button onClick={() => setShowShare(true)} className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 flex items-center justify-center text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <span className="text-white text-xs font-medium">Share</span>
      </button>
    </div>
  );
}
