import { redirect } from 'next/navigation';

export default function AdminPage() {
  // In a real application, you would check if the user is authenticated and has admin role
  // For now, we'll just redirect to the dashboard
  redirect('/admin/dashboard');
}