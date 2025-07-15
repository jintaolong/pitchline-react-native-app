import { FixtureResponseDto } from "../dtos/Fixtures";
import { LeagueStandingDto, TeamStandingDto } from "../dtos/Leagues";
import { LineupDto } from "../dtos/Lineups";
import { TeamMatchStatDto } from "../dtos/Stats";
import { MatchStatType } from "../enums";
import { Fixture, FixtureGoals, Team, Venue, League as FixtureLeague } from "../models/Fixtures";
import { Standing } from "../models/Leagues";
import { Lineup, LineupPlayer, LineupPlayerGrid } from "../models/Lineups";
import { MatchStatsDetail } from "../models/Stats";
import {League} from "../models/Leagues";

import log from "./logger";
import { Match } from "../models/Matches";
import { Player } from "../models/Teams";
import { PlayerDto } from "../dtos/Teams";

export const fixtureDtoToFixture = (data: FixtureResponseDto) => {
    const kickoffDateObj = new Date(data.fixture.fixture.date);
    return {
        league: {
            id: data.fixture.league.id,
            name: data.fixture.league.name,
            logoUrl: ''
        } as FixtureLeague,
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


export const fixtureDtoToMatch = (fixture: FixtureResponseDto) => {
    const homeTeam = {
        id: fixture.fixture.teams.home.id,
        name: fixture.fixture.teams.home.name
    };
    const awayTeam = {
        id: fixture.fixture.teams.away.id,
        name: fixture.fixture.teams.away.name
    };
    const homeLogo = fixture.fixture.teams.home.logo ? fixture.fixture.teams.home.logo : '';
    const awayLogo = fixture.fixture.teams.away.logo ? fixture.fixture.teams.away.logo : '';
    const homeScore = fixture.fixture.goals.home ? fixture.fixture.goals.home : null;
    const awayScore = fixture.fixture.goals.away ? fixture.fixture.goals.away : null;
    const status = fixture.fixture.fixture.status.short;
    const competition = fixture.fixture.league.name || 'Unknown Competition';
    const competitionId = fixture.fixture.league.id || 0; // Assuming league ID is available
    const channel = 'Sky Sports'; // Placeholder, replace with actual channel data if available
    const viewers = '180,000'; // Placeholder, replace with actual viewers data if available
    const time = fixture.fixture.fixture.date ? new Date(fixture.fixture.fixture.date).toLocaleTimeString() : null;

    return {
        id: fixture.fixture.fixture.id,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeLogo: homeLogo,
        awayLogo: awayLogo,
        homeScore: homeScore,
        awayScore: awayScore,
        status: status,
        competition: competition,
        competitionId: competitionId,
        channel: channel,
        viewers: viewers,
        kickoffTime: fixture.fixture.fixture.date ? new Date(fixture.fixture.fixture.date) : null,
        time: time,
    } as Match;
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
            photo: player.player.photo || null,
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


export const leagueStandingDtoToLeague = (data: LeagueStandingDto) => {
    // Find the most recent update timestamp from all standings
    const allUpdates = data.standings.flatMap((group: TeamStandingDto[]) =>
        group.map((standing: TeamStandingDto) => standing.update)
    ).filter(Boolean);

    const lastUpdated = allUpdates.length > 0
        ? allUpdates.reduce((latest, curr) => (curr && latest && curr > latest ? curr : latest), allUpdates[0])
        : 'unknown';

    return {
        id: data.league.id,
        name: data.league.name,
        country: data.league.country,
        logo: data.league.logo,
        flag: data.league.flag,
        currentSeason: data.season,
        currentStandings: data.standings.map((standingGroup: TeamStandingDto[]) => {
            return standingGroup.map((standing: TeamStandingDto) => {
                return {
                    position: standing.rank,
                    team: {
                        id: standing.team.id,
                        name: standing.team.name,
                        logo: standing.team.logo,
                    },
                    group: standing.group,
                    points: standing.points,
                    form: standing.form.split(''),
                    lastUpdated: standing.update
                        ? new Date(standing.update).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
                        : 'unknown',
                } as Standing;
            });
        }),
        lastUpdated: new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    } as League;
}


export const teamPlayerDtoToTeamPlayer = (player: PlayerDto) : Player => {
    return {
        id: player.id,
        name: player.name,
        number: player.number || 0,
        position: player.position || '',
        photo: player.photo || '',
        age: player.age || 0,
        // height: player.height || ''
    } as Player;
}