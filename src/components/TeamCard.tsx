import React from 'react';
import { TouchableOpacity, View, Image, Text } from "react-native";
import { Team } from '../models/Teams';
import log from '../utils/logger';
import { Match } from '../models/Matches';

export interface TeamCardTeam{
    id: number;
    name?: string;
    logo?: string;
}

const TeamCard = ({ team, onPress, onUnfollow }: { team: Match; onPress: (team: TeamCardTeam) => void; onUnfollow: (team: TeamCardTeam) => void }) => {
    // log.debug("TeamCard", team);
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
                    marginHorizontal: 15,
                    justifyContent: 'space-between', // Add this for spacing
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image
                        source={{ uri: team.homeLogo || team.awayLogo || '' }}
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
                        {team.homeTeam.name || team.awayTeam.name || 'Unknown Team'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        paddingVertical: 6,
                        paddingHorizontal: 14,
                        backgroundColor: '#eee',
                        borderRadius: 16,
                        marginLeft: 12,
                    }}
                    onPress={() => {
                        // Add your unfollow logic here
                        onUnfollow({
                            id: team.id,
                            name: team.homeTeam.name || team.awayTeam.name || 'Unknown Team',
                            logo: team.homeLogo || team.awayLogo || ''
                        });
                    }}
                >
                    <Text style={{ color: '#d00', fontWeight: 'bold', fontSize: 12 }}>Unfollow</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

export default TeamCard;