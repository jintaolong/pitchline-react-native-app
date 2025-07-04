import { View, Text, Image, StyleSheet } from "react-native";
import { Fixture } from "../models/Fixtures";
import { MatchEvent } from "../models/Events";
import log from "../utils/logger";


const renderEventRow = (event: MatchEvent, index: number) => {
    const playerImage = event.player?.image || null;

    return (
        <View
        key={`${event.time}-${event.event}-${event.icon}-${event.color}-${index}`}
        style={[
            styles.timelineEvent,
            { justifyContent: 'space-between', alignItems: 'center' }
        ]}
        >
        {/* Home team event description (left) */}
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
            {event.team === 'home' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Text style={[styles.eventDescription, { flex: 1 }]}>{event.event}</Text>
                    <Text style={[styles.eventTime, { width: 36, textAlign: 'right', marginRight: -10 }]}>{event.time}</Text>
                </View>
            )}
        </View>

        {/* Timeline middle: time, dashed line, icon or player image */}
        <View style={{ alignItems: 'center', width: 60 }}>
            {/* <Text style={styles.eventTime}>{event.time}</Text> */}
            <View style={styles.eventAxis} />
            <View style={[styles.eventIcon, { backgroundColor: event.color, alignSelf: 'center' }]}>
            {playerImage ? (
                <Image source={{ uri: playerImage }} style={{ width: 20, height: 20, borderRadius: 10 }} />
            ) : (
                <Text style={styles.eventIconText}>{event.icon}</Text>
            )}
            </View>
            <View style={styles.eventAxis} />
        </View>

        {/* Away team event description (right) */}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
            {event.team === 'away' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    {/* <Text style={[styles.eventDescription, { flex: 1 }]}>{event.event}</Text> */}
                    <Text style={[styles.eventTime, { width: 36, textAlign: 'left', marginLeft: -10}]}>{event.time}</Text>
                    <Text style={[styles.eventDescription, { flex: 1 }]}>{event.event}</Text>
                </View>
            
            )}
        </View>
        </View>
    );
}

const PitchLineTimeline = ({matchEvents}: {matchEvents: MatchEvent[]}) => {
//   log.debug("Rendering PitchLineTimeline", { fixture, matchEvents });

  return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Match Timeline</Text>
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
    height: 8,
    backgroundColor: '#D1D5DB',
    marginVertical: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB'
  }
});

export default PitchLineTimeline;