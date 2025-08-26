'use client';

import { useUser } from '@/libs/UserContext';
import { supabase } from '@/libs/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ButtonAccount() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (!user) return null;

  return (
    <div className="flex items-center justify-between gap-4 p-4 border rounded-lg shadow-md">
      <p className="text-sm text-gray-600">Logged in as <strong>{user.email}</strong></p>
      <button
        onClick={handleLogout}
        className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}