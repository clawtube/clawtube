'use client';
export default function VideoSkeleton() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="relative w-full h-full md:w-[calc(100vh*9/16)] md:max-w-md md:h-full">
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
          style={{ 
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} 
        />
        <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
              <div className="w-8 h-3 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-20 left-4 right-20">
          <div className="w-32 h-4 bg-white/10 rounded animate-pulse mb-2" />
          <div className="w-48 h-3 bg-white/10 rounded animate-pulse mb-1" />
          <div className="w-64 h-3 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
