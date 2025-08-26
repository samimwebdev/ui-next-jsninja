'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Download,
  Award,
  AlertTriangle,
  FileText,
  Calendar,
  Trophy,
  Target,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCertificates } from '@/lib/actions/get-certificates'
import {
  formatDuration,
  formatDate,
  parseSkills,
  calculateTotalScore,
  downloadCertificate,
} from '@/lib/certificate-utils'

function CertificateCardSkeleton() {
  return (
    <Card className="h-[420px]">
      <div className="h-1 bg-gradient-to-r from-primary/20 to-primary/40" />
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-7 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-12" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <h3 className="font-medium text-destructive">
              Error Loading Certificates
            </h3>
            <p className="text-sm text-destructive/80 mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="pt-16 pb-16 text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Complete courses and bootcamps to earn certificates.
        </p>
      </CardContent>
    </Card>
  )
}

export default function CertificatesPage() {
  const {
    data: certificatesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['certificates'],
    queryFn: fetchCertificates,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })

  const handleDownload = (url: string, courseName: string) => {
    try {
      downloadCertificate(url, courseName)
    } catch (error) {
      console.error('Error downloading certificate:', error)
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground mt-2">
            Your course completion certificates and achievements.
          </p>
        </div>
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : 'Failed to load certificates'
          }
        />
      </div>
    )
  }

  const certificates = certificatesData?.data || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Certificates</h1>
            <p className="text-muted-foreground">
              Your course completion certificates and achievements.
            </p>
          </div>
        </div>

        {/* Simple Stats */}
        {!isLoading && certificates.length > 0 && (
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{certificates.length} Certificates</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>
                {certificates.filter((c) => c.isTopPerformer).length} Top
                Performances
              </span>
            </div>
          </div>
        )}
      </div>

      {isLoading || !certificatesData ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <CertificateCardSkeleton key={i} />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3
        "
        >
          {certificates.map((cert) => {
            const skills = parseSkills(cert.skillsAchieved)
            const totalScore = calculateTotalScore(
              cert.receivedQuizMarks,
              cert.totalQuizMarks,
              cert.receivedAssignmentMarks,
              cert.totalAssignmentMarks
            )
            const duration = formatDuration(cert.duration)

            return (
              <Card
                key={cert.certificateId}
                className="hover:shadow-lg transition-shadow duration-200 h-[420px] flex flex-col"
              >
                {/* Accent bar */}
                <div
                  className={`h-1 ${
                    cert.isTopPerformer
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-primary'
                  }`}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <CardTitle className="text-lg leading-tight line-clamp-2">
                        {cert.courseName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                          {formatDate(cert.issuedOn)}
                        </span>
                      </CardDescription>
                    </div>
                    <div
                      className={`p-2 rounded-full shrink-0 ${
                        cert.isTopPerformer
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {cert.isTopPerformer ? (
                        <Trophy className="h-4 w-4" />
                      ) : (
                        <Award className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {cert.isTopPerformer && (
                    <Badge
                      variant="secondary"
                      className="w-fit bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs"
                    >
                      Top Performer
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Main Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Score
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          totalScore >= 90
                            ? 'text-green-600'
                            : totalScore >= 70
                            ? 'text-blue-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {totalScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Duration
                      </p>
                      <p className="text-xl font-bold">{duration}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Key Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs py-0 px-2 h-5"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certificate verification */}
                  <div className="pt-1">
                    <a
                      href={`https://${process.env.NEXT_PUBLIC_CLIENT_URL}/verify-certificate/${cert.certificateId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Verify Certificate
                    </a>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() =>
                      handleDownload(cert.certificateUrl, cert.courseName)
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
