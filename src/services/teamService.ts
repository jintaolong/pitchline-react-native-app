import axios from "axios";
import { ResultsDto } from "../dtos/Results";
import log from "../utils/logger";

export const getH2HResults = async (homeId: number, awayId: number): Promise<ResultsDto | null> => {
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