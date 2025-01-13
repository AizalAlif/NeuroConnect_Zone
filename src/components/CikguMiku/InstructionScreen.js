import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Audio } from 'expo-av'; 
import { Video } from 'expo-av';

export default function InstructionScreen({ navigation }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sound, setSound] = useState();
  const video = useRef(null);

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

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlayPause = () => {
    if (isPlaying) {
      video.current.pauseAsync();
    } else {
      video.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/background14.jpg')} style={styles.background}>
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
        {/* Video Player */}
        <Video
          ref={video}
          source={require('../../../assets/cikgumikuholo.mp4')}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          style={styles.video}
        />
        <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
          <Text style={styles.playPauseText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 30, 
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center',
    zIndex: 1,
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
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 0, 
  },
  playPauseButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  playPauseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600', 
    letterSpacing: 1, 
  },
});
