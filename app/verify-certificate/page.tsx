// app/verify-certificate/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Award,
  Calendar,
  User,
  Trophy,
  AlertTriangle,
  Copy,
  Check,
  Download,
  ExternalLink,
  Target,
  BarChart3,
  Medal,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { verifyCertificate } from '@/lib/actions/verify-certificate'
import { formatDate, formatDuration } from '@/lib/certificate-utils'

// Grade configuration with colors and icons
const gradeConfig = {
  'A+': {
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    label: 'Excellent',
  },
  A: {
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    label: 'Outstanding',
  },
  'B+': {
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/20',
    border: 'border-cyan-200 dark:border-cyan-800',
    label: 'Very Good',
  },
  B: {
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    label: 'Good',
  },
  C: {
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    label: 'Satisfactory',
  },
  D: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800',
    label: 'Needs Improvement',
  },
}

function VerificationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="w-full h-64 rounded-lg" />
      </CardContent>
    </Card>
  )
}

function CertificateNotFound() {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="pt-8 pb-8 text-center">
        <div className="p-3 rounded-full bg-destructive/10 w-fit mx-auto mb-4">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-destructive">
          Certificate Not Found
        </h3>
        <p className="text-muted-foreground">
          The certificate ID you entered is invalid or does not exist in our
          records.
        </p>
      </CardContent>
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
            <h3 className="font-medium text-destructive">Verification Error</h3>
            <p className="text-sm text-destructive/80 mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CertificateImage({
  url,
  courseName,
}: {
  url: string
  courseName: string
}) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const downloadCertificate = () => {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.download = `${courseName
      .replace(/\s+/g, '-')
      .toLowerCase()}-certificate.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openInNewTab = () => {
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Certificate Document
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={openInNewTab}
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Full
          </Button>
          <Button size="sm" onClick={downloadCertificate} className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <div className="relative border rounded-lg overflow-hidden bg-muted/30">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              Loading certificate...
            </div>
          </div>
        )}

        {imageError ? (
          <div className="p-8 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              Unable to preview certificate
            </p>
            <Button size="sm" onClick={downloadCertificate}>
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        ) : (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-64 md:h-96"
            title={`${courseName} Certificate`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false)
              setImageError(true)
            }}
          />
        )}
      </div>
    </div>
  )
}

// New Performance Card Component
function PerformanceCard({
  grade,
  percentage,
  totalMarks,
  receivedQuizMarks,
  totalQuizMarks,
  receivedAssignmentMarks,
  totalAssignmentMarks,
}: {
  grade: string
  percentage: number
  totalMarks: number
  receivedQuizMarks: number
  totalQuizMarks: number
  receivedAssignmentMarks: number
  totalAssignmentMarks: number
}) {
  const gradeInfo =
    gradeConfig[grade as keyof typeof gradeConfig] || gradeConfig['C']
  const quizPercentage =
    totalQuizMarks > 0 ? (receivedQuizMarks / totalQuizMarks) * 100 : 0
  const assignmentPercentage =
    totalAssignmentMarks > 0
      ? (receivedAssignmentMarks / totalAssignmentMarks) * 100
      : 0

  return (
    <Card className={`${gradeInfo.border} ${gradeInfo.bg}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Overview
          </span>
          <Badge
            className={`${gradeInfo.bg} ${gradeInfo.color} border-current text-center`}
          >
            <Medal className="h-3 w-3 mr-1" />
            Grade {grade}
          </Badge>
        </CardTitle>
        <CardDescription>{gradeInfo.label} Performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Overall Score</span>
            </div>
            <span className={`text-2xl font-bold ${gradeInfo.color}`}>
              {percentage}%
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
          <p className="text-xs text-muted-foreground text-right">
            {totalMarks} Total Marks
          </p>
        </div>

        {/* Quiz Performance */}
        {totalQuizMarks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quiz Performance</span>
              <span className="text-sm font-semibold">
                {receivedQuizMarks}/{totalQuizMarks}
              </span>
            </div>
            <Progress value={quizPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {quizPercentage.toFixed(1)}% accuracy
            </p>
          </div>
        )}

        {/* Assignment Performance */}
        {totalAssignmentMarks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Assignment Performance
              </span>
              <span className="text-sm font-semibold">
                {receivedAssignmentMarks}/{totalAssignmentMarks}
              </span>
            </div>
            <Progress value={assignmentPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {assignmentPercentage.toFixed(1)}% accuracy
            </p>
          </div>
        )}

        {/* Performance Indicator */}
        <div
          className={`p-3 rounded-lg ${gradeInfo.bg} border ${gradeInfo.border}`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 ${gradeInfo.color}`} />
            <span className={`text-sm font-medium ${gradeInfo.color}`}>
              {percentage >= 90
                ? 'Outstanding achievement!'
                : percentage >= 70
                ? 'Great performance!'
                : percentage >= 50
                ? 'Good effort!'
                : 'Keep learning!'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerifyCertificatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlCertificateId = searchParams.get('id') || ''
  const [certificateId, setCertificateId] = useState(urlCertificateId)
  const [searchId, setSearchId] = useState(urlCertificateId)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCertificateId(urlCertificateId)
    if (urlCertificateId) {
      setSearchId(urlCertificateId)
    } else {
      setSearchId('')
    }
  }, [urlCertificateId])

  const {
    data: verificationData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['verifyCertificate', searchId],
    queryFn: () => verifyCertificate(searchId),
    enabled: !!searchId,
    retry: 1,
  })

  const updateURL = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('id', id)
    } else {
      params.delete('id')
    }
    router.replace(`/verify-certificate?${params.toString()}`, {
      scroll: false,
    })
  }

  const handleSearch = () => {
    if (certificateId.trim()) {
      const trimmedId = certificateId.trim()
      setSearchId(trimmedId)
      updateURL(trimmedId)
    }
  }

  const clearSearch = () => {
    setCertificateId('')
    setSearchId('')
    setCopied(false)
    router.replace('/verify-certificate', { scroll: false })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const copyVerificationURL = async () => {
    const url = `${
      window.location.origin
    }/verify-certificate?id=${encodeURIComponent(searchId)}`
    await copyToClipboard(url)
  }

  const certificate = verificationData?.data

  return (
    <div className="min-h-screen bg-gradient-auth-light dark:bg-gradient-auth-dark">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-ninja-primary">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-ninja-primary bg-clip-text text-transparent">
              Certificate Verification
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verify the authenticity of certificates issued by Frontend Ninja
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Enter Certificate ID
            </CardTitle>
            <CardDescription>
              Enter the complete certificate ID to verify its authenticity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="e.g., JSN-MASTERING-JAVA-SCRIPT-BOOTCAMP-MGGUMGON-03B92231"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={handleSearch}
                disabled={!certificateId.trim() || isLoading}
                className="bg-gradient-ninja-primary hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-1" />
                    Verify
                  </>
                )}
              </Button>
              {searchId && (
                <Button variant="outline" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              The certificate ID is found at the bottom of your certificate
              document
            </p>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchId && (
          <div className="space-y-6">
            {isLoading ? (
              <VerificationSkeleton />
            ) : error ? (
              <ErrorMessage
                message={
                  error instanceof Error
                    ? error.message
                    : 'Failed to verify certificate'
                }
              />
            ) : !certificate ? (
              <CertificateNotFound />
            ) : (
              <>
                {/* Verified Header Card */}
                <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20 shadow-lg">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 animate-pulse-glow">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-green-800 dark:text-green-200 flex items-center gap-2 flex-wrap">
                          Certificate Verified Successfully
                          {certificate.isTopPerformer && (
                            <Badge className="bg-gradient-ninja-primary">
                              <Trophy className="h-3 w-3 mr-1" />
                              Top Performer
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-green-700 dark:text-green-300">
                          This certificate is authentic and was issued by
                          Frontend Ninja
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyVerificationURL}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        Share
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Performance Card - Shows first on mobile, last on desktop */}
                  <div className="lg:col-span-1 lg:order-2">
                    <PerformanceCard
                      grade={certificate.grade}
                      percentage={certificate.percentage}
                      totalMarks={certificate.totalMarks}
                      receivedQuizMarks={certificate.receivedQuizMarks}
                      totalQuizMarks={certificate.totalQuizMarks}
                      receivedAssignmentMarks={
                        certificate.receivedAssignmentMarks
                      }
                      totalAssignmentMarks={certificate.totalAssignmentMarks}
                    />
                  </div>

                  {/* Main Certificate Details - Shows second on mobile, first on desktop */}
                  <div className="lg:col-span-2 lg:order-1 space-y-6">
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-ninja-gold" />
                          Certificate Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Course Name
                            </p>
                            <p className="text-lg font-semibold">
                              {certificate.courseName}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Recipient
                            </p>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {certificate.recipientName}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Issue Date
                            </p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(certificate.issuedOn)}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Duration
                            </p>
                            <p className="text-lg font-semibold">
                              {formatDuration(certificate.duration)}
                            </p>
                          </div>
                        </div>

                        {/* Certificate ID */}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Certificate ID
                          </p>
                          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                            <code className="text-xs font-mono break-all flex-1">
                              {certificate.certificateId}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                copyToClipboard(certificate.certificateId)
                              }
                            >
                              {copied ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Skills */}
                        {certificate.skillsAchieved && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-3">
                              Skills Achieved
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {certificate.skillsAchieved
                                .split(',')
                                .map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-ninja-gold/10 border-ninja-gold/20"
                                  >
                                    {skill.trim()}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Certificate Image */}
                    {certificate.certificateUrl && (
                      <Card className="shadow-lg">
                        <CardContent className="pt-6">
                          <CertificateImage
                            url={certificate.certificateUrl}
                            courseName={certificate.courseName}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Verification Footer */}
                <Card className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 text-ninja-gold" />
                        <span>Verified by Javascript Ninja</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Verified on {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Help Section */}
        {!searchId && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-ninja-gold" />
                How to Verify Your Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/*
                  {
                    step: '1',
                    title: 'Get Certificate',
                    description: 'Download your certificate from the dashboard',
                  },
                  {
                    step: '2',
                    title: 'Find ID',
                    description: 'Locate the certificate ID at the bottom',
                  },
                  {
                    step: '3',
                    title: 'Verify',
                    description: 'Enter the ID above to verify authenticity',
                  },
                ].map((item) => (
                  <div key={item.step} className="text-center space-y-3">
                    <div className="p-4 rounded-full bg-gradient-ninja-primary w-fit mx-auto">
                      <span className="text-2xl font-bold text-white">
                        {item.step}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
                */}
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-medium">Get Certificate</h4>
                  <p className="text-sm text-muted-foreground">
                    Download your certificate from the dashboard
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <h4 className="font-medium">Find ID</h4>
                  <p className="text-sm text-muted-foreground">
                    Locate the certificate ID at the bottom
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <h4 className="font-medium">Verify</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the ID above to verify authenticity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
