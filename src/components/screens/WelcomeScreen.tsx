import { useState } from 'react';
import { User } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center px-6">
      {/* Avatar Preview */}
      <div className="mb-8">
        <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
          <User className="w-16 h-16 text-white" strokeWidth={1.5} />
        </div>
      </div>

      {/* Question */}
      <h1 className="text-purple-900 text-3xl mb-2 text-center">
        What should we call you?
      </h1>
      <p className="text-purple-600 mb-8 text-center">
        Let's personalize your experience
      </p>

      {/* Name Input */}
      <div className="w-full max-w-sm mb-8">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
          className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none transition-colors text-center text-purple-900"
          autoFocus
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!name.trim()}
        className="w-full max-w-sm py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
      >
        Continue
      </button>

      {/* Progress Indicator */}
      <div className="mt-12 flex gap-2">
        <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
        <div className="w-8 h-1.5 bg-purple-200 rounded-full"></div>
        <div className="w-8 h-1.5 bg-purple-200 rounded-full"></div>
      </div>
      <p className="text-purple-400 mt-3">Step 1 of 3</p>
    </div>
  );
}
