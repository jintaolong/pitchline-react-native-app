import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type Props = StackNavigationProp<RootStackParamList, 'Launch'>;

const { width } = Dimensions.get('window');

const LaunchScreen = ({navigation}: LaunchScreenProps) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Chart Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.chartContainer}>
              <View style={[styles.bar, styles.bar1]} />
              <View style={[styles.bar, styles.bar2]} />
              <View style={[styles.bar, styles.bar3]} />
            </View>
          </View>

          {/* Main Headline */}
          <Text style={styles.title}>Unlock Your Sports Insight</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Access real-time data, strategic analysis, and match predictions.
          </Text>

          {/* Hero Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Rs0PTIplYtIR7PIaQMk3oYWadSe9xN.png' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Get Started Button */}
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText} onPress={() => {
                navigation.navigate('Register')
            }}>Get Started</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity style={styles.loginLink}>
            <Text style={styles.loginLinkText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bar: {
    borderRadius: 8,
    width: 24,
  },
  bar1: {
    height: 60,
    backgroundColor: '#8B7CF6',
  },
  bar2: {
    height: 80,
    backgroundColor: '#7C6AE8',
  },
  bar3: {
    height: 100,
    backgroundColor: '#6366F1',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width - 48,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: width - 48,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    paddingVertical: 12,
  },
  loginLinkText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LaunchScreen;