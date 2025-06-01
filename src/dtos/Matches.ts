export interface MatchData {
  id: number;
  homeTeam: string;
  awayTeam: string;
  status: 'LIVE' | 'END'; 
  score: string;
  league: string;
  broadcaster: 'Sky Sports';
  viewers: number;
  homeAvatar: string;
  awayAvatar: string,
}