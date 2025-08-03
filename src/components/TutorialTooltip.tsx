import { View, Text } from "react-native"
import React from "react";
import { StyleSheet } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { TooltipProps, useCopilot } from "react-native-copilot";


const TutorialTooltip: React.FC<TooltipProps> = ({
//   isFirstStep,
//   isLastStep,
//   currentStep,
  labels,
//   handleNext,
//   handlePrev,
//   handleStop
}) => {
  const { currentStep, isFirstStep, isLastStep, goToNext, goToPrev, stop } = useCopilot();

  return (
    <View style={styles.tooltipContainer}>
      <Text style={styles.tooltipText}>{currentStep?.text}</Text>

      <View style={styles.tooltipNavContainer}>
        {!isFirstStep && (
          <Text
            style={styles.tooltipNavText}
            onPress={goToPrev}
          >
            {labels.previous}
          </Text>
        )}

        {!isLastStep ? (
          <Text
            style={styles.tooltipNavText}
            onPress={goToNext}
          >
            {labels.next}
          </Text>
        ) : (
          <Text
            style={styles.tooltipNavText}
            onPress={stop}
          >
            {labels.finish}
          </Text>
        )}
      </View>
    </View>
  );
};

export default TutorialTooltip;

const styles = StyleSheet.create({
    tooltipContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16, // Add padding for overall spacing
        // elevation: 4,
        // marginBottom: 24, // Add space from bottom edge
        minWidth: 220,
    },
    tooltipText: {
        color: '#333',
        fontSize: 15,
        // marginBottom: 18, // Space between text and nav
        textAlign: 'center',
    },
    tooltipNavContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8, // Space above nav buttons
    },
    tooltipNavText: {
        color: '#6366F1',
        fontSize: 15,
        fontWeight: '600',
        paddingHorizontal: 12,
        paddingVertical: 6,
    }
})
