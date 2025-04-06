"use client"

import { Button } from "@/components/ui/button"

interface BidButtonProps {
  amount: string
  onBid: (amount: string) => void
  disabled?: boolean
}

export default function BidButton({ amount, onBid, disabled = false }: BidButtonProps) {
  return (
    <Button
      onClick={() => onBid(amount)}
      disabled={disabled}
      variant={disabled ? "outline" : "default"}
      className="w-full"
    >
      {amount}
    </Button>
  )
}

