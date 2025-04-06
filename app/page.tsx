"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const [roomName, setRoomName] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleCreateRoom = () => {
    if (roomName && password) {
      // In a real app, we would create the room in a database
      localStorage.setItem("roomName", roomName)
      localStorage.setItem("isAuctioneer", "true")
      router.push("/team-selection")
    }
  }

  const handleJoinRoom = () => {
    if (roomName && password) {
      // In a real app, we would verify the room exists and the password is correct
      localStorage.setItem("roomName", roomName)
      localStorage.setItem("isAuctioneer", "false")
      router.push("/team-selection")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to RPL</CardTitle>
          <CardDescription>Create or join a room to start the auction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="roomName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Room Name
            </label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleCreateRoom} disabled={!roomName || !password}>
            Create Room
          </Button>
          <Button className="w-full" variant="outline" onClick={handleJoinRoom} disabled={!roomName || !password}>
            Join Room
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

