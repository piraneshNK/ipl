-- Create tables for the auction app

-- Rooms table
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL,
    status TEXT DEFAULT 'waiting',
    current_player_id INTEGER,
    auction_started BOOLEAN DEFAULT FALSE,
    is_timer_running BOOLEAN DEFAULT FALSE,
    current_bid TEXT,
    current_bid_value NUMERIC,
    current_bidder TEXT
);

-- Teams table
CREATE TABLE public.teams (
    id INTEGER PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    color TEXT NOT NULL,
    purse NUMERIC NOT NULL DEFAULT 10000,
    spent NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE public.players (
    id INTEGER PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    base_price TEXT NOT NULL,
    base_price_value NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending',
    team_id INTEGER REFERENCES public.teams(id),
    sold_for TEXT,
    sold_for_value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids table
CREATE TABLE public.bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    team_id INTEGER REFERENCES public.teams(id),
    team_name TEXT,
    amount TEXT,
    bid_value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES public.teams(id),
    is_auctioneer BOOLEAN DEFAULT FALSE,
    is_ready BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timers table
CREATE TABLE public.timers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    timer_key BIGINT NOT NULL,
    timer_running BOOLEAN DEFAULT FALSE,
    timer_seconds INTEGER DEFAULT 10,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users to read all data
CREATE POLICY "Allow authenticated users to read rooms" ON public.rooms
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read teams" ON public.teams
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read players" ON public.players
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read bids" ON public.bids
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read timers" ON public.timers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to insert/update their own data
CREATE POLICY "Allow users to insert rooms" ON public.rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow room creator to update rooms" ON public.rooms
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Allow authenticated users to insert teams" ON public.teams
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update teams" ON public.teams
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert players" ON public.players
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update players" ON public.players
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert bids" ON public.bids
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own user data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to insert timers" ON public.timers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update timers" ON public.timers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.timers;

