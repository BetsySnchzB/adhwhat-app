import * as React from 'react';
'use client';

import { useState } from 'react';
import { supabase } from '@/libs/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

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
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h1>

      <form onSubmit={handleAuth} className="flex flex-col gap-3 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <button
          type="button"
          className="text-sm text-gray-500 underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need to create an account?' : 'Already have an account?'}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
    </main>
  );
}