"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TeamCard from "@/components/team-card"
import AuctioneerCard from "@/components/auctioneer-card"
import { teams } from "@/data/players"
import { useAuth } from "@/hooks/use-auth"
import {
  selectTeam,
  selectAuctioneer,
  setUserReady,
  initializeTeams,
  initializePlayers,
  setupRealtimeAuction,
} from "@/services/auction-service"
import { useToast } from "@/components/ui/use-toast"
import { shuffledPlayers } from "@/data/players"

export default function TeamSelectionPage() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [isAuctioneer, setIsAuctioneer] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [roomId, setRoomId] = useState("")
  const [isInitializing, setIsInitializing] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Get room ID from localStorage
    const storedRoomId = localStorage.getItem("roomId")
    const storedIsAuctioneer = localStorage.getItem("isAuctioneer") === "true"

    if (!storedRoomId) {
      router.push("/")
      return
    }

    setRoomId(storedRoomId)

    // If user is auctioneer, initialize the room data
    if (storedIsAuctioneer && !isInitializing) {
      setIsInitializing(true)

      // Initialize teams and players in Firestore
      const initializeRoom = async () => {
        try {
          await initializeTeams(storedRoomId, teams)
          await initializePlayers(storedRoomId, shuffledPlayers)

          // Set up realtime auction data
          setupRealtimeAuction(storedRoomId)

          toast({
            title: "Room Initialized",
            description: "Teams and players have been set up",
          })
        } catch (error) {
          console.error("Error initializing room:", error)
          toast({
            title: "Error",
            description: "Failed to initialize room data",
            variant: "destructive",
          })
        } finally {
          setIsInitializing(false)
        }
      }

      initializeRoom()
    }
  }, [router, user, loading, toast, isInitializing])

  const handleTeamSelect = async (teamId: number) => {
    if (!user) return

    try {
      await selectTeam(roomId, user.uid, teamId)
      setSelectedTeam(teamId)
      setIsAuctioneer(false)
      setIsReady(false)

      toast({
        title: "Team Selected",
        description: `You've selected ${teams.find((t) => t.id === teamId)?.name}`,
      })
    } catch (error) {
      console.error("Error selecting team:", error)
      toast({
        title: "Error",
        description: "Failed to select team",
        variant: "destructive",
      })
    }
  }

  const handleAuctioneerSelect = async () => {
    if (!user) return

    try {
      await selectAuctioneer(roomId, user.uid)
      setSelectedTeam(null)
      setIsAuctioneer(true)
      setIsReady(false)

      toast({
        title: "Role Selected",
        description: "You are now the auctioneer",
      })
    } catch (error) {
      console.error("Error selecting auctioneer:", error)
      toast({
        title: "Error",
        description: "Failed to select auctioneer role",
        variant: "destructive",
      })
    }
  }

  const handleReady = async () => {
    if (!user) return

    try {
      await setUserReady(roomId, user.uid)
      setIsReady(true)

      toast({
        title: "Ready",
        description: "Waiting for other participants",
      })

      // In a real app, we would wait for all users to be ready
      // For demo purposes, we'll just redirect after a short delay
      setTimeout(() => {
        if (isAuctioneer) {
          router.push("/auctioneer")
        } else {
          router.push("/auction")
        }
      }, 1500)
    } catch (error) {
      console.error("Error setting ready status:", error)
      toast({
        title: "Error",
        description: "Failed to set ready status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Select Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Room ID: {roomId}</p>

          {/* Auctioneer Card */}
          <div className="mb-6">
            <AuctioneerCard isSelected={isAuctioneer} onSelect={handleAuctioneerSelect} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} isSelected={selectedTeam === team.id} onSelect={handleTeamSelect} />
            ))}
          </div>

          {(selectedTeam !== null || isAuctioneer) && (
            <div className="mt-6 text-center">
              <Button onClick={handleReady} disabled={isReady || isInitializing} className="w-full max-w-xs">
                {isInitializing ? "Initializing..." : isReady ? "Waiting for others..." : "Ready"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

