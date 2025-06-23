import axios from "axios";
import { ResultsDto } from "../dtos/Results";
import log from "../utils/logger";
import { H2HStatsDto } from "../dtos/Stats";

export const getH2HResults = async (homeId: number, awayId: number): Promise<ResultsDto | null> => {
    log.debug(`Fetching H2H results for ${homeId} vs ${awayId}`);
    homeId = 1;
    awayId = 2;
    try {
        const response = await axios.get<ResultsDto[]>(
            `https://plapi.mynetworkplace.com/h2hfull?id1=${homeId}&id2=${awayId}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );
        if (response.status == 200){
            // log.debug(response.data);
            if (response.data.length >= 1){
                return response.data[0]
            }
        }
        log.debug(`No h2h results available beteween ${homeId} and ${awayId}`);
        return null
    }
    catch (error) {
        log.error(`Failed to get H2H results:`, error);
        return null;
    }
}

export const getH2HStats = async (homeId: number, awayId: number, window: number): Promise<H2HStatsDto[]> => {
    homeId = 33;
    awayId = 42;
    // window = 24;
    log.debug(`Fetching H2H stats for ${homeId} vs ${awayId} in past ${window} months`);
    log.debug(`Pinging:: https://plapi.mynetworkplace.com/h2hstats?id1=${homeId}&id2=${awayId}&year=${Math.round(window / 12)}`);
    try {
        const response = await axios.get<H2HStatsDto[]>(
            `https://plapi.mynetworkplace.com/h2hstats?id1=${homeId}&id2=${awayId}&year=${Math.round(window / 12)}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );
        if (response.status === 200 && response.data) {
            return response.data;
        }
        log.debug(`No h2h stats available between ${homeId} and ${awayId}`);
        return [];
    } catch (error) {
        log.error(`Failed to get H2H stats:`, error);
        return [];
    }
};