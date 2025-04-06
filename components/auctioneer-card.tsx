"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gavel } from "lucide-react"

interface AuctioneerCardProps {
  isSelected: boolean
  onSelect: () => void
}

export default function AuctioneerCard({ isSelected, onSelect }: AuctioneerCardProps) {
  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <div className="h-2 bg-amber-500" />
      <CardContent className="pt-4 flex flex-col items-center justify-center">
        <Gavel className="h-8 w-8 mb-2" />
        <h3 className="font-medium text-center text-lg">Auctioneer</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">Control the auction</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onSelect} variant={isSelected ? "default" : "outline"} className="w-full">
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  )
}

