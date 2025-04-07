"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { createRoom, joinRoom } from "@/services/auction-service"
import { useToast } from "@/components/ui/use-toast"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("join")
  const [roomName, setRoomName] = useState("")
  const [password, setPassword] = useState("")
  const [roomId, setRoomId] = useState("")
  const [joinPassword, setJoinPassword] = useState("")
  const [email, setEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { user, signIn, signUp, loading, logout } = useAuth()
  const { toast } = useToast()

  const handleCreateRoom = async () => {
    if (!roomName || !password) {
      toast({
        title: "Error",
        description: "Please enter both room name and password",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a room",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const newRoomId = await createRoom(roomName, password, user.id)

      // Store the room ID in localStorage
      localStorage.setItem("roomId", newRoomId)
      localStorage.setItem("isAuctioneer", "true")

      router.push("/team-selection")
    } catch (error) {
      console.error("Error creating room:", error)
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!roomId || !joinPassword) {
      toast({
        title: "Error",
        description: "Please enter both room ID and password",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to join a room",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await joinRoom(roomId, joinPassword)

      // Store the room ID in localStorage
      localStorage.setItem("roomId", roomId)
      localStorage.setItem("isAuctioneer", "false")

      router.push("/team-selection")
    } catch (error) {
      console.error("Error joining room:", error)
      toast({
        title: "Error",
        description: "Failed to join room. Please check the room ID and password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuth = async (isSignUp: boolean) => {
    if (!email || !authPassword) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = isSignUp ? await signUp(email, authPassword) : await signIn(email, authPassword)

      if (result.error) {
        throw result.error
      }

      toast({
        title: "Success",
        description: isSignUp ? "Account created successfully" : "Logged in successfully",
      })
    } catch (error: any) {
      console.error("Authentication error:", error)
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">IPL Auction App</CardTitle>
          <CardDescription>Create or join a room to start the auction</CardDescription>
        </CardHeader>

        {!user ? (
          <CardContent className="space-y-4">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button className="w-full" onClick={() => handleAuth(false)} disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button className="w-full" onClick={() => handleAuth(true)} disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        ) : (
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="join">Join Room</TabsTrigger>
                <TabsTrigger value="create">Create Room</TabsTrigger>
              </TabsList>

              <TabsContent value="join">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="roomId" className="text-sm font-medium">
                      Room ID
                    </label>
                    <Input
                      id="roomId"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="Enter room ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="joinPassword" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="joinPassword"
                      type="password"
                      value={joinPassword}
                      onChange={(e) => setJoinPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                  <Button className="w-full" onClick={handleJoinRoom} disabled={isLoading}>
                    {isLoading ? "Joining..." : "Join Room"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="create">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="roomName" className="text-sm font-medium">
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
                    <label htmlFor="password" className="text-sm font-medium">
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
                  <Button className="w-full" onClick={handleCreateRoom} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Room"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}

        {user && (
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center text-muted-foreground">Logged in as {user.email}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout()
              }}
            >
              Sign Out
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

