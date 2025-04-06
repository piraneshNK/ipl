"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DatabaseSetupPage() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [setupComplete, setSetupComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSupabaseSetup = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setError("Please provide both Supabase URL and API key")
      return
    }

    setLoading(true)
    setError("")

    try {
      // In a real app, we would initialize Supabase and create tables
      // For demo purposes, we'll just simulate the setup
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store credentials in localStorage (in a real app, use a more secure method)
      localStorage.setItem("supabaseUrl", supabaseUrl)
      localStorage.setItem("supabaseKey", supabaseKey)

      setSetupComplete(true)
    } catch (err) {
      setError("Failed to set up database. Please check your credentials.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Database Setup</CardTitle>
          <CardDescription>Configure your database for the RPL Auction App</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="supabase">
            <TabsList className="grid grid-cols-1 mb-4">
              <TabsTrigger value="supabase">Supabase</TabsTrigger>
            </TabsList>

            <TabsContent value="supabase">
              {setupComplete ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-100 dark:bg-green-900 rounded-md">
                    <p className="text-green-800 dark:text-green-200">
                      Supabase setup complete! Your auction app is now connected to the database.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Next Steps:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Create rooms and manage auctions</li>
                      <li>Track player bids and team purchases</li>
                      <li>View auction history and statistics</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Supabase provides a PostgreSQL database with real-time capabilities, perfect for auction apps.</p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Supabase Project URL</label>
                      <Input
                        placeholder="https://your-project.supabase.co"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Supabase API Key</label>
                      <Input
                        type="password"
                        placeholder="your-supabase-api-key"
                        value={supabaseKey}
                        onChange={(e) => setSupabaseKey(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">This will create the following tables:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>rooms - Auction rooms</li>
                      <li>teams - Team information</li>
                      <li>players - Player database</li>
                      <li>bids - Bid history</li>
                      <li>purchases - Player purchases</li>
                    </ul>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {!setupComplete && (
            <Button onClick={handleSupabaseSetup} disabled={loading || !supabaseUrl || !supabaseKey} className="w-full">
              {loading ? "Setting up..." : "Set Up Database"}
            </Button>
          )}

          {setupComplete && (
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Return to Home
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="max-w-2xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Database Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">rooms</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <code>
                  {`CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'waiting' -- waiting, active, completed
);`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">teams</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <code>
                  {`CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  purse INTEGER NOT NULL DEFAULT 10000, -- in lakhs
  spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">players</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <code>
                  {`CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  base_price INTEGER NOT NULL, -- in lakhs
  base_price_display TEXT NOT NULL, -- formatted display
  status TEXT DEFAULT 'pending', -- pending, current, sold, unsold
  team_id UUID REFERENCES teams(id),
  sold_for INTEGER, -- in lakhs
  sold_for_display TEXT, -- formatted display
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">bids</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <code>
                  {`CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id),
  player_id UUID REFERENCES players(id),
  team_id UUID REFERENCES teams(id),
  amount INTEGER NOT NULL, -- in lakhs
  amount_display TEXT NOT NULL, -- formatted display
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                </code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

