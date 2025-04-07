import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Player } from "./players"

interface PlayerCardProps {
  player: Player
}

export default function PlayerCard({ player }: PlayerCardProps) {
  // Map roles to colors
  const getRoleColor = (role: string) => {
    if (role.includes("Batter") || role.includes("WK-Batter")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    } else if (role.includes("Bowler") || role.includes("Spinner")) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    } else if (role.includes("All-rounder") || role.includes("All-Rounder")) {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    } else if (role.includes("Wicket-keeper")) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    } else {
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const roleColorClass = getRoleColor(player.role)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">{player.name}</h2>
          <div className="flex flex-wrap justify-center gap-2">
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

