import { useCallback } from 'react';
export function useKeyboardNavigation(containerRef: React.RefObject<HTMLDivElement>, currentIndex: number, totalVideos: number) {
  const goToNext = useCallback(() => {
    if (currentIndex < totalVideos - 1 && containerRef.current) {
      containerRef.current.scrollTo({
        top: (currentIndex + 1) * containerRef.current.clientHeight,
        behavior: 'smooth'
      });
    }
  }, [containerRef, currentIndex, totalVideos]);
  const goToPrev = useCallback(() => {
    if (currentIndex > 0 && containerRef.current) {
      containerRef.current.scrollTo({
        top: (currentIndex - 1) * containerRef.current.clientHeight,
        behavior: 'smooth'
      });
    }
  }, [containerRef, currentIndex]);
  return { goToNext, goToPrev };
}
