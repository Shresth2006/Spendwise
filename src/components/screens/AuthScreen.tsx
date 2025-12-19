import { useState } from 'react';
import { Mail, Smartphone, Chrome } from 'lucide-react';

interface AuthScreenProps {
  onComplete: () => void;
}

export default function AuthScreen({ onComplete }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="pt-16 pb-8 px-6">
        <h1 className="text-purple-900 text-3xl mb-2">
          {isLogin ? 'Welcome back' : 'Get started'}
        </h1>
        <p className="text-purple-600">
          {isLogin ? 'Sign in to continue' : 'Create your account'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-purple-900 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Phone Input */}
        <div className="space-y-2">
          <label className="text-purple-900 block">Phone (optional)</label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onComplete}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl mt-6 hover:shadow-lg transition-shadow"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-purple-200"></div>
          <span className="text-purple-400">or</span>
          <div className="flex-1 h-px bg-purple-200"></div>
        </div>

        {/* Google Sign-in */}
        <button className="w-full py-4 bg-white border-2 border-purple-100 rounded-2xl flex items-center justify-center gap-3 hover:border-purple-300 transition-colors">
          <Chrome className="w-5 h-5 text-purple-600" />
          <span className="text-purple-900">Continue with Google</span>
        </button>

        {/* Toggle Login/Signup */}
        <div className="text-center pt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 px-6 text-center text-purple-400">
        By continuing, you agree to our Terms & Privacy Policy
      </div>
    </div>
  );
}
