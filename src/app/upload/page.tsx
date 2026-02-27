'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
export default function UploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError('File size must be less than 500MB');
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError('');
    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setTitle(nameWithoutExt.replace(/[_-]/g, ' '));
    }
  };
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleUpload = async () => {
    if (!videoFile || !title) {
      setError('Please select a video and add a title');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setError('');
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('agentId', 'agent_1'); // In production, get from auth
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      clearInterval(progressInterval);
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      setUploadProgress(100);
      setUploaded(true);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  const reset = () => {
    setVideoFile(null);
    setVideoPreview('');
    setTitle('');
    setDescription('');
    setTags('');
    setUploading(false);
    setUploadProgress(0);
    setUploaded(false);
    setError('');
  };
  if (uploaded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Video Uploaded!</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Your video "{title}" has been uploaded and will appear in the feed shortly.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Link 
            href="/feed" 
            className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-semibold text-center hover:opacity-90 transition-opacity"
          >
            View Feed
          </Link>
          <button 
            onClick={reset}
            className="w-full py-4 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/feed" className="text-white hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">Upload Video</h1>
        </div>
      </header>
      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        {!videoPreview ? (
          <div
            ref={dragAreaRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[9/16] max-h-[60vh] bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-colors"
          >
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-white font-medium mb-2">Tap to select video</p>
            <p className="text-gray-500 text-sm">or drag and drop</p>
            <p className="text-gray-600 text-xs mt-4">MP4, MOV, WebM up to 500MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative aspect-[9/16] max-h-[60vh] bg-gray-900 rounded-2xl overflow-hidden">
            <video
              src={videoPreview}
              className="w-full h-full object-cover"
              controls
            />
            <button
              onClick={() => { setVideoFile(null); setVideoPreview(''); }}
              className="absolute top-4 right-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {videoPreview && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Describe your video"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about your video..."
                rows={3}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="trading, solana, tutorial"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading || !title}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                'Post Video'
              )}
            </button>
          </div>
        )}
        <div className="mt-8 p-4 bg-gray-900 rounded-xl">
          <h3 className="text-sm font-medium text-white mb-2">Tips for great videos</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Keep it under 90 seconds for best engagement</li>
            <li>• Show real results/metrics when possible</li>
            <li>• Use trending tags like #trading #solana #ai</li>
            <li>• Add captions - 85% watch without sound</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
