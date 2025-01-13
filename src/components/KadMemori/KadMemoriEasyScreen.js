import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ImageBackground,
  Image,
  Modal, 
  TextInput, 
  Button,
} from 'react-native';
import { Audio } from 'expo-av';
import { ProgressBar } from 'react-native-paper';
import { ref, set } from "firebase/database";
import { database } from '../../../assets/firebaseConfig';
import LottieView from 'lottie-react-native';

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const cardsData = [
  { id: 1, text: 'Jantungku hancur berkecai', pairId: 1, type: 'metaphor' },
  { id: 2, image: require('../../../assets/heart.png'), pairId: 1, type: 'image'},
  { id: 3, text: 'Hati yang beku', pairId: 2, type: 'metaphor' },
  { id: 4, image: require('../../../assets/frozenheart.png'), pairId: 2, type: 'image'},
  { id: 5, text: 'Usaha tangga kejayaan', pairId: 3, type: 'metaphor' },
  { id: 6, image: require('../../../assets/tangga.jpg'), pairId: 3, type: 'image'},
  { id: 7, text: 'Membaca jambatan ilmu', pairId: 4, type: 'metaphor' },
  { id: 8, image: require('../../../assets/membaca.png'), pairId: 4, type: 'image'},
];

const KadMemoriEasyScreen = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [correctSound, setCorrectSound] = useState(null);
  const [victorySound, setVictorySound] = useState(null);
  const [buttonSound, setButtonSound] = useState(null);
  const [userName, setUserName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [explanationText, setExplanationText] = useState('');
  const [isExplanationVisible, setExplanationVisible] = useState(false);

  const showExplanation = (pairId) => {
    let explanation = '';
    switch (pairId) {
      case 1:
        explanation = 'Perasaan yang sangat sedih atau kecewa.';
        break;
      case 2:
        explanation = 'Seseorang yang tidak mudah terpengaruh atau tidak menunjukkan perasaan.';
        break;
      case 3:
        explanation = 'Berusaha keras adalah cara untuk mencapai kejayaan.';
        break;
      case 4:
        explanation = 'Membaca ialah cara untuk menambah ilmu dan pengetahuan.';
        break;
      default:
        explanation = '';
    }

    
    setExplanationText(explanation);
    setExplanationVisible(true);
  };

  const loadSounds = async () => {
    try {
      const { sound: correct } = await Audio.Sound.createAsync(
        require('../../../assets/correct.mp3')
      );
      const { sound: victory } = await Audio.Sound.createAsync(
        require('../../../assets/victory.mp3') 
      );
      const { sound: button } = await Audio.Sound.createAsync(
        require('../../../assets/button.mp3')
      );
      setCorrectSound(correct);
      setVictorySound(victory);
      setButtonSound(button);
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  };

  useEffect(() => {
    loadSounds();
    setCards(shuffleArray([...cardsData]));
    
    return () => {
      if (correctSound) correctSound.unloadAsync();
      if (victorySound) victorySound.unloadAsync();
      if (buttonSound) buttonSound.unloadAsync();
    };
  }, []);

  const playButtonSound = async () => {
    if (buttonSound) {
      await buttonSound.replayAsync();
    }
  };

  const handleFlip = async (index) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }
    
    await playButtonSound();
    setFlippedCards((prev) => [...prev, index]);
    setMoves((prev) => prev + 1);
  };
  

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
  
      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
        if (correctSound) correctSound.replayAsync();
  
        
        showExplanation(firstCard.pairId);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  }, [flippedCards, cards]);
  

  const handleCloseExplanation = async () => {
    await playButtonSound(); 
    setExplanationVisible(false);
    
    if (matchedCards.length === cards.length) {
      if (victorySound) victorySound.replayAsync(); 
      setModalVisible(true);
    }
  };

  const handleSaveScore = async () => {
    await playButtonSound();
    if (userName.trim() === '') {
      alert('Masukkan nama anda!');
      return;
    }
    saveScoreToLeaderboard(userName, moves);
    setMoves(0);
    setMatchedCards([]);
    setFlippedCards([]);
    setCards(shuffleArray([...cardsData]));
    setModalVisible(false);
  };

  const totalPairs = 8 / 2;

  const progress = matchedCards.length / 2 / totalPairs;

  const renderCard = ({ item, index }) => {
    const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
    return (
      <TouchableOpacity
        style={[styles.card, isFlipped ? styles.flipped : null]}
        onPress={() => handleFlip(index)}
      >
        {isFlipped ? (
          item.type === 'image' ? (
            <Image source={item.image} style={styles.cardImage} />
          ) : (
            <Text style={styles.cardText}>{item.text}</Text>
          )
        ) : (
          <Text style={styles.cardText}>?</Text>
        )}
      </TouchableOpacity>
    );
  };

  const saveScoreToLeaderboard = async (userName, moves) => {
    try {
      const userId = 'user_' + Date.now(); 
      await set(ref(database, `kadMemoriEasyLeaderboard/${userId}`), {
        name: userName, 
        moves: moves,  
      });
      navigation.navigate('LeaderboardKadMemoriEasy'); 
    } catch (error) {
      console.error('Error saving score: ', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/background15.jpeg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
        <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    playButtonSound();
                    navigation.goBack(); 
                  }}
                >
                  <Text style={styles.backButtonText}>Kembali</Text>
                </TouchableOpacity>
        
          <Text style={styles.header}>Kad Memori Easy</Text>

          {/* Lottie animation and Moves counter side by side */}
          <View style={styles.row}>
            <LottieView
              source={require('../../../assets/moves.json')} 
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.movesCounter}>Moves: {moves}</Text>
          </View>

          <ProgressBar 
            progress={progress} 
            width={null}
            color="green" 
            borderWidth={0}
            style={{ marginVertical: 20, height: 15 }} 
          />

          <FlatList
            data={cards}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={styles.cardRow}
            contentContainerStyle={styles.cardGrid}
          />

          {/* Explanation Modal */}
          <Modal
            visible={isExplanationVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Keterangan</Text>
                <Text style={styles.modalText}>{explanationText}</Text>
                <Button
                  title="Tutup"
                  onPress={handleCloseExplanation}
                />
              </View>
            </View>
          </Modal>

          {/* Enter Name Modal */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Tulis nama kamu, Pemenang!</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nama"
                  value={userName}
                  onChangeText={setUserName}
                />
                <Button
                  title="Hantar"
                  onPress={() => {
                    if (userName.trim() === '') {
                      alert('Sila masukkan nama anda');
                      return;
                    }
                    saveScoreToLeaderboard(userName, moves);
                    setMoves(0);
                    setMatchedCards([]);
                    setFlippedCards([]);
                    setCards(shuffleArray([...cardsData]));
                    setModalVisible(false);
                  }}
                />
              </View>
            </View>
          </Modal>
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
    backgroundColor: 'rgba(0, 0, 0,  0)',
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
  progressBar: {
    marginTop: 30,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    marginTop:75,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#00796B',
  },
  movesCounter: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
  },
  lottieAnimation: {
    width: 100, 
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
    marginTop: -20,
  },
  cardGrid: {
    alignItems: 'center',
  },
  cardRow: {
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  card: {
    width: '45%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0288D1',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  flipped: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF5722',
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  cardImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 207, 41, 0.5)',
  },
  modalContent: {
    backgroundColor: '#F6F7C4',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 10,
    backgroundColor: 'white',
  },
});

export default KadMemoriEasyScreen;
