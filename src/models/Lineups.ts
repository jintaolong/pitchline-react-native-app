export interface LineupPlayer {
  number: number;
  name: string;
}

export interface Lineup{
  teamId: number;
  teamName: string;
  teamLogo: string;
  players: LineupPlayer[];
  formation: string;
}