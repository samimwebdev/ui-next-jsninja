"use client"

import { Download, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data
const certificates = [
  {
    id: "1",
    course: "React Masterclass",
    issueDate: "2024-02-20",
    grade: "A",
    score: 95,
    instructor: "John Doe",
    duration: "12 weeks",
    skills: ["React", "Redux", "Next.js"],
    downloadUrl: "/certificates/react-masterclass.pdf",
  },
  {
    id: "2",
    course: "Node.js Advanced",
    issueDate: "2024-01-15",
    grade: "A+",
    score: 98,
    instructor: "Jane Smith",
    duration: "10 weeks",
    skills: ["Node.js", "Express", "MongoDB"],
    downloadUrl: "/certificates/nodejs-advanced.pdf",
  },
]

export default function CertificatesPage() {
  const handleDownload = (url: string) => {
    // In a real application, this would trigger the certificate download
    console.log("Downloading certificate:", url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Certificates</h3>
        <p className="text-sm text-muted-foreground">Your course completion certificates and achievements.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((cert) => (
          <Card key={cert.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {cert.course}
              </CardTitle>
              <CardDescription>Issued on {cert.issueDate}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Grade</p>
                  <p className="font-medium">{cert.grade}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Score</p>
                  <p className="font-medium">{cert.score}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Instructor</p>
                  <p className="font-medium">{cert.instructor}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{cert.duration}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Skills Acquired</p>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handleDownload(cert.downloadUrl)}>
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

