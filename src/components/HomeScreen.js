import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import LottieView from 'lottie-react-native'; 
import { Audio } from 'expo-av'; 

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/button.mp3') 
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    playSound();
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const handleDeleteAccount = () => {
    hideMenu();
    playSound();
    navigation.navigate('DeleteAccount');
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assets/background13.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Settings Icon and Dropdown */}
        <View style={styles.settingsContainer}>
          <Menu
            visible={menuVisible}
            anchor={
              <TouchableOpacity onPress={toggleMenu}>
                <Image
                  source={require('../../assets/setting.png')}
                  style={styles.settingsIcon}
                />
              </TouchableOpacity>
            }
            onRequestClose={hideMenu}
          >
            <MenuItem onPress={handleDeleteAccount}>
              Hapus Akaun
            </MenuItem>
          </Menu>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Image
            source={require('../../assets/NCZ_LOGO2.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Selamat Datang ke NeuroConnect Zone</Text>

          {/* Cards Section */}
          <View style={styles.cardsContainer}>
            <View style={styles.row}>
              {/* Cikgu Miku Card as a Button */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  playSound();
                  navigation.navigate('CikguMiku');
                }}
              >
                <Text style={styles.cardTitle}>Cikgu Miku</Text>
                <LottieView
                  source={require('../../assets/HologramIcon.json')} 
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              </TouchableOpacity>

              {/* Kad Memori Card as a Button */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  playSound();
                  navigation.navigate('KadMemoriLevel');
                }}
              >
                <Text style={styles.cardTitle}>Kad Memori</Text>
                <LottieView
                  source={require('../../assets/MemoryCardIcon.json')} 
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              {/* Jom Jawab Card as a Button */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  playSound();
                  navigation.navigate('JomJawabLevel');
                }}
              >
                <Text style={styles.cardTitle}>Jom Jawab!</Text>
                <LottieView
                  source={require('../../assets/QuizIcon.json')} 
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              </TouchableOpacity>

              {/* Carta Jom Jawab Card as a Button */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  playSound();
                  navigation.navigate('LeaderboardMenu');
                }}
              >
                <Text style={styles.cardTitle}>Carta Pemenang</Text>
                <LottieView
                  source={require('../../assets/LeaderboardIcon.json')} 
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              </TouchableOpacity>
            </View>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  settingsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
  },
  settingsIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 1,
    borderRadius: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    color: '#FFFACD',
    textAlign: 'center',
    marginBottom: 1,
  },
  cardsContainer: {
    width: '100%',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ADD8E6',
    borderRadius: 12,
    width: '48%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 0,
    justifyContent: 'space-between',
    height: 230,
    backgroundColor: 'rgba(129, 135, 204, 0.5)'
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: '#FFD66B',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Lato_400Regular',
    color: 'white',
    marginBottom: 10,
  },
  lottieAnimation: {
    width: '100%',
    height: 150, // Adjust the size of the animation
    marginVertical: 10,
    marginBottom: 30,
  },
});

export default HomeScreen;
