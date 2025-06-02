import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';

const SettingsScreen = () => {
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [newsUpdates, setNewsUpdates] = useState(false);

  type SettingsItemProps = {
    iconName: string;
    title: string;
    hasArrow?: boolean;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    rightText?: string;
    onPress?: () => void;
    isLast?: boolean;
  };

  const SettingsItem: React.FC<SettingsItemProps> = ({ 
    iconName,
    title, 
    hasArrow = false, 
    hasSwitch = false, 
    switchValue = false, 
    onSwitchChange,
    rightText = '',
    onPress,
    isLast = false
  }) => (
    <TouchableOpacity 
      style={[styles.settingsItem, isLast && styles.lastItem]} 
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{iconName}</Text>
        </View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <View style={styles.rightContent}>
        {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
        {hasSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#E0E0E0', true: '#6C5CE7' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E0E0E0"
          />
        )}
        {hasArrow && <Text style={styles.arrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <SettingsItem
            iconName="👤"
            title="Edit Profile"
            hasArrow={true}
            onPress={() => console.log('Edit Profile pressed')}
            onSwitchChange={() => {}}
          />
          <SettingsItem
            iconName="🔒"
            title="Change Password"
            hasArrow={true}
            onPress={() => console.log('Change Password pressed')}
            onSwitchChange={() => {}}
          />
          <SettingsItem
            iconName="🌐"
            title="Linked Accounts"
            hasArrow={true}
            onPress={() => console.log('Linked Accounts pressed')}
            onSwitchChange={() => {}}
            isLast={true}
          />
        </View>

        {/* Notifications Section */}
        <SectionHeader title="Notifications" />
        <View style={styles.section}>
          <SettingsItem
            iconName="🔔"
            title="Match Alerts"
            hasSwitch={true}
            switchValue={matchAlerts}
            onPress={() => {}}
            onSwitchChange={setMatchAlerts}
          />
          <SettingsItem
            title="News Updates"
            iconName="👤"
            hasSwitch={true}
            switchValue={newsUpdates}
            onPress={() => {}}
            onSwitchChange={setNewsUpdates}
          />
          <SettingsItem
            iconName="👤"
            title="Sound and Vibration"
            hasArrow={true}
            onPress={() => console.log('Sound and Vibration pressed')}
            onSwitchChange={() => {}}
            isLast={true}
          />
        </View>

        {/* Appearance Section */}
        <SectionHeader title="Appearance" />
        <View style={styles.section}>
          <SettingsItem
            iconName="🎨"
            title="Theme"
            rightText="System Default"
            onSwitchChange={() => {}}
            onPress={() => console.log('Theme pressed')}
          />
          <SettingsItem
            title="Font Size"
            iconName="🎨"
            rightText="Medium"
            onSwitchChange={() => {}}
            onPress={() => console.log('Font Size pressed')}
            isLast={true}
          />
        </View>

        {/* Language Section */}
        <SectionHeader title="Language" />
        <View style={styles.section}>
          <SettingsItem
            iconName="🌐"
            title="App Language"
            rightText="English (US)"
            onPress={() => console.log('App Language pressed')}
            onSwitchChange={() => {}}
            isLast={true}
          />
        </View>

        {/* Privacy Section */}
        <SectionHeader title="Privacy" />
        <View style={styles.section}>
          <SettingsItem
            iconName="🔒"
            title="Privacy Policy"
            hasArrow={true}
            onSwitchChange={() => {}}
            onPress={() => console.log('Privacy Policy pressed')}
          />
          <SettingsItem
            title="Terms of Service"
            iconName="🔒"
            hasArrow={true}
            onSwitchChange={() => {}}
            onPress={() => console.log('Terms of Service pressed')}
            isLast={true}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="About" />
        <View style={styles.section}>
          <SettingsItem
            iconName="ℹ️"
            title="Version"
            rightText="1.0.0"
            onSwitchChange={() => {}}
            onPress={() => console.log('Version pressed')}
          />
          <SettingsItem
            title="Licenses"
            iconName="ℹ️"
            hasArrow={true}
            onSwitchChange={() => {}}
            onPress={() => console.log('Licenses pressed')}
            isLast={true}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  statusTime: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    fontSize: 17,
    color: '#000000',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginTop: 32,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#666666',
  },
  itemTitle: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '400',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 18,
    color: '#666666',
    marginRight: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default SettingsScreen;