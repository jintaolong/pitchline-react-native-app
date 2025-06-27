export type RootStackParamList = {
  Launch: undefined; // Initial screen
  Register: undefined; // Registration screen
  Login: undefined; // Login screen
  Main: undefined;
  Prematch: {fixtureId: number}; // Pre-match details screen
  Postmatch:  {fixtureId: number}; // Post-match details screen
  Inplay:  {fixtureId: number}; // In-play details screen
  TeamDetails: {teamId: number};
  PlayerDetails: {playerId: number};
};


export type BottomNavigatorStackParamList = {
  Home: undefined;
  Matches: undefined;
  Settings: undefined;
}