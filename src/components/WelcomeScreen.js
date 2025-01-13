import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import { Lato_400Regular } from '@expo-google-fonts/lato';
import { Audio } from 'expo-av';

const WelcomeScreen = ({ navigation }) => {
  const [fadeAnim] = React.useState(new Animated.Value(0)); 
  const buttonSoundRef = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/button.mp3')
      );
      buttonSoundRef.current = sound;
    };

    loadSound();

    return () => {
      if (buttonSoundRef.current) {
        buttonSoundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  const playButtonSound = async () => {
    if (buttonSoundRef.current) {
      await buttonSoundRef.current.replayAsync();
    }
  };

  let [fontsLoaded] = useFonts({
    Inter_900Black,
    Lato_400Regular,
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <ImageBackground
      source={require('../../assets/background11.jpg')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Image
            source={require('../../assets/NCZ_LOGO2.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Selamat Datang ke NeuroConnect Zone</Text>
          <Text style={styles.subtitle}>
            Jom kita belajar tentang Metafora!
          </Text>

          
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              playButtonSound(); 
              navigation.navigate('SignIn'); 
            }}
          >
            <Text style={styles.buttonText}>Log Masuk</Text>
            <Image source={require('../../assets/Arrow3.png')} style={styles.buttonIcon} />
          </TouchableOpacity>

          
          <TouchableOpacity
            onPress={() => {
              playButtonSound(); 
              navigation.navigate('SignUp');
            }}
          >
            <Text style={styles.linkText}>Tiada Akaun? Daftar Sekarang</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover', 
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', 
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 300, 
    height: 300, 
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_900Black',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Lato_400Regular',
    color: 'black',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  linkText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
    marginBottom: 20, 
  },
});

export default WelcomeScreen;
