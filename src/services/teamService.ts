import axios from "axios";
import { ResultsDto } from "../dtos/Results";
import log from "../utils/logger";

export const getH2HResults = async (homeId: number, awayId: number): Promise<ResultsDto[]> => {
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
            log.debug(response.data);
            return response.data
        }
        log.debug(`Cannot get H2H results between ${homeId} and ${awayId}`);
        return [];
    }
    catch (error) {
        log.error(`Failed to get H2H results:`, error);
        return [];
    }
}