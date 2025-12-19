import { Wallet } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-6 relative">
        <div className="w-24 h-24 bg-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center">
          <Wallet className="w-14 h-14 text-white" strokeWidth={1.5} />
        </div>
      </div>
      
      {/* App Name */}
      <h1 className="text-white text-4xl mb-2 tracking-tight">SpendWise</h1>
      
      {/* Tagline */}
      <p className="text-purple-100 text-center px-8">
        Smart spending, smarter savings
      </p>

      {/* Loading indicator */}
      <div className="mt-16 flex gap-2">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
