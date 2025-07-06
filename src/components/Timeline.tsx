import { View, Text, Image, StyleSheet } from "react-native";
import { Fixture } from "../models/Fixtures";
import { MatchEvent } from "../models/Events";
import log from "../utils/logger";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MatchEventDetail, MatchEventType } from "../enums";

const renderEventRow = (event: MatchEvent, index: number) => {
    const playerImage = event.player?.image || null;
    const mainText = event.event.type === MatchEventType.VAR ? 
      event.event.details : event.player?.name || '';
    const supportText = event.event.type === MatchEventType.VAR ?
      event.player?.name || '' : event.supportPlayer?.name || '' ;
    // const mainText = event.player?.name || '';
    // const supportText = 
      // event.supportPlayer?.name || '' : '';
    // log.debug("Rendering event row", { event, playerImage });
    return (
        <View
        key={`${event.time}-${event.event}-${index}`}
        style={[
            styles.timelineEvent
        ]}
        >
        {/* Home team event description (left) */}
                {/* Away team event description (right) */}
          <View
            style={{
              flex: 1,
              // alignItems: event.team === 'home' ? 'center' : 'flex-end',
              // alignContent: event.team === 'home' ? 'center' : 'flex-end',
              flexDirection: 'row-reverse',
            }}
          >
            {event.team === 'home' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {mainText ? (
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <Text style={[styles.eventDescription, { fontSize: 16 }]}>
                      {mainText}
                    </Text>
                    {supportText ? (
                      <Text style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 2 }}>
                      {supportText}
                      </Text>
                    ) : null}
                    </View>
                ) : null
                }
              </View>
            ) : (
              <Text style={[styles.eventTime, { 
                alignSelf: 'flex-end', 
                textAlign: 'right',
              }]}>{event.time}</Text>
            )}
          </View>
          
          {/* Event icon and axis */}
          <View style={{ alignItems: 'center', width: 40 }}>
              {/* <Text style={styles.eventTime}>{event.time}</Text> */}
              <View style={styles.eventAxis} />
              <View style={[styles.eventIcon, { alignSelf: 'center' }]}>
              {playerImage ? (
                <Image source={{ uri: playerImage }} style={{ width: 20, height: 20, borderRadius: 10 }} />
              ) : (
                <MaterialCommunityIcons
                  name={
                    event.event.type === MatchEventType.Goal
                      ? "soccer"
                      : event.event.type === MatchEventType.Card && event.event.details === MatchEventDetail.YellowCard
                      ? "card"
                      : event.event.type === MatchEventType.Card && event.event.details === MatchEventDetail.RedCard
                      ? "card"
                      : event.event.type === MatchEventType.Substitution
                      ? "swap-horizontal"
                      : event.event.type === MatchEventType.Penalty
                      ? "penalty"
                      : event.event.type === MatchEventType.Offside
                      ? "arrow-left-right"
                      : event.event.type === MatchEventType.VAR
                      ? "video-check"
                      : "alert-circle"
                  }
                  size={25}
                  color={
                    event.event.type === "Card" && event.event.details === "Yellow Card"
                      ? "#FFD600"
                      : event.event.type === "Card" && event.event.details === "Red Card"
                      ? "#FF1744"
                      : "#374151"
                  }
                />
              )}
              </View>
              <View style={styles.eventAxis} />
          </View>

          <View
            style={{
              flex: 1,
              // alignItems: event.team === 'away' ? 'center' : 'flex-start',
              flexDirection: 'row',
            }}
          >
            {event.team === 'away' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {mainText ? (
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
                      <Text style={[styles.eventDescription, { fontSize: 16 }]}>
                        {mainText}
                      </Text>
                      {supportText ? (
                        <Text style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 2 }}>
                        {supportText}
                        </Text>
                      ) : null}
                    </View>
                ) : null
                }
              </View>
            ) : (
              <Text style={[styles.eventTime, { 
                textAlign: 'left',
              }]}>{event.time}</Text>
            )}
          </View>
        </View>
    );
}

const PitchLineTimeline = ({matchEvents}: {matchEvents: MatchEvent[]}) => {
//   log.debug("Rendering PitchLineTimeline", { fixture, matchEvents });

  return (
          <View style={styles.section}>
            <View style={styles.timeline}>
              {matchEvents.map((event, index) => renderEventRow(event, index))}
            </View>
        </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  timeline: {
    gap: 7,
  },
  timelineEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 12,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 40,
  },
  eventIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIconText: {
    fontSize: 12,
  },
  eventDescription: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  eventAxis: {
    width: 2,
    height: 4, // smaller dash height
    backgroundColor: '#D1D5DB',
    marginVertical: 1, // less vertical margin for compactness
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB'
  }
});

export default PitchLineTimeline;