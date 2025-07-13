import React from 'react';
import { TouchableOpacity, View, Image, Text } from "react-native";
import { Team } from '../models/Teams';

export interface TeamCardTeam{
    id: number;
    name?: string;
    logo?: string;
}

const TeamCard = ({ team, onPress }: { team: TeamCardTeam; onPress: (team: TeamCardTeam) => void }) => {

    return (
    <TouchableOpacity
    onPress={() => onPress(team)}
    activeOpacity={0.7}
    >
    <View
        style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: 3,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
        }}
    >
        <Image
            source={{ uri: team.logo }}
            style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 16,
            backgroundColor: '#eee',
        }}
        resizeMode="contain"
        />
        <Text
        style={{
        fontSize: 12,
        fontWeight: '600',
        color: '#222',
        flexShrink: 1,
        }}
        numberOfLines={1}
        >
        {team.name}
        </Text>
    </View>
    </TouchableOpacity>
);
}

export default TeamCard;