// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Favourite, FavouriteType, addFavourite, removeFavourite } from '../utils/follow';
// import log from '../utils/logger';

// const MatchCardHeader = ({ section: { id, title } }) => {
//     let favIconName = favouriteLeagues[Number(id)] ? 'star' : 'star-outline';
//     return (
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20, marginBottom: 8 }}>
//         <Text style={{ fontWeight: '500', fontSize: 13, color: '#666', flex: 1 }}>{title}</Text>
//         <TouchableOpacity
//             onPress={async () => {
//             // Import followLeague util function
//             // const { followLeague } = await import('../utils/follow');
//             // Find the groupId for this title
//             // const groupId = Object.keys(allGroupedFixtures).find(
//             //   id => allGroupedFixtures[Number(id)].name === title
//             // );
//             let fav = {
//                 id: Number(id),
//                 type: 'league' as FavouriteType,
//             } as Favourite
//             if (!favouriteLeagues[Number(id)]) {
//                 addFavourite(fav).then(() => {
//                 log.debug(`Added ${title} to favourites`);
//                 // Turn the star icon into a filled star
//                 setFavouriteLeagues(prev => ({ ...prev, [Number(id)]: true }));
//                 favIconName = 'star';
//                 });
//             } else {
//                 removeFavourite(fav).then(() => {
//                 log.debug(`Removed ${title} from favourites`);
//                 // Turn the star icon into an outline star
//                 setFavouriteLeagues(prev => ({ ...prev, [Number(id)]: false }));
//                 favIconName = 'star-outline';
//                 });
//             }
//             }}
//             style={{ padding: 8 }}
//         >
//             <MaterialCommunityIcons name={favIconName} size={24} color={PRIMARY_COLOR} />
//         </TouchableOpacity>
//         </View>
//     );
// };

// export default MatchCardHeader;
