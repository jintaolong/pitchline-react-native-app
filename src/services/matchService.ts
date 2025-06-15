import axios from "axios";
import { FixtureResponse } from "../dtos/Fixtures";
import log from "../utils/logger";

export const getMatchLit = async (daysAhead: number): Promise<FixtureResponse[]> => {
  try {
    log.debug(`Fetching match list for the next ${daysAhead} days`);
    const response = await axios.get<FixtureResponse[]>(
        `https://plapi.mynetworkplace.com/upcoming-matches/${daysAhead.toString()}`,
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