export interface EventTimeDto {
    elapsed: number;
    extra: number | null;
}

export interface TeamDto {
    id: number;
    name: string;
    logo: string;
}

export interface PlayerDto {
    id: number;
    name: string;
}

export interface AssistDto {
    id: number | null;
    name: string | null;
}

export interface EventDto {
    time: EventTimeDto;
    team: TeamDto;
    player: PlayerDto;
    assist: AssistDto;
    type: string;
    detail: string;
    comments: string | null;
}

export interface EventsResponseDto {
    _id: string;
    fixture_id: number;
    events: EventDto[];
}
