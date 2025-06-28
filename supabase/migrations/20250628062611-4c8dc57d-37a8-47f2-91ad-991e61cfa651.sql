
-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper')),
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  batting_style TEXT,
  bowling_style TEXT,
  matches INTEGER DEFAULT 0,
  runs INTEGER DEFAULT 0,
  wickets INTEGER DEFAULT 0,
  average DECIMAL(5,2) DEFAULT 0,
  strike_rate DECIMAL(5,2) DEFAULT 0,
  economy DECIMAL(4,2) DEFAULT 0,
  best_score TEXT DEFAULT '0',
  best_bowling TEXT DEFAULT '0/0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team1_id UUID REFERENCES public.teams(id) NOT NULL,
  team2_id UUID REFERENCES public.teams(id) NOT NULL,
  venue TEXT NOT NULL,
  match_date DATE NOT NULL,
  match_time TIME,
  format TEXT NOT NULL,
  overs INTEGER,
  tournament TEXT,
  description TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  team1_score TEXT,
  team1_overs TEXT,
  team2_score TEXT,
  team2_overs TEXT,
  result TEXT,
  man_of_match UUID REFERENCES public.players(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these later for user-specific access)
CREATE POLICY "Allow public read access on teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public insert on teams" ON public.teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on teams" ON public.teams FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on teams" ON public.teams FOR DELETE USING (true);

CREATE POLICY "Allow public read access on players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public insert on players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on players" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on players" ON public.players FOR DELETE USING (true);

CREATE POLICY "Allow public read access on matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public insert on matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on matches" ON public.matches FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on matches" ON public.matches FOR DELETE USING (true);

-- Insert some initial teams
INSERT INTO public.teams (name, city) VALUES 
('Mumbai Warriors', 'Mumbai'),
('Delhi Dynamos', 'Delhi'),
('Chennai Champions', 'Chennai'),
('Kolkata Knights', 'Kolkata'),
('Bangalore Bulls', 'Bangalore'),
('Hyderabad Hawks', 'Hyderabad'),
('Rajasthan Royals', 'Rajasthan'),
('Punjab Kings', 'Punjab');
