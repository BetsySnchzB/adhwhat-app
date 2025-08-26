'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/libs/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(isLogin ? 'Logged in! 🎉' : 'Check your inbox to confirm!');
      
      // Redirect only on login success
      if (isLogin) {
        router.push('/dashboard');
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Fullscreen Hero Animation Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.95) contrast(1.1)',
          }}
        >
          <source src="/intro_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-white/10"></div>
      </div>

      {/* Centered Login Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/30 w-full max-w-sm sm:max-w-md mx-auto">
          {/* App Branding */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-2">
              A-D-H-WHAT?
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm font-medium px-2">
              Your creative mind, organized ✨
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 min-h-[44px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/90 min-h-[44px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-green-400 text-white text-lg sm:text-xl font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-h-[56px] touch-manipulation"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              type="button"
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors py-2 px-1 min-h-[44px] touch-manipulation"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm text-center ${
              message.includes('🎉') || message.includes('inbox') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 md:mt-8 text-center px-4">
          <p className="text-white/80 text-xs sm:text-sm font-medium drop-shadow-lg leading-relaxed">
            Organize tasks • Boost focus • Feel better every day
          </p>
        </div>
      </div>
    </main>
  );
}