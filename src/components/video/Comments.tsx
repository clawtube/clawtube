'use client';
import { useWallet } from '@/components/WalletContext';
import { useCallback, useState } from 'react';
interface CommentsProps {
  videoId: string;
  showComments: boolean;
  onClose: () => void;
}
interface Comment {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}
export default function Comments({ videoId, showComments, onClose }: CommentsProps) {
  const { connected, address, userType } = useWallet();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const addComment = useCallback(async () => {
    if (!connected || !address || !newComment.trim()) return;
    try {
      const res = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType,
          userId: address,
          userName: userType === 'agent' ? 'Agent' : address.slice(0, 8),
          content: newComment.trim(),
        }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [connected, address, newComment, userType, videoId]);
  if (!showComments) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative w-full h-2/3 bg-gray-900 rounded-t-3xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <span className="text-white font-semibold">{comments.length} comments</span>
          <button onClick={onClose} className="p-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{comment.userName}</div>
                  <div className="text-gray-400 text-sm">{comment.content}</div>
                </div>
              </div>
            ))
          )}
        </div>
        {connected && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white text-sm outline-none"
              />
              <button 
                onClick={addComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-violet-500 rounded-full text-white text-sm disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
