
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Target, Users, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LiveScoring = ({ currentMatch }) => {
  const [score, setScore] = useState({ runs: 87, wickets: 3, overs: 12.4 });
  const [currentBatsmen, setCurrentBatsmen] = useState([
    { name: "Virat Sharma", runs: 45, balls: 32, fours: 6, sixes: 1 },
    { name: "Rohit Kumar", runs: 23, balls: 18, fours: 3, sixes: 0 }
  ]);
  const [currentBowler, setCurrentBowler] = useState({
    name: "Jasprit Patel", overs: 2.4, runs: 18, wickets: 1
  });
  const [overHistory, setOverHistory] = useState([
    "1 2 4 6 1 .",
    "W 1 1 2 . 4",
    ". . 1 1 4"
  ]);

  const addRun = (runs) => {
    setScore(prev => ({ ...prev, runs: prev.runs + runs }));
    toast({
      title: `${runs} run${runs > 1 ? 's' : ''} added!`,
      description: `Current score: ${score.runs + runs}/${score.wickets}`,
    });
  };

  const addWicket = () => {
    setScore(prev => ({ ...prev, wickets: prev.wickets + 1 }));
    toast({
      title: "Wicket fallen!",
      description: `Current score: ${score.runs}/${score.wickets + 1}`,
      variant: "destructive"
    });
  };

  if (!currentMatch) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">No Active Match</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">Create a new match to start live scoring</p>
          <Button className="bg-green-600 hover:bg-green-700">Create New Match</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Score Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Mumbai Warriors vs Delhi Dynamos</h2>
              <p className="text-blue-100">T20 Match • Over 12.4 of 20</p>
            </div>
            <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score.runs}/{score.wickets}</div>
            <div className="text-lg">({score.overs} overs)</div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold">Run Rate</div>
                <div>{(score.runs / (Math.floor(score.overs) + (score.overs % 1) * 10/6)).toFixed(2)}</div>
              </div>
              <div>
                <div className="font-semibold">Required Rate</div>
                <div>8.45</div>
              </div>
              <div>
                <div className="font-semibold">Target</div>
                <div>156</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scoring Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Scoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[0, 1, 2, 3, 4, 6].map((runs) => (
                <Button
                  key={runs}
                  onClick={() => addRun(runs)}
                  className={`h-12 text-lg font-bold ${
                    runs === 4 ? 'bg-blue-500 hover:bg-blue-600' :
                    runs === 6 ? 'bg-orange-500 hover:bg-orange-600' :
                    'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  {runs}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button onClick={addWicket} variant="destructive" className="h-12">
                Wicket
              </Button>
              <Button variant="outline" className="h-12">
                Wide/No Ball
              </Button>
            </div>

            <div className="space-y-3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select dismissal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bowled">Bowled</SelectItem>
                  <SelectItem value="caught">Caught</SelectItem>
                  <SelectItem value="lbw">LBW</SelectItem>
                  <SelectItem value="stumped">Stumped</SelectItem>
                  <SelectItem value="runout">Run Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Current Players */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Current Players
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Batsmen</h4>
              {currentBatsmen.map((batsman, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                  <div>
                    <p className="font-medium">{batsman.name} {index === 0 && "*"}</p>
                    <p className="text-sm text-gray-600">{batsman.runs}({batsman.balls}) • 4s: {batsman.fours} • 6s: {batsman.sixes}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{batsman.runs}</div>
                    <div className="text-xs text-gray-500">SR: {((batsman.runs / batsman.balls) * 100).toFixed(1)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-medium mb-2">Current Bowler</h4>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{currentBowler.name}</p>
                  <p className="text-sm text-gray-600">{currentBowler.overs} overs • {currentBowler.runs} runs • {currentBowler.wickets} wickets</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">{currentBowler.wickets}/{currentBowler.runs}</div>
                  <div className="text-xs text-gray-500">Econ: {(currentBowler.runs / currentBowler.overs).toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Over History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Overs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {overHistory.map((over, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <Badge variant="outline">Over {overHistory.length - index}</Badge>
                <span className="font-mono text-sm">{over}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveScoring;
