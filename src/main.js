import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Constants
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

// State management
let currentRoom = null;
let currentTeam = null;
let selectedTeams = [];

// DOM Elements
const pages = {
  home: document.getElementById('home-page'),
  selectTeam: document.getElementById('select-team-page'),
  auction: document.getElementById('auction-page')
};

// Navigation
function showPage(pageId) {
  Object.values(pages).forEach(page => page.classList.remove('active'));
  pages[pageId].classList.add('active');
}

// Toast notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Home page functionality
document.getElementById('create-room').addEventListener('click', async () => {
  const name = document.getElementById('room-name').value;
  const password = document.getElementById('room-password').value;

  if (!name || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  try {
    const { data: newRoom, error } = await supabase
      .from('rooms')
      .insert({
        name,
        password,
        status: 'waiting'
      })
      .select()
      .single();

    if (error) throw error;
    
    currentRoom = newRoom;
    showPage('selectTeam');
    showToast('Room created successfully!');
    await initializeTeams();
    renderTeams();
  } catch (error) {
    console.error('Error:', error);
    showToast('Error creating room', 'error');
  }
});

document.getElementById('join-room').addEventListener('click', async () => {
  const name = document.getElementById('room-name').value;
  const password = document.getElementById('room-password').value;

  if (!name || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .select()
      .eq('name', name)
      .eq('password', password)
      .single();

    if (error || !room) {
      showToast('Room not found or incorrect password', 'error');
      return;
    }

    currentRoom = room;
    showPage('selectTeam');
    showToast('Joined room successfully!');
    await initializeTeams();
    renderTeams();
  } catch (error) {
    console.error('Error:', error);
    showToast('Error joining room', 'error');
  }
});

// Initialize teams in the database
async function initializeTeams() {
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

    // Fetch selected teams for the current room
    if (currentRoom) {
      const { data, error } = await supabase
        .from('room_teams')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('room_id', currentRoom.id);

      if (error) throw error;
      selectedTeams = data || [];
    }
  } catch (error) {
    console.error('Error initializing teams:', error);
    showToast('Failed to initialize teams', 'error');
  }
}

// Select team page functionality
function renderTeams() {
  const teamsGrid = document.getElementById('teams-grid');
  teamsGrid.innerHTML = '';

  TEAMS.forEach(team => {
    const selectedTeam = selectedTeams.find(st => st.team?.name === team.name);
    const isSelected = Boolean(selectedTeam);
    const isUserTeam = selectedTeam?.user_id === currentRoom?.created_by;

    const teamCard = document.createElement('div');
    teamCard.className = `team-card ${isSelected ? 'selected' : ''}`;
    teamCard.innerHTML = `
      <div class="team-logo" style="background-image: url(${team.logo}); background-color: ${team.color};"></div>
      <h3 class="team-name">${team.name}</h3>
      ${!isSelected ? `
        <button class="btn btn-blue" onclick="handleTeamSelect('${team.name}')">Select Team</button>
      ` : isUserTeam ? `
        <div class="btn btn-green">Your Team</div>
      ` : `
        <div class="btn" style="background: #374151; cursor: default;">Selected</div>
      `}
    `;

    teamsGrid.appendChild(teamCard);
  });

  document.getElementById('selected-teams-count').textContent = selectedTeams.length;
  document.getElementById('total-teams-count').textContent = TEAMS.length;
}

async function handleTeamSelect(teamName) {
  if (!currentRoom) {
    showToast('Please join or create a room first', 'error');
    showPage('home');
    return;
  }

  try {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('name', teamName)
      .single();

    if (teamError) throw teamError;
    if (!team) {
      showToast('Team not found', 'error');
      return;
    }

    const isTeamTaken = selectedTeams.some(st => st.team_id === team.id);
    if (isTeamTaken) {
      showToast('This team has already been selected', 'error');
      return;
    }

    const isUserTeam = selectedTeams.some(st => st.user_id === currentRoom.created_by);
    if (isUserTeam) {
      showToast('You have already selected a team', 'error');
      return;
    }

    const { data: roomTeam, error: insertError } = await supabase
      .from('room_teams')
      .insert({
        room_id: currentRoom.id,
        team_id: team.id,
        user_id: currentRoom.created_by,
        remaining_budget: 100.00
      })
      .select()
      .single();

    if (insertError) throw insertError;

    currentTeam = team;
    selectedTeams = [...selectedTeams, { ...roomTeam, team }];
    renderTeams();
    showToast(`Successfully selected ${teamName}`);

    if (selectedTeams.length === TEAMS.length) {
      showPage('auction');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('An error occurred while selecting the team', 'error');
  }
}

document.getElementById('auctioneer-button').addEventListener('click', () => {
  showPage('auction');
});

// Initialize the application
async function initialize() {
  showPage('home');
  
  // Set up real-time subscription for room_teams
  const channel = supabase.channel('room_teams_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'room_teams'
    }, async () => {
      if (currentRoom) {
        const { data } = await supabase
          .from('room_teams')
          .select(`
            *,
            team:teams(*)
          `)
          .eq('room_id', currentRoom.id);
        
        selectedTeams = data || [];
        renderTeams();
      }
    })
    .subscribe();

  // Cleanup on page unload
  window.addEventListener('unload', () => {
    channel.unsubscribe();
  });
}

// Start the application
initialize();

// Make functions available globally
window.handleTeamSelect = handleTeamSelect;