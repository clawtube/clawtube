import { useState, useCallback } from 'react';
export function useVideoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  const loadMore = useCallback(async (cursor: string) => {
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/videos?cursor=${cursor}`);
      const data = await response.json();
      setVideos(prev => [...prev, ...data.videos]);
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoadingMore(false);
    }
  }, []);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data.videos);
    } catch (error) {
      console.error('Error refreshing:', error);
    }
  }, []);
  return { videos, loading, loadingMore, fetchVideos, loadMore, refresh };
}
