import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import log from '../utils/logger';

const PRIMARY_COLOR = '#007AFF';
const PRIMARY_BG = '#E6F0FF';

const PERIOD_OPTIONS = [
    // { index: 0, label: '1M', value: '1 Month', valueInMonths: 1 },
    // { index: 1, label: '3M', value: '3 Months', valueInMonths: 3 },
    // { index: 2, label: '6M', value: '6 Months', valueInMonths: 6 },
    { index: 0, label: '1Y', value: '1 Year', valueInMonths: 12 },
    { index: 1, label: '2Y', value: '2 Years', valueInMonths: 24 },
    { index: 2, label: '3Y', value: '3 Years', valueInMonths: 36 },
    { index: 3, label: '5Y', value: '5 Years', valueInMonths: 60 },
    { index: 4, label: '10Y', value: '10 Years', valueInMonths: 120 },
];

// Squeezed horizontally
const ITEM_WIDTH = 28;
const ITEM_HEIGHT = 32;
const SPACING = 32;

type ValveSelectorProp = {
    onChange: (window: number) => void
}

const ValveSelector: React.FC<ValveSelectorProp> = ({onChange}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // Animate thumb position
    const animatedValue = useRef(new Animated.Value(0)).current;

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        Animated.spring(animatedValue, {
            toValue: index * (ITEM_WIDTH + SPACING),
            useNativeDriver: false,
            friction: 7,
            tension: 80,
        }).start();
        flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
        log.debug(`Current selected index ${selectedIndex}`);
        onChange(
            PERIOD_OPTIONS.filter((item) => {
                return item.index === index
            })[0].valueInMonths
        )
    };

    // Track width calculation
    const trackWidth =
        PERIOD_OPTIONS.length * ITEM_WIDTH + (PERIOD_OPTIONS.length - 1) * SPACING;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Time Period</Text>
            <View style={{ height: ITEM_HEIGHT + 60 }}>
                {/* Boxes */}
                <View style={[styles.boxRow, { width: trackWidth, left: 0 }]}>
                    {PERIOD_OPTIONS.map((item, index) => (
                        <TouchableOpacity
                            key={`${item.value}-${item.index}`}
                            activeOpacity={0.8}
                            onPress={() => handleSelect(item.index)}
                            style={{ marginRight: item.index === PERIOD_OPTIONS.length - 1 ? 0 : SPACING }}
                        >
                            <View
                                style={[
                                    styles.optionBox,
                                    {
                                        borderColor: item.index === selectedIndex ? PRIMARY_COLOR : '#B0B8C1',
                                        borderStyle: item.index === selectedIndex ? 'solid' : 'dashed',
                                        backgroundColor: item.index === selectedIndex ? PRIMARY_COLOR : '#fff',
                                        width: ITEM_WIDTH,
                                        height: ITEM_HEIGHT,
                                    },
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                {/* Animated Thumb */}
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            left: animatedValue, // Removed the +8 padding
                            backgroundColor: PRIMARY_COLOR,
                            borderColor: PRIMARY_COLOR,
                            width: ITEM_WIDTH,
                            height: ITEM_HEIGHT,
                        },
                    ]}
                    pointerEvents="none"
                />
                {/* Track */}
                <View
                    style={[
                        styles.track,
                        {
                            width: trackWidth,
                            left: 0,
                            top: ITEM_HEIGHT + 10,
                        },
                    ]}
                />
                {/* Legends */}
                <View style={[styles.legendRow, { width: trackWidth, left: 0, top: ITEM_HEIGHT + 22 }]}>
                    {PERIOD_OPTIONS.map((item, index) => (
                        <View
                            key={`${item.value}-${index}`}
                            style={{ width: ITEM_WIDTH, alignItems: 'center', marginRight: index === PERIOD_OPTIONS.length - 1 ? 0 : SPACING }}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    {
                                        color: index === selectedIndex ? PRIMARY_COLOR : '#666',
                                        fontWeight: index === selectedIndex ? '700' : '500',
                                    },
                                ]}
                            >
                                {item.label}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <Text style={styles.selectedText}>
                Selected: {PERIOD_OPTIONS[selectedIndex].value}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 24,
        color: '#222',
    },
    boxRow: {
        flexDirection: 'row',
        // position: 'absolute',
        top: 28,
        zIndex: 2,
    },
    legendRow: {
        flexDirection: 'row',
        position: 'absolute',
        zIndex: 3,
    },
    optionBox: {
        borderWidth: 2,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 2,
    },
    optionText: {
        fontSize: 13,
        marginTop: 6,
    },
    thumb: {
        position: 'absolute',
        borderRadius: 8,
        borderWidth: 2,
        top: 28,
        zIndex: 1,
        opacity: 0.18,
    },
    track: {
        position: 'absolute',
        height: 4,
        borderRadius: 2,
        backgroundColor: PRIMARY_COLOR,
        opacity: 0.12,
    },
    selectedText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        marginTop: 24,
    },
});

export default ValveSelector;