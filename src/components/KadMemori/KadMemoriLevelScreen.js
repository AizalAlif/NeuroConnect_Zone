import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av'; // Import Audio from expo-av
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const KadMemoriLevelScreen = () => {
  const navigation = useNavigation();
  const [sound, setSound] = useState();

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/button.mp3') // Path to your sound file
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Clean up the sound when the component unmounts
        }
      : undefined;
  }, [sound]);

  return (
    <ImageBackground
      source={require('../../../assets/background15.jpeg')} // Replace with your background image path
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            playSound();
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Pilih Level</Text>

        {/* Easy Level Button */}
        <TouchableOpacity
          style={styles.levelButton}
          onPress={() => {
            playSound();
            navigation.navigate('KadMemoriEasy', { level: 'Easy' });
          }}
        >
          <View style={styles.levelContent}>
            <LottieView
              source={require('../../../assets/easy.json')} // Replace with your Lottie animation path for Easy level
              autoPlay
              loop
              style={[styles.lottieIcon, styles.easyIcon]}
            />
            <Text style={styles.levelText}>Easy</Text>
          </View>
        </TouchableOpacity>

        {/* Medium Level Button */}
        <TouchableOpacity
          style={styles.levelButton}
          onPress={() => {
            playSound();
            navigation.navigate('KadMemoriMedium', { level: 'Medium' });
          }}
        >
          <View style={styles.levelContent}>
            <LottieView
              source={require('../../../assets/medium.json')} // Replace with your Lottie animation path for Medium level
              autoPlay
              loop
              style={[styles.lottieIcon, styles.mediumIcon]}
            />
            <Text style={styles.levelText}>Medium</Text>
          </View>
        </TouchableOpacity>

        {/* Hard Level Button */}
        <TouchableOpacity
          style={styles.levelButton}
          onPress={() => {
            playSound();
            navigation.navigate('KadMemoriHard', { level: 'Hard' });
          }}
        >
          <View style={styles.levelContent}>
            <LottieView
              source={require('../../../assets/hard.json')} // Replace with your Lottie animation path for Hard level
              autoPlay
              loop
              style={styles.lottieIcon}
            />
            <Text style={styles.levelText}>Hard</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker, slightly transparent background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, // Fully rounded corners
    flexDirection: 'row', // Align text and icon horizontally
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Elevation for Android
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600', // Slightly bolder text
    letterSpacing: 1, // Adds spacing for a cleaner look
    marginLeft: 10, // Space between the icon and the text
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00796B', // Deep green
    marginBottom: 40,
    textShadowColor: '#004D40', // Darker green shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  levelButton: {
    width: '80%',
    height: 100, // Consistent height
    padding: 15,
    backgroundColor: '#0288D1', // Blue
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  levelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lottieIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  easyIcon: {
    width: 60, // Slightly bigger
    height: 60, // Slightly bigger
  },
  mediumIcon: {
    width: 40, // Slightly smaller
    height: 40, // Slightly smaller
  },
  levelText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default KadMemoriLevelScreen;
