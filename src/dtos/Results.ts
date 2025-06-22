export interface ResultsDto {
    _id: string;
    team1_id: number;
    team2_id: number;
    matches: MatchDto[];
    fetched_at: string;
}

export interface MatchDto {
    fixture: FixtureDto;
    league: LeagueDto;
    teams: TeamsDto;
    goals: GoalsDto;
    score: ScoreDto;
}

export interface FixtureDto {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: PeriodsDto;
    venue: VenueDto;
    status: StatusDto;
}

export interface PeriodsDto {
    first: number;
    second: number;
}

export interface VenueDto {
    id: number | null;
    name: string;
    city: string;
}

export interface StatusDto {
    long: string;
    short: string;
    elapsed: number;
    extra: number | null;
}

export interface LeagueDto {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
    standings: boolean;
}

export interface TeamsDto {
    home: TeamDto;
    away: TeamDto;
}

export interface TeamDto {
    id: number;
    name: string;
    logo: string;
    winner: boolean;
}

export interface GoalsDto {
    home: number;
    away: number;
}

export interface ScoreDto {
    halftime: GoalsDto;
    fulltime: GoalsDto;
    extratime: GoalsDto;
    penalty: GoalsDto;
}
