import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PlayerCardProps {
  player: {
    id: number
    name: string
    basePrice: string
    role: string
  }
}

export default function PlayerCard({ player }: PlayerCardProps) {
  // Map roles to colors
  const roleColorMap: Record<string, string> = {
    Batter: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Bowler: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "All-rounder": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  }

  const roleColorClass = roleColorMap[player.role] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">{player.name}</h2>
          <div className="flex justify-center space-x-2">
            <Badge variant="outline" className={roleColorClass}>
              {player.role}
            </Badge>
            <Badge variant="outline">Base Price: {player.basePrice}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

