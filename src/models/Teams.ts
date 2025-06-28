export interface Team{
    id: number;
    name: string;
    logo?: string;
}

export interface RecentFixture{
    result: 'W' | 'D' | 'L' | 'O';
    competition: string;
    fixtureId: number;
    home: Team;
    away: Team;
    date: string;
}