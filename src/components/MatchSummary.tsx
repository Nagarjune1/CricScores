
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Users, Award, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Match {
  id: string;
  venue: string;
  match_date: string;
  match_time?: string;
  status: string;
  team1_score?: string;
  team1_overs?: string;
  team2_score?: string;
  team2_overs?: string;
  result?: string;
  man_of_match?: string;
  team1: { name: string };
  team2: { name: string };
}

const MatchSummary = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          team1:teams!matches_team1_id_fkey(name),
          team2:teams!matches_team2_id_fkey(name)
        `)
        .order('match_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }
      
      setMatches(data || []);
      if (data && data.length > 0) {
        setSelectedMatch(data[0]);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading matches...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Match Summaries</h2>
        </div>
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-600 mb-4">No matches found</p>
            <p className="text-sm text-gray-500">Create your first match to see summaries here</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Match Summaries</h2>
        <Button variant="outline">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Matches</h3>
          {matches.map((match) => (
            <Card 
              key={match.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedMatch?.id === match.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedMatch(match)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={match.status === 'completed' ? 'secondary' : match.status === 'live' ? 'default' : 'outline'}>
                      {match.status === 'completed' ? 'Completed' : match.status === 'live' ? 'Live' : 'Upcoming'}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(match.match_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium">{match.team1.name}</div>
                    <div className="text-gray-600">{match.team1_score || 'Not Started'} {match.team1_overs ? `(${match.team1_overs})` : ''}</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium">{match.team2.name}</div>
                    <div className="text-gray-600">{match.team2_score || 'Not Started'} {match.team2_overs ? `(${match.team2_overs})` : ''}</div>
                  </div>
                  
                  {match.result && (
                    <div className="text-xs text-green-600 font-medium">{match.result}</div>
                  )}
                  
                  {match.man_of_match && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Award className="w-3 h-3" />
                      MOM: {match.man_of_match}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Match Details */}
        <div className="lg:col-span-2">
          {selectedMatch ? (
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{selectedMatch.team1.name} vs {selectedMatch.team2.name}</CardTitle>
                    <Badge className={selectedMatch.status === 'completed' ? 'bg-green-500' : selectedMatch.status === 'live' ? 'bg-red-500' : 'bg-gray-500'}>
                      {selectedMatch.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedMatch.match_date).toLocaleDateString()}
                      {selectedMatch.match_time && ` at ${selectedMatch.match_time}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedMatch.venue}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="space-y-4">
                    {selectedMatch.result ? (
                      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h3 className="text-lg font-bold text-green-700 mb-2">{selectedMatch.result}</h3>
                            {selectedMatch.man_of_match && (
                              <div className="flex items-center justify-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <span className="text-sm">Man of the Match: <strong>{selectedMatch.man_of_match}</strong></span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h3 className="text-lg font-bold text-blue-700 mb-2">
                              {selectedMatch.status === 'upcoming' ? 'Match Not Started' : 'Match In Progress'}
                            </h3>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{selectedMatch.team1.name}</h4>
                          <div className="text-2xl font-bold">{selectedMatch.team1_score || 'Not Started'}</div>
                          {selectedMatch.team1_overs && (
                            <div className="text-sm text-gray-600">({selectedMatch.team1_overs} overs)</div>
                          )}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{selectedMatch.team2.name}</h4>
                          <div className="text-2xl font-bold">{selectedMatch.team2_score || 'Not Started'}</div>
                          {selectedMatch.team2_overs && (
                            <div className="text-sm text-gray-600">({selectedMatch.team2_overs} overs)</div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Match Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Venue:</span>
                            <span>{selectedMatch.venue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span>{new Date(selectedMatch.match_date).toLocaleDateString()}</span>
                          </div>
                          {selectedMatch.match_time && (
                            <div className="flex justify-between">
                              <span>Time:</span>
                              <span>{selectedMatch.match_time}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="capitalize">{selectedMatch.status}</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Teams</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Team 1:</span>
                            <span>{selectedMatch.team1.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Team 2:</span>
                            <span>{selectedMatch.team2.name}</span>
                          </div>
                          {selectedMatch.man_of_match && (
                            <div className="flex justify-between">
                              <span>Man of Match:</span>
                              <span>{selectedMatch.man_of_match}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Select a match to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchSummary;
