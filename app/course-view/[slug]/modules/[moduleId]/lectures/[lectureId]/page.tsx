'use client'
import dynamic from 'next/dynamic'

// Dynamically import the lecture page component with no SSR
const LecturePageClient = dynamic(() => import('./lecture-page-client'), {
  ssr: false,
  loading: () => (
    <div className="relative flex flex-col">
      <div className="h-64 bg-muted animate-pulse rounded-lg mb-4"></div>
      <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
    </div>
  ),
})

export default function LecturePage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string; lectureId: string }>
}) {
  return <LecturePageClient params={params} />
}
