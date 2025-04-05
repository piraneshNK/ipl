"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TeamCardProps {
  team: {
    id: number
    name: string
    color: string
  }
  isSelected: boolean
  onSelect: (teamId: number) => void
}

export default function TeamCard({ team, isSelected, onSelect }: TeamCardProps) {
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
    <Card className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <div className={`h-2 ${colorClass}`} />
      <CardContent className="pt-4">
        <h3 className="font-medium text-center">{team.name}</h3>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelect(team.id)} variant={isSelected ? "default" : "outline"} className="w-full">
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  )
}

