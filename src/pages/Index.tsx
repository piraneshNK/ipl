
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import Header from '@/components/Header';
import { Users, Plus, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";

interface RoomFormValues {
  roomName: string;
  roomPassword: string;
}

const Index = () => {
  const [joinMode, setJoinMode] = useState<boolean>(false);
  const form = useForm<RoomFormValues>({
    defaultValues: {
      roomName: "",
      roomPassword: ""
    }
  });

  const onSubmit = (data: RoomFormValues) => {
    if (joinMode) {
      window.location.href = `/team-selection?mode=join&room=${data.roomName}`;
    } else {
      window.location.href = `/create-room?room=${data.roomName}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton={false} />
      
      <main className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="page-container flex flex-col items-center">
          <div className="my-12 md:my-24 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 title-gradient">
              RPL Auction Game 2025
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join private rooms, select your team, and bid live on RPL players with real-time updates.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mb-8">
                <FormField
                  control={form.control}
                  name="roomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter room name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="roomPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter room password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    type="submit" 
                    className="w-full h-14 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg"
                    onClick={() => setJoinMode(false)}
                  >
                    <Plus className="w-5 h-5" />
                    Create Room
                  </Button>
                  
                  <Button 
                    type="submit"
                    className="w-full h-14 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg"
                    onClick={() => setJoinMode(true)}
                  >
                    <LogIn className="w-5 h-5" />
                    Join Room
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-8 md:mt-16 w-full max-w-4xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Form Your Team</h3>
                <p className="text-gray-600 text-center">
                  Choose your favorite RPL franchise and build a balanced squad within your budget.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Bid Strategically</h3>
                <p className="text-gray-600 text-center">
                  Compete with friends in real-time auctions to build the strongest team possible.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Win The Tournament</h3>
                <p className="text-gray-600 text-center">
                  Test your cricket knowledge and team-building skills against your friends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 RPL Auction Game | All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
