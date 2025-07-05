import { FixtureResponseDto } from "../dtos/Fixtures";
import { LineupDto } from "../dtos/Lineups";
import { TeamMatchStatDto } from "../dtos/Stats";
import { MatchStatType } from "../enums";
import { Fixture, FixtureGoals, Team, Venue } from "../models/Fixtures";
import { Lineup, LineupPlayer, LineupPlayerGrid } from "../models/Lineups";
import { MatchStatsDetail } from "../models/Stats";
import log from "./logger";

export const fixtureDtoToFixture = (data: FixtureResponseDto) => {
    const kickoffDateObj = new Date(data.fixture.fixture.date);
    return {
        league: data.fixture.league.name,
        kickoffDate: kickoffDateObj.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        }).replace(/,/g, ''),
        kickoffTime: kickoffDateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true
        }),
        venue: {
        name: data.fixture.fixture.venue.name,
        city: data.fixture.fixture.venue.city,
        } as Venue,
        homeTeam: {
        name: data.fixture.teams.home.name,
        teamId: data.fixture.teams.home.id,
        logoUrl: data.fixture.teams.home.logo
        } as Team,
        awayTeam: {
        name: data.fixture.teams.away.name,
        teamId: data.fixture.teams.away.id,
        logoUrl: data.fixture.teams.away.logo
        } as Team,
        goals: {
            home: data.fixture.goals.home,
            away: data.fixture.goals.away            
        } as FixtureGoals
    } as Fixture;
}


export const lineUpDtoToLineupPlayer = (data: LineupDto) => {
    // return data.startXI.map(player => ({
    //     number: player.player.number,
    //     name: player.player.name
    // } as LineupPlayer));
    // log.debug("Mapping lineup data to LineupPlayer");
    // log.debug("Lineup data: ", data);
    return {
        teamId: data.team.id,
        teamName: data.team.name,
        teamLogo: data.team.logo,
        players: data.startXI.map(player => ({
            id: player.player.id,
            name: player.player.name,
            number: player.player.number || 0,
            photo: null,
            position: player.player.pos || null,
            grid: player.player.grid ? {
                row: parseInt(player.player.grid.split(':')[0]) || null,
                col: parseInt(player.player.grid.split(':')[1]) || null
            } as LineupPlayerGrid : null
        } as LineupPlayer)),
        formation: data.formation
    } as Lineup;
}

export const teamMatchStatDtoToMatchStatsDetail = (data: TeamMatchStatDto) => {
    let ballPossessionStr = data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.BallPossession)?.value || '0%';
    let ballPossession = typeof ballPossessionStr === 'string' && ballPossessionStr.endsWith('%')
        ? parseFloat(ballPossessionStr)
        : 0;
    let passesPercentageStr = data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.PassesPercentage)?.value || '0%';
    let passesPercentage = typeof passesPercentageStr === 'string' && passesPercentageStr.endsWith('%')
        ? parseFloat(passesPercentageStr) / 100
        : 0;

    return {
        ballPossession: ballPossession,
        shotsInsideBox: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.ShotsInsideBox)?.value || 0,
        shotsOutsideBox: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.ShotsOutsideBox)?.value || 0,
        fouls: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.Fouls)?.value || 0,
        cornerKicks: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.CornerKicks)?.value || 0,
        offsides: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.Offsides)?.value || 0,
        yellowCards: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.YellowCards)?.value || 0,
        redCards: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.RedCards)?.value ?? null,
        goalkeeperSaves: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.GoalkeeperSaves)?.value || 0,
        totalPasses: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.TotalPasses)?.value || 0,
        passesAccurate: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.PassesAccurate)?.value || 0,
        passesPercentage: passesPercentage,
        expectedGoals: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.ExpectedGoals)?.value || '0',
        goalsPrevented: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.GoalsPrevented)?.value || 0,
        shotsOnGoal: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.ShotsOnGoal)?.value || 0,
        shotsOffGoal: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.ShotsOffGoal)?.value || 0,
        totalShots: data.statistics.find(stat => stat.type.toLowerCase() === MatchStatType.TotalShots)?.value || 0,
    } as MatchStatsDetail
}