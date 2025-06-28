
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trophy, Users, Activity } from "lucide-react";
import LiveScoring from "@/components/LiveScoring";
import PlayerProfiles from "@/components/PlayerProfiles";
import MatchSummary from "@/components/MatchSummary";
import CreateMatch from "@/components/CreateMatch";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentMatch, setCurrentMatch] = useState(null);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalPlayers: 0,
    recentMatches: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total matches
      const { count: matchCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

      // Fetch total players
      const { count: playerCount } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true });

      // Fetch recent matches
      const { data: recentMatches } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          result,
          match_date,
          team1:teams!matches_team1_id_fkey(name),
          team2:teams!matches_team2_id_fkey(name)
        `)
        .order('match_date', { ascending: false })
        .limit(3);

      setStats({
        totalMatches: matchCount || 0,
        totalPlayers: playerCount || 0,
        recentMatches: recentMatches || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Cricket Scorer Pro</h1>
          <p className="text-green-100">Professional Cricket Scoring & Analytics</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="scoring" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Live Score</span>
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Players</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Matches</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Match</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMatches}</div>
                  <p className="text-xs text-blue-100">All time</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPlayers}</div>
                  <p className="text-xs text-green-100">Registered</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Live Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.recentMatches.filter(m => m.status === 'live').length}
                  </div>
                  <p className="text-xs text-purple-100">Currently active</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.recentMatches.filter(m => m.status === 'completed').length}
                  </div>
                  <p className="text-xs text-orange-100">Recent matches</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Recent Matches
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.recentMatches.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No matches yet. Create your first match!</p>
                  ) : (
                    stats.recentMatches.map((match, index) => (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{match.team1.name} vs {match.team2.name}</p>
                          <p className="text-xs text-gray-600">
                            {match.result || (match.status === 'live' ? 'In Progress' : 'Upcoming')}
                          </p>
                        </div>
                        <Badge variant={match.status === "live" ? "default" : match.status === "completed" ? "secondary" : "outline"}>
                          {new Date(match.match_date).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab("create")} 
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Match
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("players")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Players
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("matches")} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Match History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scoring">
            <LiveScoring currentMatch={currentMatch} />
          </TabsContent>

          <TabsContent value="players">
            <PlayerProfiles />
          </TabsContent>

          <TabsContent value="matches">
            <MatchSummary />
          </TabsContent>

          <TabsContent value="create">
            <CreateMatch onMatchCreated={setCurrentMatch} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
