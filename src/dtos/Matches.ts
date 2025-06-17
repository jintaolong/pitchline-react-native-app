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


export type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  competition: string;
  channel: string;
  viewers: string;
  kickoffTime: Date | null;
  time: string | null;
};