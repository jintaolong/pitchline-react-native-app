import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { RootStackParamList } from '../navigation/RootStackParamList';

type Props = NativeStackScreenProps<RootStackParamList, 'Launch'>;

const { width, height } = Dimensions.get('window');


const LaunchScreen = ({navigation}: Props) => {
  const [bgOpacity, setBgOpacity] = React.useState(0.15);
  const [logoTranslateY, setLogoTranslateY] = React.useState(height / 2 - 60);
  const [logoOpacity, setLogoOpacity] = React.useState(1);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
          <Image
            source={require('../../assets/splash/pitch-large.png')}
            style={{
              position: 'absolute',
              width: width * 2, // Swap width and height for rotation
              height: height * 2, // Swap width and height for rotation
              opacity: bgOpacity,
              // top: (height - width) / 2,
              // left: (width - height) / 2,
              transform: [
                { rotate: '49deg' },
              ],
            }}
            resizeMode="contain"
            blurRadius={3}
          />

          {/* Logo at the top */}
          <View style={{ marginBottom: 48, alignItems: 'center', position: 'absolute', top: logoTranslateY, opacity: logoOpacity }}>
            <Image
              source={require('../../assets/splash/splash-logo-text.png')}
              style={[styles.logoImage, { width: width * 0.7, height: 60, opacity: 0.9 }]}
              resizeMode="contain"
            />
          </View>

          {/* Login Button in the center */}
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0, position: 'absolute', top: '60%' }}>
            <TouchableOpacity
              style={[styles.loginButton, { opacity: logoOpacity }]}
              onPress={() => {
              // Trigger smooth animation
              // Animate bgOpacity, logoTranslateY, and logoOpacity over 400ms
              const start = Date.now();
              const duration = 400;
              const initialBgOpacity = bgOpacity;
              const initialLogoTranslateY = logoTranslateY;
              const initialLogoOpacity = logoOpacity;
              const targetBgOpacity = 1;
              const targetLogoTranslateY = -height * 0.5;
              const targetLogoOpacity = 0;

              function animate() {
                const now = Date.now();
                const elapsed = Math.min(now - start, duration);
                const t = elapsed / duration;

                setBgOpacity(initialBgOpacity + (targetBgOpacity - initialBgOpacity) * t);
                setLogoTranslateY(initialLogoTranslateY + (targetLogoTranslateY - initialLogoTranslateY) * t);
                setLogoOpacity(initialLogoOpacity + (targetLogoOpacity - initialLogoOpacity) * t);

                if (elapsed < duration) {
                requestAnimationFrame(animate);
                } else {
                setBgOpacity(targetBgOpacity);
                setLogoTranslateY(targetLogoTranslateY);
                setLogoOpacity(targetLogoOpacity);
                }
              }
              animate();
              // Wait for animation to finish before navigating
              setTimeout(() => navigation.navigate('Main'), 400);
              }}
            >
              <Text style={styles.loginButtonText}>
              Guest Login
              </Text>
            </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingVertical: 32,
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    width: width,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 2,
  },
  logoImage: {
    flex: 1,
    opacity: 0.8,
  },
  heroImage: {
    flex: 1,
    opacity: 0.8,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: '#6366F1',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#6366F1',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LaunchScreen;
