import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import type { Team } from '../types';

const TEAMS = [
  { name: 'Mumbai', color: '#004BA0', logo: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chennai', color: '#FDB913', logo: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bangalore', color: '#EC1C24', logo: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kolkata', color: '#3A225D', logo: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80' },
  { name: 'Delhi', color: '#282968', logo: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Punjab', color: '#ED1B24', logo: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rajasthan', color: '#254AA5', logo: 'https://images.unsplash.com/photo-15847922867090-f2da410718f3?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hyderabad', color: '#F7A721', logo: 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gujarat', color: '#1B2133', logo: 'https://images.unsplash.com/photo-1622032493735-219c71298fdd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Lucknow', color: '#A72056', logo: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80' }
];

const SelectTeam = () => {
  const navigate = useNavigate();
  const [selectedTeams, setSelectedTeams] = useState<any[]>([]);
  const { currentRoom, setCurrentTeam } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTeams = async () => {
      if (!currentRoom) {
        navigate('/');
        return;
      }

      try {
        // Check if teams exist
        const { data: existingTeams, error: fetchError } = await supabase
          .from('teams')
          .select('name')
          .in('name', TEAMS.map(t => t.name));

        if (fetchError) throw fetchError;

        const existingTeamNames = new Set(existingTeams?.map(t => t.name) || []);
        const teamsToCreate = TEAMS.filter(t => !existingTeamNames.has(t.name));

        if (teamsToCreate.length > 0) {
          const { error: insertError } = await supabase
            .from('teams')
            .insert(teamsToCreate);

          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error('Error initializing teams:', error);
        toast.error('Failed to initialize teams');
      }
    };

    const fetchSelectedTeams = async () => {
      if (!currentRoom) return;

      try {
        const { data, error } = await supabase
          .from('room_teams')
          .select(`
            *,
            team:teams(*)
          `)
          .eq('room_id', currentRoom.id);

        if (error) throw error;
        setSelectedTeams(data || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
        toast.error('Failed to fetch teams');
      } finally {
        setIsLoading(false);
      }
    };

    const initialize = async () => {
      await initializeTeams();
      await fetchSelectedTeams();
    };

    initialize();

    // Set up realtime subscription
    const channel = supabase.channel('room_teams_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_teams',
        filter: `room_id=eq.${currentRoom?.id}`
      }, () => {
        fetchSelectedTeams();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentRoom, navigate]);

  const handleTeamSelect = async (teamName: string) => {
    if (!currentRoom) {
      toast.error('Please join or create a room first');
      navigate('/');
      return;
    }

    try {
      // Get the team ID first
      const { data: teams, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('name', teamName)
        .single();

      if (teamError) throw teamError;
      if (!teams) {
        toast.error('Team not found');
        return;
      }

      // Check if the team is already selected
      const isTeamTaken = selectedTeams.some(st => st.team_id === teams.id);
      if (isTeamTaken) {
        toast.error('This team has already been selected');
        return;
      }

      // Check if the user already has a team
      const isUserTeam = selectedTeams.some(st => st.user_id === currentRoom.created_by);
      if (isUserTeam) {
        toast.error('You have already selected a team');
        return;
      }

      // Insert the room_team record
      const { data: roomTeam, error: insertError } = await supabase
        .from('room_teams')
        .insert({
          room_id: currentRoom.id,
          team_id: teams.id,
          user_id: currentRoom.created_by,
          remaining_budget: 100.00
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setCurrentTeam(teams);
      toast.success(`Successfully selected ${teamName}`);

      // If all teams are selected, navigate to auction
      if (selectedTeams.length + 1 === TEAMS.length) {
        navigate('/auction');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while selecting the team');
    }
  };

  const handleAuctioneerSelect = () => {
    navigate('/auction');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Select Your Team</h1>
            <p className="text-gray-400">
              {selectedTeams.length} / {TEAMS.length} teams selected
            </p>
          </div>
          <button
            onClick={handleAuctioneerSelect}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-medium text-white hover:from-purple-500 hover:to-blue-500 transition-all duration-300 flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Join as Auctioneer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {TEAMS.map((team) => {
            const selectedTeam = selectedTeams.find(st => st.team?.name === team.name);
            const isSelected = Boolean(selectedTeam);
            const isUserTeam = selectedTeam?.user_id === currentRoom?.created_by;

            return (
              <div
                key={team.name}
                className={`relative bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border ${
                  isSelected ? 'border-green-500/50' : 'border-gray-700/50'
                } ${isSelected && !isUserTeam ? 'opacity-50' : ''}`}
              >
                <div className="text-center">
                  <div 
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${team.logo})`,
                      backgroundColor: team.color 
                    }}
                  />
                  <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>
                </div>

                {!isSelected ? (
                  <button
                    onClick={() => handleTeamSelect(team.name)}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Select Team
                  </button>
                ) : isUserTeam ? (
                  <div className="mt-4 w-full px-4 py-2 bg-green-600 rounded-lg text-center text-white">
                    Your Team
                  </div>
                ) : (
                  <div className="mt-4 w-full px-4 py-2 bg-gray-700 rounded-lg text-center text-gray-400">
                    Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectTeam;