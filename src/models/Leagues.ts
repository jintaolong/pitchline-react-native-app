import { Team } from "./Teams";

export interface Standing{
    position: number;
    group: string;
    team: Team;
    points: number;
    form: string[];
    lastUpdated?: string;
}

export interface League{
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    currentSeason: number;
    currentStandings: Standing[][];
    lastUpdated?: string;
}
