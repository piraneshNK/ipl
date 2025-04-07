import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Team } from "./players"

interface TeamPurseCardProps {
  team: Team
}

export default function TeamPurseCard({ team }: TeamPurseCardProps) {
  // Calculate percentage of purse spent
  const percentSpent = (team.spent / team.purse) * 100

  // Format purse amounts
  const formatAmount = (amount: number) => {
    return `${(amount / 100).toFixed(2)}Cr`
  }

  // Map color names to Tailwind classes
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
    indigo: "bg-indigo-500",
    gray: "bg-gray-500",
  }

  const colorClass = colorMap[team.color] || "bg-gray-500"

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${colorClass}`} />
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{team.name}</h3>
          <span className="text-sm">{team.players.length} Players</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Purse Left:</span>
            <span className="font-medium">{formatAmount(team.purse - team.spent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Spent:</span>
            <span className="font-medium">{formatAmount(team.spent)}</span>
          </div>
        </div>

        <div className="mt-2">
          <Progress value={percentSpent} className="h-2" />
          <div className="flex justify-between text-xs mt-1">
            <span>0%</span>
            <span>Spent: {percentSpent.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

