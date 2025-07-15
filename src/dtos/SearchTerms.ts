
export type SearchItemDto = {
    id: number;
    type: string; // 'league' | 'team' | 'player'
    name: string;
    photo?: string;
    position?: string;
    nationality?: string;
    team?: string;
    country?: string;
    founded?: number;
    season?: number;
};