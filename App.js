import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import Header from './src/components/Header';
import StartGameScreen from './src/screens/StartGameScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import AppLoading from 'expo-app-loading';

export default function App() {
  const [userNumber, setUserNumber] = useState();
  const [pastGuesses, setPastGuesses] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  let [fontsLoaded] = useFonts({
    'open-sans-bold': require('./src/assets/fonts/OpenSans-Bold.ttf'),
    'open-sans': require('./src/assets/fonts/OpenSans-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const startGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber);
    setPastGuesses(0);
  }

  const gameOverHandler = pastGuesses => {
    setPastGuesses(pastGuesses)
  }

  const newGameHandler = () => {
    setUserNumber(null);
    setPastGuesses(0);
  }

  let content = <StartGameScreen onStartGame={startGameHandler} />;
  
  if (userNumber && pastGuesses<=0) {
    content = <GameScreen userChoice={userNumber} onGameOver={gameOverHandler} />;
  } else if (pastGuesses > 0) {
    content = <GameOverScreen roundsNumber={pastGuesses} userNumber={userNumber} onRestart={newGameHandler} />;
  }

  return (
    <View style={styles.screen}>
      <Header title="Guess a number" />
      {content}
    </View>

  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});
