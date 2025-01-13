import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { getAuth, deleteUser } from 'firebase/auth';
import { Audio } from 'expo-av'; // Import Audio from expo-av
import { useNavigation } from '@react-navigation/native';

const DeleteAccount = ({ navigation }) => {
  const [sound, setSound] = useState();

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/button.mp3') // Path to your sound file
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

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await deleteUser(user);
        console.log('Account deleted successfully');
        Alert.alert('Berjaya', 'Akaun anda telah dipadam.');
        navigation.navigate('Welcome'); // Redirect to Welcome screen after deletion
      } catch (error) {
        console.error('Error deleting account:', error.message);
        Alert.alert('Ralat', 'Gagal memadam akaun: ' + error.message);
      }
    } else {
      Alert.alert('Tiada Pengguna', 'Tiada pengguna yang sedang log masuk.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background13.jpg')} // Replace with your app's consistent background
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.warningText}>
            Adakah anda pasti mahu memadam akaun anda? Tindakan ini tidak boleh dibatalkan.
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              playSound();
              handleDeleteAccount();
            }}
          >
            <Text style={styles.deleteButtonText}>Padam Akaun</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              playSound();
              navigation.goBack();
            }}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
  },
  container: {
    backgroundColor: '#ffffff90',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  warningText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Lato_400Regular',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeleteAccount;
