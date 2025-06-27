import { Team } from "./Teams";

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
  homeTeam: Team;
  awayTeam: Team;
  homeLogo?: string;
  awayLogo?: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  competition: string;
  competitionId: number;
  channel: string;
  viewers: string;
  kickoffTime: Date | null;
  time: string | null;
};