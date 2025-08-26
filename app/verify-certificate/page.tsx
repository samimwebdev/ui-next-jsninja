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
import { verifyCertificate } from '@/lib/actions/verify-certificate'
import {
  calculateTotalScore,
  formatDate,
  formatDuration,
} from '@/lib/certificate-utils'

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
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        {/* Certificate image skeleton */}
        <div className="mt-6">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="w-full h-64 rounded-lg" />
        </div>
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
  onImageLoad,
}: {
  url: string
  courseName: string
  onImageLoad?: () => void
}) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoading(false)
    onImageLoad?.()
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

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
              Unable to preview certificate image
            </p>
            <Button size="sm" onClick={downloadCertificate}>
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        ) : (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-64 md:h-80"
            title={`${courseName} Certificate`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>
    </div>
  )
}

export default function VerifyCertificatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get certificate ID from URL params
  const urlCertificateId = searchParams.get('id') || ''

  const [certificateId, setCertificateId] = useState(urlCertificateId)
  const [searchId, setSearchId] = useState(urlCertificateId)
  const [copied, setCopied] = useState(false)

  // Update search when URL changes
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
    // Clear states first
    setCertificateId('')
    setSearchId('')
    setCopied(false)

    // Then update URL
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
  let totalScore = 0
  if (certificate) {
    totalScore = calculateTotalScore(
      certificate?.receivedQuizMarks,
      certificate?.totalQuizMarks,
      certificate?.receivedAssignmentMarks,
      certificate?.totalAssignmentMarks
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Certificate Verification</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verify the authenticity of certificates issued by Frontend Ninja.
            Enter the certificate ID to check its validity and view details.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
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
                placeholder="e.g., mastering-java-script-bootcamp-nt4la7mwgacnoplkww7xpzar-d2a0e093..."
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={!certificateId.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
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
              The certificate ID is a long unique identifier found on your
              certificate document.
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
              /* Verified Certificate */
              <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-green-800 dark:text-green-200 flex items-center gap-2">
                        Certificate Verified ✓
                        {certificate.isTopPerformer && (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/50 dark:text-orange-300">
                            <Trophy className="h-3 w-3 mr-1" />
                            Top Performer
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-green-700 dark:text-green-300">
                        This certificate is authentic and was issued by Frontend
                        Ninja
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

                <CardContent className="space-y-6">
                  {/* Certificate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Duration
                        </p>
                        <p className="text-lg font-semibold">
                          {formatDuration(certificate.duration)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Final Score
                        </p>
                        <p
                          className={`text-lg font-bold ${
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
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Certificate ID
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all flex-1">
                            {certificate.certificateId}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
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
                    </div>
                  </div>

                  {/* Certificate Image */}
                  {certificate.certificateUrl && (
                    <CertificateImage
                      url={certificate.certificateUrl}
                      courseName={certificate.courseName}
                    />
                  )}

                  {/* Skills Section */}
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
                              className="text-xs"
                            >
                              {skill.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Verification Footer */}
                  <div className="pt-4 border-t border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Verified by Frontend Ninja</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Verified on {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help Section */}
        {!searchId && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                How to Find Your Certificate ID
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-medium">Download Certificate</h4>
                  <p className="text-sm text-muted-foreground">
                    Access your certificates from the dashboard
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <h4 className="font-medium">Locate Certificate ID</h4>
                  <p className="text-sm text-muted-foreground">
                    Find the unique ID at the bottom of your certificate
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <h4 className="font-medium">Verify Here</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the complete ID in the search box above
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
