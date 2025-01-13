import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../assets/firebaseConfig.js';
import * as Progress from 'react-native-progress';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function OnboardingQuestionScreen() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState();
  const navigation = useNavigation();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../assets/button.mp3')
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

  useEffect(() => {
    const questionsRef = ref(database, 'onboardingQuestions');
    onValue(questionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedQuestions = Object.keys(data).map((key) => ({
          ...data[key],
          id: key
        }));
        setQuestions(formattedQuestions);
        setLoading(false);
      }
    });
  }, []);

  const handleOptionSelect = (option) => {
    playSound();
    setSelectedOption(option);
  };

  const handleContinue = () => {
    playSound();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      alert('Terima kasih kerana menjawab! Selamat Belajar!');
      navigation.navigate('Home');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="200" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading onboarding questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <ImageBackground
      source={require('../../../assets/background12.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Progress Bar */}
        <Progress.Bar
          progress={progress}
          width={null}
          color="#4CAF50"
          unfilledColor="#3a3a4f"
          borderWidth={0}
          height={20}
          style={styles.progressBar}
        />

        {/* Question Section with Lottie Animation */}
        <View style={[
          styles.questionContainer,
          currentQuestionIndex === questions.length - 1 && styles.questionContainerCentered
        ]}>
          <LottieView
            source={require('../../../assets/Intro.json')}
            style={styles.animation}
            autoPlay
            loop
          />
          <Text style={styles.question}>{currentQuestion.question}</Text>
        </View>

        {/* Options List */}
        {currentQuestion.options && (
          <FlatList
            data={currentQuestion.options}
            keyExtractor={(item, index) => item && item.id ? item.id.toString() : index.toString()}
            renderItem={({ item }) => (
              item && item.label ? (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedOption === item.label ? styles.selectedOption : null,
                  ]}
                  onPress={() => handleOptionSelect(item.label)}
                >
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={selectedOption === item.label ? '#FFF' : '#4CAF50'}
                    style={styles.icon}
                  />
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              ) : null
            )}
          />
        )}

        {/* Additional Content */}
        {currentQuestion.content && (
          <FlatList
            data={currentQuestion.content}
            keyExtractor={(item, index) => item && item.icon ? item.icon.toString() : index.toString()}
            renderItem={({ item }) => (
              item && item.text ? (
                <View style={styles.content}>
                  <Ionicons name={item.icon} size={24} color="#4CAF50" style={styles.icon} />
                  <View style={styles.contentTextContainer}>
                    <Text style={styles.contentText}>{item.text}</Text>
                    <Text style={styles.contentDescription}>{item.description}</Text>
                  </View>
                </View>
              ) : null
            )}
          />
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedOption && currentQuestionIndex < questions.length - 1 && { backgroundColor: '#ccc' },
          ]}
          onPress={handleContinue}
          disabled={!selectedOption && currentQuestionIndex < questions.length - 1}
        >
          <Text style={styles.continueText}>TERUSKAN</Text>
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
    padding: 20,
    justifyContent: 'center',
  },
  progressBar: {
    marginTop: 30,
    marginBottom: 20,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionContainerCentered: {
    justifyContent: 'center',
  },
  animation: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  question: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a4f',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3a4f',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  contentTextContainer: {
    marginLeft: 10,
  },
  contentText: {
    color: 'white',
    fontSize: 16,
  },
  contentDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  continueText: {
    color: 'white',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e2f',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});
