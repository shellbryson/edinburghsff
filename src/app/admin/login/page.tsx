import { redirect } from 'next/navigation'

// Login moved to /login to avoid the admin layout auth guard
export default function AdminLoginRedirect() {
  redirect('/login')
}
