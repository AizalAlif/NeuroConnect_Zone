import React from 'react';
import WelcomeScreen from './src/components/WelcomeScreen';
import IntroductionScreen from './src/components/Introduction/IntroductionScreen';
import Introduction2Screen from './src/components/Introduction/Introduction2Screen';
import OnboardingQuestionScreen from './src/components/Introduction/OnboardingQuestionScreen';
import HomeScreen from './src/components/HomeScreen';
import SignUpScreen from './src/components/SignUpScreen';
import SignInScreen from './src/components/SignInScreen';
import DeleteAccount from './src/components/DeleteAccount';
import JomJawabEasyScreen from './src/components/JomJawab/JomJawabEasyScreen';
import JomJawabMediumScreen from './src/components/JomJawab/JomJawabMediumScreen';
import JomJawabHardScreen from './src/components/JomJawab/JomJawabHardScreen';
import JomJawabLevelScreen from './src/components/JomJawab/JomJawabLevelScreen';
import KadMemoriLevelScreen from './src/components/KadMemori/KadMemoriLevelScreen';
import KadMemoriEasyScreen from './src/components/KadMemori/KadMemoriEasyScreen';
import KadMemoriMediumScreen from './src/components/KadMemori/KadMemoriMediumScreen';
import KadMemoriHardScreen from './src/components/KadMemori/KadMemoriHardScreen';
import CikguMikuScreen from './src/components/CikguMiku/CikguMikuScreen';
import InstructionScreen from './src/components/CikguMiku/InstructionScreen';
import ApaItuMetaforaScreen from './src/components/CikguMiku/ApaItuMetaforaScreen';
import LeaderboardMenuScreen from './src/components/Leaderboard/LeaderboardMenuScreen';
import LeaderboardJomJawabLevelScreen from './src/components/Leaderboard/LeaderboardJomJawabLevelScreen';
import LeaderboardKadMemoriLevelScreen from './src/components/Leaderboard/LeaderboardKadMemoriLevelScreen';
import LeaderboardJomJawabEasyScreen from './src/components/Leaderboard/LeaderboardJomJawabEasyScreen';
import LeaderboardJomJawabMediumScreen from './src/components/Leaderboard/LeaderboardJomJawabMediumScreen';
import LeaderboardJomJawabHardScreen from './src/components/Leaderboard/LeaderboardJomJawabHardScreen';
import LeaderboardKadMemoriEasyScreen from './src/components/Leaderboard/LeaderboardKadMemoriEasyScreen';
import LeaderboardKadMemoriMediumScreen from './src/components/Leaderboard/LeaderboardKadMemoriMediumScreen';
import LeaderboardKadMemoriHardScreen from './src/components/Leaderboard/LeaderboardKadMemoriHardScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" >
      <Stack.Screen name="Introduction" component={IntroductionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Introduction2" component={Introduction2Screen} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingQuestion" component={OnboardingQuestionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{ headerShown: false }} />
        <Stack.Screen name="JomJawabEasy" component={JomJawabEasyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="JomJawabMedium" component={JomJawabMediumScreen} options={{ headerShown: false }} />
        <Stack.Screen name="JomJawabHard" component={JomJawabHardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="JomJawabLevel" component={JomJawabLevelScreen} options={{ headerShown: false }} />
        <Stack.Screen name="KadMemoriEasy" component={KadMemoriEasyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="KadMemoriMedium" component={KadMemoriMediumScreen} options={{ headerShown: false }} />
        <Stack.Screen name="KadMemoriHard" component={KadMemoriHardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="KadMemoriLevel" component={KadMemoriLevelScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CikguMiku" component={CikguMikuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Instruction" component={InstructionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ApaItuMetaforaScreen" component={ApaItuMetaforaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardMenu" component={LeaderboardMenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardJomJawabLevel" component={LeaderboardJomJawabLevelScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardKadMemoriLevel" component={LeaderboardKadMemoriLevelScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardJomJawabEasy" component={LeaderboardJomJawabEasyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardJomJawabMedium" component={LeaderboardJomJawabMediumScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardJomJawabHard" component={LeaderboardJomJawabHardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardKadMemoriEasy" component={LeaderboardKadMemoriEasyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardKadMemoriMedium" component={LeaderboardKadMemoriMediumScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeaderboardKadMemoriHard" component={LeaderboardKadMemoriHardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;