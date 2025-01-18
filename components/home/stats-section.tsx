import { Card } from '@/components/ui/card'
import { Database, Eye, Gauge, Users } from 'lucide-react'

export const StatsSection = () => {
  return (
    <div className="w-full space-y-8 py-12 px-2">
      <Card className="mx-auto max-w-screen-xl p-8 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Let&apos;s build something great.
            </h2>
            <p className="text-muted-foreground">
              Enim sed faucibus turpis in eu mi bibendum neque egestas. Mi
              bibendum neque egestas congue quisque egestas diam in arcu. Elit
              pellentesque habitant.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <div className="text-3xl font-bold">420%</div>
              <p className="text-sm text-muted-foreground">Data Efficiency</p>
            </div>
            <div className="space-y-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div className="text-3xl font-bold">708+</div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
            <div className="space-y-2">
              <Gauge className="h-5 w-5 text-muted-foreground" />
              <div className="text-3xl font-bold">1.82M</div>
              <p className="text-sm text-muted-foreground">AI LLM Scale</p>
            </div>
            <div className="space-y-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="text-3xl font-bold">3.23K</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
