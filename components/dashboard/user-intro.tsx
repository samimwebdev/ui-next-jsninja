import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export function UserIntro() {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="flex items-center gap-4 p-4 md:p-6">
        <Avatar className="h-16 w-16 md:h-20 md:w-20">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-muted-foreground">
            Frontend Developer | Learning enthusiast passionate about web technologies
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

