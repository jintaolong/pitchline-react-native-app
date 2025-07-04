export interface MatchEvent {
    time: string;
    event: string;
    icon: string;
    color: string;
    player?: LineupPlayer;
    team?: 'home' | 'away';
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
