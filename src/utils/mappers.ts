import { FixtureResponseDto } from "../dtos/Fixtures";
import { LineupDto } from "../dtos/Lineups";
import { TeamMatchStatDto } from "../dtos/Stats";
import { Fixture, FixtureGoals, Team, Venue } from "../models/Fixtures";
import { LineupPlayer } from "../models/Lineups";
import { MatchStatsDetail } from "../models/Stats";

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
    return data.startXI.map(player => ({
        number: player.player.number,
        name: player.player.name
    } as LineupPlayer));
}

export const teamMatchStatDtoToMatchStatsDetail = (data: TeamMatchStatDto) => {
    let ballPossessionStr = data.statistics.find(stat => stat.type.toLowerCase() === 'ball possession')?.value || '0%';
    let ballPossession = typeof ballPossessionStr === 'string' && ballPossessionStr.endsWith('%')
        ? parseFloat(ballPossessionStr)
        : 0;
    let passesPercentageStr = data.statistics.find(stat => stat.type.toLowerCase() === 'passes %')?.value || '0%';
    let passesPercentage = typeof passesPercentageStr === 'string' && passesPercentageStr.endsWith('%')
        ? parseFloat(passesPercentageStr) / 100
        : 0;
    return {
        ballPossession: ballPossession,
        shotsInsideBox: data.statistics.find(stat => stat.type.toLowerCase() === 'shots insidebox')?.value || 0,
        shotsOutsideBox: data.statistics.find(stat => stat.type.toLowerCase() === 'shots outsidebox')?.value || 0,
        fouls: data.statistics.find(stat => stat.type.toLowerCase() === 'fouls')?.value || 0,
        cornerKicks: data.statistics.find(stat => stat.type.toLowerCase() === 'corner kicks')?.value || 0,
        offsides: data.statistics.find(stat => stat.type.toLowerCase() === 'offsides')?.value || 0,
        yellowCards: data.statistics.find(stat => stat.type.toLowerCase() === 'yellow cards')?.value || 0,
        redCards: data.statistics.find(stat => stat.type.toLowerCase() === 'red cards')?.value ?? null,
        goalkeeperSaves: data.statistics.find(stat => stat.type.toLowerCase() === 'goalkeeper saves')?.value || 0,
        totalPasses: data.statistics.find(stat => stat.type.toLowerCase() === 'total passes')?.value || 0,
        passesAccurate: data.statistics.find(stat => stat.type.toLowerCase() === 'passes accurate')?.value || 0,
        passesPercentage: passesPercentage,
        expectedGoals: data.statistics.find(stat => stat.type.toLowerCase() === 'expected_goals')?.value || '0',
        goalsPrevented: data.statistics.find(stat => stat.type.toLowerCase() === 'goals_prevented')?.value || 0,
        shotsOnGoal: data.statistics.find(stat => stat.type.toLowerCase() === 'shots on goal')?.value || 0,
        shotsOffGoal: data.statistics.find(stat => stat.type.toLowerCase() === 'shots off goal')?.value || 0,
        totalShots: data.statistics.find(stat => stat.type.toLowerCase() === 'total shots')?.value || 0,
    } as MatchStatsDetail
}