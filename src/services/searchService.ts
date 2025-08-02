import axios from 'axios';
import log from '../utils/logger';
import { SearchItemDto } from '../dtos/SearchTerms';

const API_BASE_URL = 'https://your-api-base-url.com'; // Replace with your actual API base URL


export async function fetchTopbarSearchOptions(keyword: string): Promise<SearchItemDto[]> {
    // log.debug(`Fetching search options for keyword: ${keyword}`);
    try {
        const response = await axios.get(
            `https://plapi.mynetworkplace.com/search/${encodeURIComponent(keyword)}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        )
        if (response.status === 200 && response.data) {
            // log.debug(`Search options fetched successfully for keyword: ${keyword}`);
            // Assuming the response data is in the format of PlayerDataDto
            // log.debug(`Search options: ${JSON.stringify(response.data)}`);
            return response.data as SearchItemDto[];
        }
        else {
            log.debug(`No search options found for keyword: ${keyword}`);
            return [];
        }
    } catch(error){
        log.error(`Error fetching search options for keyword: ${keyword}`, error);
        return [];
    }
}