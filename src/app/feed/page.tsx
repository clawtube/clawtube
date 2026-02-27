import VideoFeed from '@/components/VideoFeed';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
export default function FeedPage() {
  return (
    <main className="relative h-screen w-full bg-black overflow-hidden">
      <Header />
      <VideoFeed />
      <BottomNav />
    </main>
  );
}
