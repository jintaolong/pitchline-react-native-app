export interface LineupPlayerDto {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string | null;
    photo: string | null;
}

export interface LineupPlayerWrapperDto {
    player: LineupPlayerDto;
}

export interface TeamDto {
    id: number;
    name: string;
    logo: string;
    colors: string | null;
}

export interface CoachDto {
    id: number;
    name: string;
    photo: string;
}

export interface LineupDto {
    team: TeamDto;
    coach: CoachDto;
    formation: string;
    startXI: LineupPlayerWrapperDto[];
    substitutes: LineupPlayerWrapperDto[];
}

export interface LineupsResponseDto {
    _id: string;
    fixture_id: number;
    lineups: LineupDto[];
}
// export interface LineupPlayerDto {}
