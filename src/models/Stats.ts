export interface Stats{
    homeWin: number;
    homeDraw: number;
    homeLost: number;
    homeGoals: number;
    awayGoals: number;
    homeShots: number;
    awayShots: number;
}

export interface MatchStatsDetail{
    shotsOnGoal: number;
    shotsOffGoal: number;
    totalShots: number;
    blockedShots: number;
    shotsInsideBox: number;
    shotsOutsideBox: number;
    fouls: number;
    cornerKicks: number;
    offsides: number;
    ballPossession: number;
    yellowCards: number;
    redCards: number;
    goalkeeperSaves: number;
    totalPasses: number;
    passesAccurate: number;
    passesPercentage: number;
    expectedGoals: string;
    goalsPrevented: number;
}

export interface MatchStats{
    home: MatchStatsDetail;
    away: MatchStatsDetail;
}

export interface WordCloudEntry {
    text: string;
    size: number;
    color: string;
}