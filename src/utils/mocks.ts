import { Player, PlayerStats } from "../models/Players";

export const mockPlayer = (): Player => {
    return {
        info: {
            name: 'Lionel Messi',
            age: 34,
            position: 'Forward',
            nationality: 'Argentinian',
            height: '1.70m',
            weight: '72kg',
            photo: 'https://example.com/messi.jpg',
            birth: {
                date: '1987-06-24',
                place: 'Rosario',
                country: 'Argentina'
            },
            teams: [],
            leagues: [],
            footballAPRating: {
                overall: 94,
                potential: 94,
                season: new Date().getFullYear(),
                league: {
                    id: 1,
                    name: 'Ligue 1',
                    logo: 'https://example.com/ligue1.jpg',
                    country: 'France',
                    flag: 'https://example.com/france_flag.jpg',
                    season: new Date().getFullYear(),
                },
            },
        },
        careerTimeline: [],
        stats: {
            games: {
                appearences: 30,
                lineups: 25,
                minutes: 2250,
                number: 10,
                position: 'Forward',
                rating: 8.5,
                captain: true,
            },
            substitutes: {
                in: 5,
                out: 10,
                bench: 2,
            },
            shots: {
                total: 100,
                on: 60,
            },
            goals: {
                total: 30,
                assists: 12,
            },
            passes: {
                total: 2000,
                key: 80,
            },
            tackles: {
                total: 40,
                successful: 30,
            },
            duels: {
                total: 150,
                won: 100,
            },
            dribbles: {
                total: 120,
                successful: 90,
            },
            fouls: {
                total: 15,
                committed: 10,
            },
            cards: {
                yellow: 3,
                red: 0,
            },
            penalty: {
                won: 5,
                scored: 4,
                missed: 1,
            },
        } as PlayerStats,
    };
}
