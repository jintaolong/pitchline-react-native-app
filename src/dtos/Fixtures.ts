export interface PeriodsDto {
  first: number | null;
  second: number | null;
}

export interface VenueDto {
  id: number;
  name: string;
  city: string;
}

export interface StatusDto {
  long: string;
  short: string;
  elapsed: number | null;
  extra: number | null;
}

export interface FixtureDetailsDto {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: PeriodsDto;
  venue: VenueDto;
  status: StatusDto;
}

export interface LeagueDto {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings: boolean;
}

export interface TeamDto {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface TeamsDto {
  home: TeamDto;
  away: TeamDto;
}

export interface GoalsDto {
  home: number | null;
  away: number | null;
}

export interface ScoreTimeDto {
  home: number | null;
  away: number | null;
}

export interface ScoreDto {
  halftime: ScoreTimeDto;
  fulltime: ScoreTimeDto;
  extratime: ScoreTimeDto;
  penalty: ScoreTimeDto;
}

export interface FixtureDto {
  fixture: FixtureDetailsDto;
  league: LeagueDto;
  teams: TeamsDto;
  goals: GoalsDto;
  score: ScoreDto;
}

export interface FixtureResponseDto {
  _id: string;
  league_id: number;
  season: number;
  fixture: FixtureDto;
}