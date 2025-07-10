import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_KEY = 'user_favourites';

export type FavouriteType = 'team' | 'league' | 'player';

export type Favourite = {
  id: number;
  type: FavouriteType;
};

export async function getFavourites(): Promise<Favourite[]> {
  const json = await AsyncStorage.getItem(FAV_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addFavourite(fav: Favourite) {
  const favs = await getFavourites();
  const exists = favs.some(f => f.id === fav.id && f.type === fav.type);
  if (!exists) {
    await AsyncStorage.setItem(FAV_KEY, JSON.stringify([...favs, fav]));
  }
}

export async function removeFavourite(fav: Favourite) {
  const favs = await getFavourites();
  const filtered = favs.filter(f => !(f.id === fav.id && f.type === fav.type));
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(filtered));
}

export async function isFavourite(fav: Favourite): Promise<boolean> {
  const favs = await getFavourites();
  return favs.some(f => f.id === fav.id && f.type === fav.type);
}