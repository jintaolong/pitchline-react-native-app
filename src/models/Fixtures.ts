export interface Fixture{
    league: string;
    kickoffDate: string;
    kickoffTime: string;
    venue: Venue;
    homeTeam: Team;
    awayTeam: Team;
    goals?: FixtureGoals;
}

export interface FixtureGoals{
    home: number | null;
    away: number | null;
}

export interface Venue{
    name: string;
    city: string;
}

export interface Team{
    name: string;
    short?: string;
    teamId: number;
    logoUrl: string;
}