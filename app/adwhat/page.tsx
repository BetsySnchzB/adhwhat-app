import { redirect } from 'next/navigation'

export default function Page() {
  // Temporary shim: route moved from /adwhat to /adhwhat
  redirect('/adhwhat')
}
