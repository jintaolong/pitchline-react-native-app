export interface H2HStatsDto {
    _id: string;
    season: number;
    team1_id: number;
    team2_id: number;
    home_matches: number;
    team1_goals: number;
    team2_goals: number;
    team1_wins: number;
    team2_wins: number;
    draws: number;
};

export interface TeamDto {
    id: number;
    name: string;
    logo: string;
}

export interface StatItemDto{
    type: string;
    value: string | number | null;
}

export interface TeamMatchStatDto{
    team: TeamDto;
    statistics: StatItemDto[];
}

export interface MatchStatDto {
    _id: string;
    fixture_id: number;
    statistics: TeamMatchStatDto[];
}
