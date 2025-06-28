export interface PlayerBirthDto {
    date: string;
    place: string;
    country: string;
}

export interface PlayerDto {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: PlayerBirthDto;
    nationality: string;
    height: string;
    weight: string;
    injured: boolean;
    photo: string;
}

export interface TeamDto {
    id: number;
    name: string;
    logo: string;
}

export interface LeagueDto {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
}

export interface GamesDto {
    appearences: number;
    lineups: number;
    minutes: number;
    number: number | null;
    position: string;
    rating: number | null;
    captain: boolean;
}

export interface SubstitutesDto {
    in: number;
    out: number;
    bench: number;
}

export interface ShotsDto {
    total: number | null;
    on: number | null;
}

export interface GoalsDto {
    total: number;
    conceded: number | null;
    assists: number | null;
    saves: number | null;
}

export interface PassesDto {
    total: number | null;
    key: number | null;
    accuracy: number | null;
}

export interface TacklesDto {
    total: number | null;
    blocks: number | null;
    interceptions: number | null;
}

export interface DuelsDto {
    total: number | null;
    won: number | null;
}

export interface DribblesDto {
    attempts: number | null;
    success: number | null;
    past: number | null;
}

export interface FoulsDto {
    drawn: number | null;
    committed: number | null;
}

export interface CardsDto {
    yellow: number;
    yellowred: number;
    red: number;
}

export interface PenaltyDto {
    won: number | null;
    commited: number | null;
    scored: number | null;
    missed: number | null;
    saved: number | null;
}

export interface StatisticDto {
    team: TeamDto;
    league: LeagueDto;
    games: GamesDto;
    substitutes: SubstitutesDto;
    shots: ShotsDto;
    goals: GoalsDto;
    passes: PassesDto;
    tackles: TacklesDto;
    duels: DuelsDto;
    dribbles: DribblesDto;
    fouls: FoulsDto;
    cards: CardsDto;
    penalty: PenaltyDto;
}

export interface PlayerDataDto {
    _id: string;
    player: PlayerDto;
    statistics: StatisticDto[];
}
