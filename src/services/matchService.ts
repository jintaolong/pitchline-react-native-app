import axios from "axios";
import { FixtureResponse } from "../dtos/Fixtures";
import log from "../utils/logger";

export const getMatchLit = async (searchDate: string): Promise<FixtureResponse[]> => {
  // 
  try {
    log.debug(`Fetching match list for ${searchDate}`);
    const response = await axios.get<FixtureResponse[]>(
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
    const resp = response.data.map((item: any) => {
        return item as FixtureResponse;
    });
    log.debug(`Successfully fetched ${resp.length} matches`);
    return resp;
  } catch (error) {
    log.error("Failed to fetch match list:", error);
    return [];
  }
}