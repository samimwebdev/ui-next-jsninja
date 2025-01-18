import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function CourseAuthor() {
  return (
    <section id="instructor" className="my-12">
      <h2 className="text-3xl font-bold mb-6">Meet Your Instructor</h2>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rxcxbhOGI9hdkibrnJoCLFBEyyygNa.png"
            alt="Priyom Mozumder"
            width={80}
            height={80}
          />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">Priyom Mozumder</h3>
          <p className="text-muted-foreground">Founder & CEO, BOHUBRIHI</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <p>
          ডিজিটাল মার্কেটিং এর সকল দিক নিয়ে ১০ বছরের বেশি সময় ধরে কাজ করছেন।
          তিনি বর্তমানে BOHUBRIHI এর ফাউন্ডার ও সিইও হিসেবে কর্মরত আছেন।
        </p>
      </div>
    </section>
  )
}
