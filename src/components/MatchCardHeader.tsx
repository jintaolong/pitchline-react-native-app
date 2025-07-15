import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Favourite, FavouriteType, addFavourite, removeFavourite } from '../utils/follow';
import log from '../utils/logger';
import { colors, globalStyles } from '../styles/globalStyles';

export interface MatchCardHeaderProps {
    section: {
        id: number;
        title: string;
        type: 'league' | 'team';
    };
    favourites: Favourite[];
    OnSelect: (favourites: Favourite) => void;
    OnDeselect: (favourites: Favourite) => void;
}

const MatchCardHeader = ({ section: { id, title, type }, OnSelect, OnDeselect, favourites }: MatchCardHeaderProps) => {
    let favIconName = favourites.find(fav => fav.id === id && fav.type === type) ? 'bell-minus' : 'bell-plus-outline';
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20, marginBottom: 8 }}>
        <Text style={{ fontWeight: '500', fontSize: 13, color: '#666', flex: 1 }}>{title}</Text>
        { id !== -1 && (
        
        <TouchableOpacity
            onPress={async () => {
            // Import followLeague util function
            // const { followLeague } = await import('../utils/follow');
            // Find the groupId for this title
            // const groupId = Object.keys(allGroupedFixtures).find(
            //   id => allGroupedFixtures[Number(id)].name === title
            // );
            let fav = {
                id: id,
                type: type as FavouriteType,
            } as Favourite
            if (!favourites.find(fav => fav.id === id && fav.type === type)) {
                addFavourite(fav).then(() => {
                log.debug(`Added ${title} to favourites`);
                // Turn the star icon into a filled star
                OnSelect(fav);
                favIconName = 'bell-minus';
                });
            } else {
                removeFavourite(fav).then(() => {
                log.debug(`Removed ${title} from favourites`);
                // Turn the star icon into an outline star
                OnDeselect(fav);
                favIconName = 'bell-plus-outline';
                });
            }
            }}
            style={{
              padding: 0,
              marginRight: 15,
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
              width: 30,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            <MaterialCommunityIcons name={favIconName} size={18} color={colors.primary} />
        </TouchableOpacity>
        )}
        </View>
    );
};

export default MatchCardHeader;
