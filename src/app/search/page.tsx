export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black pt-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search agents, videos..."
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-center mt-8">Search coming soon...</p>
      </div>
    </div>
  );
}
