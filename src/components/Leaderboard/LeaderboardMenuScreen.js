import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av'; // Import Audio from expo-av

export default function LeaderboardMenuScreen() {
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
    <ImageBackground source={require('../../../assets/background15.jpeg')} style={styles.background}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            playSound();
            navigation.goBack(); // Go back to the previous screen
          }}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Carta</Text>

        {/* Carta Jom Jawab Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            playSound();
            navigation.navigate('LeaderboardJomJawabLevel');
          }}
        >
          <View style={styles.levelContent}>
            <Text style={styles.menuText}>Carta Jom Jawab!</Text>
          </View>
        </TouchableOpacity>

        {/* Carta Permainan Kad Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            playSound();
            navigation.navigate('LeaderboardKadMemoriLevel');
          }}
        >
          <View style={styles.levelContent}>
            <Text style={styles.menuText}>Carta Kad Memori</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00796B', // Deep green
    marginBottom: 40,
    textShadowColor: '#004D40', // Darker green shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
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
  menuButton: {
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
  instructionIcon: {
    width: 60, // Slightly bigger
    height: 60, // Slightly bigger
  },
  menuText: {
    fontSize: 20,
    color: '#E1F5FE', // Light blue for contrast
    fontWeight: 'bold',
  },
});
