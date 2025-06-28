export interface PlayerTeam {
    id: number;
    name: string;
    logo?: string;
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
    team: {
        id: number;
        name: string;
        logo: string;
    };
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string;
        season: number;
    };
}

export interface PlayerCareer {
    team: PlayerTeam;
    period: string;
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
    team: PlayerTeam;
    careerTimeline: PlayerCareer[];
    achievements: PlayerAchievement[];
    // radarAttributes: {
    //     attribute: string;
    //     value: number;
    // }[];
}
