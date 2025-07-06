export interface PlayerTeam {
    id: number;
    name: string;
    logo?: string;
}

export interface PlayerLeague{
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
}

export interface PlayerRating{
    season: number | string;
    league: PlayerLeague;
    overall: number;
    potential?: number;
}

export interface PlayerInfo{
    name: string;
    age: number;
    nationality: string;
    position: string;
    height: string;
    weight: string;
    photo: string;
    birth: {
        date: string;
        place: string;
        country: string;
    };
    teams: PlayerTeam[];
    leagues: PlayerLeague[];
    footballAPRating: PlayerRating;
    // footballAPRating?: number | string; // Assuming this is a number, adjust if needed
}

// export interface PlayerCareerPeriod{
//     start: string;
//     end: string;
// }

export interface PlayerStats{
    substitutes: {
        in: number;
        out: number;
        bench: number;
    };
    shots: {
        total: number | null;
        on: number | null;
    };
    goals: {
        total: number | null;
        assists: number | null;
    };
    passes: {
        total: number | null;
        key: number | null;
    };
    tackles: {
        total: number | null;
        successful: number | null;
    };
    duels: {
        total: number | null;
        won: number | null;
    };
    dribbles: {
        total: number | null;
        successful: number | null;
    };
    fouls: {
        total: number | null;
        committed: number | null;
    };
    cards: {
        yellow: number | null;
        red: number | null;
    };
    penalty: {
        won: number | null;
        scored: number | null;
        missed: number | null;
    };
}

export interface PlayerCareer {
    team: PlayerTeam;
    start: string;
    end?: string;
    // period: PlayerCareerPeriod;
    isActive: boolean;
}

export interface PlayerAchievement {
    title: string;
    type: string;
    description?: string;
    icon: string;
    color: string;
    count: number;
    subtitle?: string;
}

export interface Player {
    info: PlayerInfo;
    // team: PlayerTeam;
    careerTimeline?: PlayerCareer[];
    achievements?: PlayerAchievement[];
    stats: PlayerStats;
    // radarAttributes: {
    //     attribute: string;
    //     value: number;
    // }[];
}
