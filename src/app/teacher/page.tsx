import { redirect } from 'next/navigation';

export default function TeacherPage() {
  // Redirect to teacher dashboard
  redirect('/teacher/dashboard');
}
