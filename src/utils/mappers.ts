import { FixtureResponseDto } from "../dtos/Fixtures";
import { LineupDto } from "../dtos/Lineups";
import { Fixture, FixtureGoals, Team, Venue } from "../models/Fixtures";
import { LineupPlayer } from "../models/Lineups";

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