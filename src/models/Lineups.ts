export interface LineupPlayer {
  number: number;
  name: string;
  id: number;
  photo?: string | null;
  position?: string | null;
  grid?: LineupPlayerGrid;
}

export interface LineupPlayerGrid {
  row: number | null;
  col: number | null;
}

export interface Lineup{
  teamId: number;
  teamName: string;
  teamLogo: string;
  players: LineupPlayer[];
  formation: string;
}