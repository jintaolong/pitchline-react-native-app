export interface Fixture{
    league: string;
    kickoffDate: string;
    kickoffTime: string;
    venue: string;
    homeTeam: Team;
    awayTeam: Team;
}

export interface Team{
    name: string;
    short?: string;
    teamId: number;
    logoUrl: string;
}