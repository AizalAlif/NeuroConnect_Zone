import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import { SvgUri } from 'react-native-svg';
import { get, ref, remove } from 'firebase/database';
import { database } from '../../../assets/firebaseConfig';
import { Audio } from 'expo-av';

export default function LeaderboardKadMemoriEasy({ navigation }) {
  const [scores, setScores] = useState([]);
  const [userPics, setUserPics] = useState({});
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

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const snapshot = await get(ref(database, 'kadMemoriEasyLeaderboard/'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const scoresArray = Object.entries(data).map(([userId, userData]) => ({
            userId,
            ...userData,
          }));
          // Sort by moves in ascending order (least moves first)
          scoresArray.sort((a, b) => a.moves - b.moves);
          setScores(scoresArray);
  
          const pics = scoresArray.reduce((acc, score) => {
            const url = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${score.userId}`;
            acc[score.userId] = url;
            return acc;
          }, {});
  
          setUserPics(pics);
        } else {
          console.log('No leaderboard data available');
        }
      } catch (error) {
        console.error('Error fetching leaderboard: ', error);
      }
    };
  
    fetchScores();
  }, []);
  

  const resetLeaderboard = async () => {
    try {
      await remove(ref(database, 'kadMemoriEasyLeaderboard/'));
      setScores([]);
      console.log('Leaderboard reset successfully');
    } catch (error) {
      console.error('Error resetting leaderboard: ', error);
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return styles.gold;
      case 2:
        return styles.silver;
      case 3:
        return styles.bronze;
      default:
        return styles.defaultRank;
    }
  };

  const renderTopRanks = (item, index) => {
    const podiumStyles = [styles.topRankItem, getRankStyle(index + 1)];

    if (index === 0) {
      podiumStyles.push(styles.firstPlace);
    } else if (index === 1) {
      podiumStyles.push(styles.secondPlace);
    } else if (index === 2) {
      podiumStyles.push(styles.thirdPlace);
    }

    return (
      <View style={podiumStyles} key={item.userId}>
        {index === 0 && (
          <LottieView source={require('../../../assets/crown.json')} autoPlay loop style={styles.crown} />
        )}
        <Text style={styles.rankNumber}>{index + 1}</Text>
        <SvgUri width="60" height="60" uri={userPics[item.userId]} />
        <Text style={styles.topRankText}>{item.name || 'Anonymous'}</Text>
        <Text style={styles.topRankScore}>{item.moves} Moves</Text>
      </View>
    );
  };

  const renderScoreItem = ({ item, index }) => (
    <View style={[styles.scoreItem, getRankStyle(index + 4)]}>
      <Text style={styles.rank}>{index + 4}</Text>
      <SvgUri width="40" height="40" uri={userPics[item.userId]} />
      <Text style={styles.name}>{item.name || 'Anonymous'}</Text>
      <Text style={styles.score}>{item.moves} Moves</Text>
    </View>
  );

  return (
    <ImageBackground source={require('../../../assets/background15.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Carta</Text>
          <Text style={styles.subtitle}>Kad Memori Easy</Text>
        </View>
        <View style={styles.topRanksContainer}>
          {scores.slice(0, 3).map(renderTopRanks)}
        </View>
        <FlatList
          data={scores.slice(3)}
          keyExtractor={(item) => item.userId}
          renderItem={renderScoreItem}
        />
        <TouchableOpacity style={styles.resetButton} onPress={() => {
          playSound();
          resetLeaderboard();
        }}>
          <Text style={styles.resetButtonText}>Reset Carta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          playSound();
          navigation.navigate('Home');
        }}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust the opacity for darker overlay
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFEB3B', // Gold color for title
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFEB3B', // Gold color for title
    marginVertical: 10,
    marginTop: -8,
  },
  topRanksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  topRankItem: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for podium positions
  },
  firstPlace: {
    alignSelf: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  secondPlace: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 30,
  },
  thirdPlace: {
    alignSelf: 'flex-end',
    marginLeft: 0,
    marginRight: 20,
    marginBottom: 30,
  },
  crown: {
    width: 80,
    height: 80,
  },
  rankNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    textAlign: 'center',
  },
  topRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  topRankScore: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#2C3E50', // Darker background for regular scores
    elevation: 3,
  },
  gold: {
    backgroundColor: 'gold',
  },
  silver: {
    backgroundColor: '#C0C0C0',
  },
  bronze: {
    backgroundColor: '#CD7F32',
  },
  defaultRank: {
    backgroundColor: '#34495E',
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  name: {
    fontSize: 20,
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  resetButton: {
    padding: 15,
    backgroundColor: '#0288D1',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#0288D1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});