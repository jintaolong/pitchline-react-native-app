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
}

// export interface PlayerCareerPeriod{
//     start: string;
//     end: string;
// }

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
    // radarAttributes: {
    //     attribute: string;
    //     value: number;
    // }[];
}
