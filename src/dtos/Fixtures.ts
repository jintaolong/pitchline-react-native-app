export interface Periods {
  first: number | null;
  second: number | null;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
}

export interface Status {
  long: string;
  short: string;
  elapsed: number | null;
  extra: number | null;
}

export interface FixtureDetails {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: Periods;
  venue: Venue;
  status: Status;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings: boolean;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface Teams {
  home: Team;
  away: Team;
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface ScoreTime {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: ScoreTime;
  fulltime: ScoreTime;
  extratime: ScoreTime;
  penalty: ScoreTime;
}

export interface Fixture {
  fixture: FixtureDetails;
  league: League;
  teams: Teams;
  goals: Goals;
  score: Score;
}

export interface FixtureResponse {
  _id: string;
  league_id: number;
  season: number;
  fixture: Fixture;
}