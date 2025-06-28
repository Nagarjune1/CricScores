
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trophy, Target, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  city: string;
}

interface Player {
  id: string;
  name: string;
  role: string;
  team_id: string;
  batting_style?: string;
  bowling_style?: string;
  matches: number;
  runs: number;
  wickets: number;
  average: number;
  strike_rate: number;
  economy?: number;
  best_score: string;
  best_bowling: string;
  teams?: Team;
}

const PlayerProfiles = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    role: "",
    team_id: "",
    batting_style: "",
    bowling_style: ""
  });

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }
      
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (
            id,
            name,
            city
          )
        `)
        .order('name');
      
      if (error) {
        console.error('Error fetching players:', error);
        return;
      }
      
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async () => {
    if (!newPlayer.name || !newPlayer.role || !newPlayer.team_id) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: newPlayer.name,
          role: newPlayer.role,
          team_id: newPlayer.team_id,
          batting_style: newPlayer.batting_style || null,
          bowling_style: newPlayer.bowling_style || null
        }])
        .select();

      if (error) {
        console.error('Error adding player:', error);
        toast({
          title: "Error",
          description: "Failed to add player",
          variant: "destructive"
        });
        return;
      }

      setNewPlayer({ name: "", role: "", team_id: "", batting_style: "", bowling_style: "" });
      fetchPlayers(); // Refresh the players list
      
      toast({
        title: "Success!",
        description: `${newPlayer.name} added to player database`,
      });
    } catch (error) {
      console.error('Error adding player:', error);
      toast({
        title: "Error", 
        description: "Failed to add player",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Player Profiles</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Player Name *</Label>
                <Input
                  id="name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  placeholder="Enter player name"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select onValueChange={(value) => setNewPlayer({...newPlayer, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Batsman">Batsman</SelectItem>
                    <SelectItem value="Bowler">Bowler</SelectItem>
                    <SelectItem value="All-rounder">All-rounder</SelectItem>
                    <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="team">Team *</Label>
                <Select onValueChange={(value) => setNewPlayer({...newPlayer, team_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="batting">Batting Style</Label>
                <Select onValueChange={(value) => setNewPlayer({...newPlayer, batting_style: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batting style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Right-handed">Right-handed</SelectItem>
                    <SelectItem value="Left-handed">Left-handed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bowling">Bowling Style</Label>
                <Select onValueChange={(value) => setNewPlayer({...newPlayer, bowling_style: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bowling style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fast">Fast</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Spin">Spin</SelectItem>
                    <SelectItem value="Off-spin">Off-spin</SelectItem>
                    <SelectItem value="Leg-spin">Leg-spin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addPlayer} className="w-full bg-green-600 hover:bg-green-700">
                Add Player
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {players.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-600 mb-4">No players found</p>
            <p className="text-sm text-gray-500">Add your first player to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <Card key={player.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{player.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{player.role}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {player.teams?.name || 'No Team'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-bold text-blue-600">{player.matches}</div>
                    <div className="text-gray-600">Matches</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-600">{player.runs}</div>
                    <div className="text-gray-600">Runs</div>
                  </div>
                </div>

                {player.role !== "Bowler" && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-medium">{player.average}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strike Rate:</span>
                      <span className="font-medium">{player.strike_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Score:</span>
                      <span className="font-medium">{player.best_score}</span>
                    </div>
                  </div>
                )}

                {(player.role === "Bowler" || player.role === "All-rounder") && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wickets:</span>
                      <span className="font-medium">{player.wickets}</span>
                    </div>
                    {player.economy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Economy:</span>
                        <span className="font-medium">{player.economy}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Bowling:</span>
                      <span className="font-medium">{player.best_bowling}</span>
                    </div>
                  </div>
                )}

                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerProfiles;
