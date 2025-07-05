export interface MatchEvent {
    time: string;
    event: MatchEventDetail;
    // icon: string;
    // color: string;
    player?: LineupPlayer;
    supportPlayer?: LineupPlayer;
    team?: 'home' | 'away';
}

export interface MatchEventDetail {
    type: string;
    details: string;
}

export interface LineupPlayer {
    id: number;
    name: string;
    number: number;
    image?: string;
}

export interface WordCloudWord {
    text: string;
    size: number;
    color: string;
}
