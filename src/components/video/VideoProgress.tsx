'use client';
interface VideoProgressProps {
  progress: number;
  currentTime: number;
  duration: number;
}
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
export default function VideoProgress({ progress, currentTime, duration }: VideoProgressProps) {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-30">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-white/70">
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    </>
  );
}
