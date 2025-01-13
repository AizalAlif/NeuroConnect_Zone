import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av'; 

export default function CikguMikuScreen() {
  const navigation = useNavigation();
  const [sound, setSound] = useState();

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/button.mp3') 
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
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);

  return (
    <ImageBackground source={require('../../../assets/background15.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            playSound();
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Cikgu Miku</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            playSound();
            navigation.navigate('Instruction');
          }}
        >
          <View style={styles.levelContent}>
            <LottieView
              source={require('../../../assets/instruction.json')} 
              autoPlay
              loop
              style={[styles.lottieIcon, styles.instructionIcon, { backgroundColor: 'transparent' }]}
            />
            <Text style={styles.menuText}>Arahan</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            playSound();
            navigation.navigate('ApaItuMetaforaScreen');
          }}
        >
          <View style={styles.levelContent}>
            <Text style={styles.menuText}>Apa Itu Metafora?</Text>
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
    color: '#00796B', 
    marginBottom: 40,
    textShadowColor: '#004D40', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600', 
    letterSpacing: 1, 
    marginLeft: 10, 
  },
  menuButton: {
    width: '80%',
    height: 100,
    padding: 15,
    backgroundColor: '#0288D1', 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 60,
    height: 60, 
  },
  menuText: {
    fontSize: 20,
    color: '#E1F5FE', 
    fontWeight: 'bold',
  },
});
