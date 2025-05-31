export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number }; // Example: route with params
  Profile: { userId: string };
};