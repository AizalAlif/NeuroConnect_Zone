import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import SoundButton from '../SoundButton';

export default function Introduction2Screen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../../assets/background12.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <LottieView
          source={require('../../../assets/Intro.json')}
          style={styles.animation}
          autoPlay
          loop
        />
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>Adakah kamu bersedia? Sebelum bermain</Text>
          <Text style={styles.speechText}>Sila jawab soalan yang berikut</Text>
        </View>
        <SoundButton
          title="TERUSKAN"
          onPress={() => navigation.navigate('OnboardingQuestion')}
          style={styles.button}
          textStyle={styles.buttonText}
        />
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  speechBubble: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 50,
    borderColor: 'transparent',
    width: 2000,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  speechText: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
