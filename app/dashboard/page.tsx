// filepath: c:\Users\User\Desktop\frontend-ninja\app\dashboard\page.tsx
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // Redirect to the default dashboard route
  redirect('/dashboard/courses')
}
