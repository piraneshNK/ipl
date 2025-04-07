"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@supabase/supabase-js"

export default function SetupSupabasePage() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [setupComplete, setSetupComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSupabaseSetup = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setError("Please provide both Supabase URL and API key")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Test the connection
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error: pingError } = await supabase.from("rooms").select("count").limit(1)

      if (pingError && pingError.code !== "PGRST116") {
        // PGRST116 is "No rows found" which is fine for our test
        throw new Error(`Connection failed: ${pingError.message}`)
      }

      // Store credentials in localStorage (in a real app, use a more secure method)
      localStorage.setItem("supabaseUrl", supabaseUrl)
      localStorage.setItem("supabaseKey", supabaseKey)

      toast({
        title: "Success",
        description: "Supabase connection established successfully",
      })

      setSetupComplete(true)
    } catch (err: any) {
      setError(`Failed to set up Supabase: ${err.message}`)
      console.error(err)

      toast({
        title: "Error",
        description: `Failed to connect to Supabase: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Supabase Setup</CardTitle>
          <CardDescription>Configure your Supabase database for the IPL Auction App</CardDescription>
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
                      <label className="text-sm font-medium">Supabase Anon Key</label>
                      <Input
                        type="password"
                        placeholder="your-supabase-anon-key"
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
                    <h3 className="font-medium">This will use the following tables:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>rooms - Auction rooms</li>
                      <li>teams - Team information</li>
                      <li>players - Player database</li>
                      <li>bids - Bid history</li>
                      <li>users - User information</li>
                      <li>timers - Auction timer state</li>
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
              {loading ? "Setting up..." : "Set Up Supabase"}
            </Button>
          )}

          {setupComplete && (
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Return to Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

