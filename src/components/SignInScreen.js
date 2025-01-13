import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import { Lato_400Regular } from '@expo-google-fonts/lato';
import { Audio } from 'expo-av'; 

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
       require('../../assets/button.mp3') 
    );
    setSound(sound);
    await sound.playAsync(); 
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);

  const signIn = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Introduction');
    } catch (error) {
      setError(error.message);
      Alert.alert('Error', 'Email atau Kata Laluan anda tidak sah. Pastikan anda menggunakan alamat Email dan Kata Laluan yang betul!');
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
        <View style={styles.content}>
          <Image
            source={require('../../assets/NCZ_LOGO2.png')} 
            style={styles.logo}
          />
          <Text style={styles.title}>Selamat Datang ke NeuroConnect Zone</Text>
          <Text style={styles.subtitle}>Log masuk untuk terus belajar!</Text>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Kata Laluan"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Sign In Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              playSound();
              signIn();
            }}
          >
            <Text style={styles.buttonText}>Log Masuk</Text>
            <Image
              source={require('../../assets/Arrow3.png')} 
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          {/* Don't have an account? Sign Up link */}
          <TouchableOpacity onPress={() => {
            playSound();
            navigation.navigate('SignUp');
          }}>
            <Text style={styles.linkText}>Tiada Akaun? Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
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
    width: '80%',
    maxWidth: 350, 
  },
  logo: {
    width: 250, 
    height: 250, 
    marginBottom: 1,
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
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    color: 'black',
    backgroundColor: '#ffffff90',
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
    marginBottom: 20,
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
    color: '#181327', 
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignInScreen;
