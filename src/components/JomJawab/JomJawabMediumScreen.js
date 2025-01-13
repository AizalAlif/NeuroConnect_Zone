import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, Alert, Modal, TextInput, Button } from 'react-native';
import { Video } from 'expo-av';
import * as Speech from 'expo-speech';
import { get, ref, set, query, orderByChild } from "firebase/database";
import { Audio } from 'expo-av';
import { database } from '../../../assets/firebaseConfig.js';

export default function JomJawabMediumScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0); // Tracks attempts for the current question
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false); // Tracks if the question was answered correctly
  const [leaderboard, setLeaderboard] = useState([]);
  const [userName, setUserName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState();
  const [explanation, setExplanation] = useState('');
  const [isExplanationVisible, setExplanationVisible] = useState(false);
  const [correctSound, setCorrectSound] = useState(); 
  const [incorrectSound, setIncorrectSound] = useState();
  
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

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Clean up the sound when the component unmounts
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snapshot = await get(ref(database, 'questionsMedium/'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Transform the data to ensure options is an array
          const fetchedQuestions = Object.entries(data).map(([key, value]) => ({
            ...value,
            options: Array.isArray(value.options) 
              ? value.options 
              : Object.values(value.options) // Convert options object to array if it's not already
          }));
          setQuestions(fetchedQuestions);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchQuestions();
  }, []);
useEffect(() => {
  const loadSounds = async () => {
    try {
      const { sound: correct } = await Audio.Sound.createAsync(
        require('../../../assets/betul.mp3')
      );
      const { sound: incorrect } = await Audio.Sound.createAsync(
        require('../../../assets/cubalagi.mp3')
      );
      setCorrectSound(correct);
      setIncorrectSound(incorrect);
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  };
  loadSounds();

  return () => {
    if (correctSound) correctSound.unloadAsync();
    if (incorrectSound) incorrectSound.unloadAsync();
  };
}, []);


  const handleAnswer = async (answer) => {
  if (correctSound) await correctSound.stopAsync();
  if (incorrectSound) await incorrectSound.stopAsync();

  const correctOptionIndex = questions[currentQuestionIndex]?.correctOption; // Get the index of the correct option
  const correctAnswer = questions[currentQuestionIndex]?.options[correctOptionIndex]; // Get the correct answer based on the index

  if (answer === correctAnswer) {
    setFeedback('Betul!');
    setIsCorrect(true);
    setExplanation(questions[currentQuestionIndex]?.explanation || ''); // Set the explanation content
    setExplanationVisible(true); // Show the explanation modal

    if (correctSound) await correctSound.playAsync();

    // Only update score on the first correct attempt
    if (!answeredCorrectly) {
      if (attempts === 0) {
        setScore(score + 10); // First attempt
      } else if (attempts === 1) {
        setScore(score + 5); // Second attempt
      } else {
        setScore(score + 2); // Third or more attempts
      }
      setAnsweredCorrectly(true); // Mark as answered correctly
    }

    setAttempts(0); // Reset attempts for the next question
  } else {
    setFeedback('Cuba lagi!');
    setIsCorrect(false);
    if (incorrectSound) await incorrectSound.playAsync();
    setAttempts(attempts + 1); // Increment attempts
  }
};

  

  const handleNextQuestion = () => {
    playSound(); // Play sound on next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback(null);
      setAnsweredCorrectly(false);
    } else {
      Speech.speak('Tahniah, anda berjaya menjawab semua soalan!', { language: 'ms' });
      Alert.alert(
        'Tahniah!',
        'Anda telah menjawab semua soalan.',
        [
          {
            text: 'Done',
            onPress: () => setModalVisible(true), // Show modal to enter the name
            style: 'destructive', // You can use 'default', 'cancel', or 'destructive'
          },
        ],
        { cancelable: false } // Makes the alert non-dismissible
      );
    }
  };

  const saveScoreToLeaderboard = async () => {
    try {
      const userId = 'user_' + Date.now(); // Generate a unique ID for the user
      await set(ref(database, `leaderboard_medium/${userId}`), {
        name: userName, // Use the entered name
        score: score,
      });
      console.log('Score saved successfully'); // Log success message
      fetchLeaderboard(); // Fetch updated leaderboard
    } catch (error) {
      console.error('Error saving score: ', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const leaderboardQuery = query(ref(database, 'leaderboard_medium/'), orderByChild('score'));
      const snapshot = await get(leaderboardQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const sortedLeaderboard = Object.values(data).sort((a, b) => b.score - a.score); // Sort descending
        setLeaderboard(sortedLeaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard: ', error);
    }
  };

  const renderMedia = () => {
    const mediaStyle = StyleSheet.create({
      media: {
        width: 300, // Fixed the string '300' to number 300
        height: 200,
        borderRadius: 15,
        marginVertical: 20,
      }
    });

    if (currentQuestionIndex === 0) {
      return (
        <Video
          source={require('../../../assets/theatre.mp4')}
          style={mediaStyle.media}
          resizeMode="contain"
          useNativeControls
          shouldPlay={true}
        />
      );
    } else if (currentQuestionIndex === 1) {
      return (
        <Video
          source={require('../../../assets/pintu.mp4')}
          style={mediaStyle.media}
          resizeMode="contain"
          useNativeControls
          shouldPlay
          isMuted
        />
      );
    } else if (currentQuestionIndex === 2) {
      return (
        <Image
          source={require('../../../assets/playground.jpeg')}
          style={mediaStyle.media}
        />
      );
    } else if (currentQuestionIndex === 3) {
      return (
        <Video
          source={require('../../../assets/masa.mp4')}
          style={mediaStyle.media}
          resizeMode="contain"
          useNativeControls
          shouldPlay={true}
        />
      );
    } else if (currentQuestionIndex === 4) {
      return (
        <Image
          source={require('../../../assets/pelangi.jpeg')}
          style={mediaStyle.media}
        />
      );
    }
    return null;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion?.options || [];

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/background15.jpeg')} style={styles.background}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            playSound();
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>

        {renderMedia()}

        <View style={styles.questionBubble}>
          <Text style={styles.questionText}>
            {currentQuestion?.question || 'Loading...'}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {feedback && (
          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackText, !isCorrect && styles.incorrectFeedback]}>
              {feedback}
            </Text>
            {isCorrect && (
              <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                <Text style={styles.nextButtonText}>Soalan Seterusnya</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Modal
          visible={isExplanationVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Keterangan</Text>
              <Text style={styles.modalText}>{explanation}</Text>
              <Button
                title="Tutup"
                onPress={() => setExplanationVisible(false)}
              />
            </View>
          </View>
        </Modal>

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
                    Alert.alert('Sila masukkan nama anda');
                    return;
                  }
                  playSound();
                  saveScoreToLeaderboard();
                  setModalVisible(false);
                  navigation.navigate('LeaderboardJomJawabMedium');
                }}
              />
            </View>
          </View>
        </Modal>
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
 scoreContainer: {
  marginTop: 80,
  alignItems: 'center',
  backgroundColor: '#F6D6D6', // Add a white background for contrast
  padding: 10, // Add padding for space around the text
  borderRadius: 10, // Rounded corners
  borderColor: '#FFCCEA ', // Adding a fun border color
  borderWidth: 2, // Border width
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
},
scoreText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333', // Keep the text color dark for contrast
},

  media: {
    width: '300',
    height: 200,
    borderRadius: 15,
    marginVertical: 20,
  },
  questionBubble: {
    backgroundColor: '#0288D1',
    borderRadius: 15,
    padding: 15,
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'CustomFont-Bold',
  },
  optionsContainer: {
    width: '90%',
  },
  optionButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderColor: 'white',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'CustomFont-Regular',
  },
  feedbackContainer: {
    marginTop: 20,
    alignItems: 'center',
    
  },
  feedbackText: {
  fontSize: 20,
  color: 'Black',
  textAlign: 'center',
  fontWeight: 'bold',
  backgroundColor: '#00796B', // Bright yellow background
  padding: 10, // Add padding for spacing
  borderRadius: 5, // Rounded corners
  borderColor: 'white',
  borderWidth: 2, // Border width
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
  marginTop: -20,
},

  incorrectFeedback: {
    color: 'red',
  },
 nextButton: {
  marginTop: 20,
  backgroundColor: '#FFD700', // Bright golden color
  padding: 15, // Increased padding for a more substantial feel
  borderRadius: 10, // More rounded corners
  borderWidth: 2, // Border width
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
},
nextButtonText: {
  color: 'b',
  fontSize: 18,
  fontWeight: 'bold',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
},

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#F6F7C4',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
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
