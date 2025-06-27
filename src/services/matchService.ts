import axios from "axios";
import { FixtureResponseDto } from "../dtos/Fixtures";
import log from "../utils/logger";
import { LineupsResponseDto } from "../dtos/Lineups";
import { EventsResponseDto } from "../dtos/Events";
import { MatchStatDto } from "../dtos/Stats";

export const getMatchLit = async (searchDate: string): Promise<FixtureResponseDto[]> => {
  // 
  try {
    log.debug(`Fetching match list for ${searchDate}`);
    const response = await axios.get<FixtureResponseDto[]>(
        `https://plapi.mynetworkplace.com/matches-by-date/${searchDate}`,
        // `https://plapi.mynetworkplace.com/today-matches/`,
        {
            headers: {
                "Accept": "application/json"
            }
        }
    );
    log.debug(`Received response with status: ${response.status}`);
    if (!response.status || response.status !== 200) {
        log.error(`Error fetching match list: ${response.statusText}`);
        return [];
    }
    // TOOD: remove max 50 cap
    const resp = response.data.slice(0, 50).map((item: any) => {
      return item as FixtureResponseDto;
    });
    log.debug(`Successfully fetched ${resp.length} matches`);
    return resp;
  } catch (error) {
    log.error("Failed to fetch match list:", error);
    return [];
  }
}


export const getFixture = async (fixtureId: number): Promise<FixtureResponseDto | null> => {
  try{
    const response = await axios.get<FixtureResponseDto[]>(
      `https://plapi.mynetworkplace.com/fixture/${fixtureId}`,
      {
          headers: {
              "Accept": "application/json"
          }
      }
    );
    if (response.status === 200){
      if (response.data.length == 1){
        return response.data[0];
      } else{
        log.debug(`More than one fixture is found with id: ${fixtureId}`);
        log.debug(`Returning first one`);
        return response.data[0];
      }
    } else{
      if(!response){
        log.error(`Failed to get fixture. Something wrong with network`);
      }else{
        if (response.status == 404){
          log.info(`Fixture not found`);
        }
      }
      return null;
    }
  }catch (error){
    log.error(`Failed to get fixture with id ${fixtureId}: `, error);
    return null;
  }
}

// export const getMatchDetails = async (fixtureId: number): Promise<FixtureResponse | null> => {
  export const getMatchLineups = async (fixtureId: number): Promise<LineupsResponseDto | null> => {
    fixtureId = 100; // fix it for now for testing
    try {
      log.debug(`Fetching lineups for fixture ID: ${fixtureId}`);
      const response = await axios.get<LineupsResponseDto>(
        `https://plapi.mynetworkplace.com/lineups/${fixtureId}`,
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );
      log.debug(`Received response with status: ${response.status}`);
      if (!response.status || response.status !== 200) {
        if (response.status && response.status === 404){
          log.info(`No line-up info found for ${fixtureId}`);
          return null;
        }
        log.error(`Error fetching lineups: ${response.statusText}`);
        return null;
      }
      return response.data;
    } catch (error) {
      log.error("Failed to fetch lineups:", error);
      return null;
    }
  }

  export const getEvents = async (fixtureId: number): Promise<EventsResponseDto | null> => {
    fixtureId = 100;
    try {
      log.debug(`Fetching events for fixture ID: ${fixtureId}`);
      const response = await axios.get<EventsResponseDto>(
        `https://plapi.mynetworkplace.com/events/${fixtureId}`,
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );
      log.debug(`Received response with status: ${response.status}`);
      if (!response.status || response.status !== 200) {
        if (response.status && response.status === 404) {
          log.info(`No events info found for ${fixtureId}`);
          return null;
        }
        log.error(`Error fetching events: ${response.statusText}`);
        return null;
      }
      return response.data;
    } catch (error) {
      log.error("Failed to fetch events:", error);
      return null;
    }
  }

  export const getFixtureStats = async (fixtureId: number): Promise<MatchStatDto | null> => {
    fixtureId = 1208372;
    try {
      log.debug(`Fetching stats for fixture ID: ${fixtureId}`);
      const response = await axios.get<MatchStatDto>(
        `https://plapi.mynetworkplace.com/fixture-stats/${fixtureId}`,
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );
      log.debug(`Received response with status: ${response.status}`);
      if (!response.status || response.status !== 200) {
        if (response.status && response.status === 404) {
          log.info(`No stats info found for ${fixtureId}`);
          return null;
        }
        log.error(`Error fetching stats: ${response.statusText}`);
        return null;
      }
      // log.debug(response.data);
      return response.data;
    } catch (error) {
      log.error("Failed to fetch stats:", error);
      return null;
    }
  }