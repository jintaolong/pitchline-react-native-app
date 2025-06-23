export interface Stats{
    homeWin: number;
    homeDraw: number;
    homeLost: number;
    homeGoals: number;
    awayGoals: number;
    homeShots: number;
    awayShots: number;
}

export interface WordCloudEntry {
    text: string;
    size: number;
    color: string;
}