import axios from "axios";
import { PlayerDataDto } from "../dtos/Players";
import log from "../utils/logger";

export const getPlayerDetail = async (playerId: number): Promise<PlayerDataDto | null> => {
    log.debug(`Fetching player details for player ID: ${playerId}`);
    try {
        const response = await axios.get(
            `https://plapi.mynetworkplace.com/player/${playerId}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        )
        if (response.status === 200 && response.data) {
            log.debug(`Player details fetched successfully for player ID ${playerId}`);
            // Assuming the response data is in the format of PlayerDataDto
            log.debug(`Player details: ${JSON.stringify(response.data)}`);
            return response.data as PlayerDataDto;
        }
        else {
            log.debug(`No player details found for player ID ${playerId}`);
            return null;
        }
    } catch(error){
        log.error(`Error fetching player details for player ID ${playerId}:`, error);
        return null;
    }
}