import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import DefaultStyles from '../constants/default-styles';
import MainButton from '../components/MainButton';
import {Ionicons} from '@expo/vector-icons'

const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max - min)) + min;
        return rndNum;
};

const GameScreen = props => {
    const [currentGuess, setCurrentGuess] = useState(
        generateRandomBetween(1, 100, props.userChoice)
    );
    const [rounds, setRounds] = useState(0);
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    useEffect(() => {
        if (currentGuess === props.userChoice) {
            props.onGameOver(rounds);
        }
    }, [currentGuess, props.userChoice, props.onGameOver]);
    const nextGuessNumber = direction => {
        if (
            (direction === 'lower' && currentGuess < props.userChoice) ||
            (direction === 'greater' && currentGuess > props.userChoice)
        ) {
            Alert.alert('Don\'t lie!', 'You know that this is wrong...', [
                { text: 'Sorry!', stylele: 'cancel' }
            ]);
            return;
        }
        if (direction === 'lower') {
            currentHigh.current = currentGuess;
        } else {
            currentLow.current = currentGuess;
        }
        const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, props.userChoice);
        setCurrentGuess(nextNumber);
        setRounds((rounds) => rounds + 1);
    };

    return (
        <View style={styles.screen}>
            <Text style={DefaultStyles.titleText}>Opponent's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.ButtonContainer}>
                <MainButton onPress={nextGuessNumber.bind(this, 'lower')}>
                    <Ionicons name="md-remove" size={24}/>
                    </MainButton>
                <MainButton onPress={nextGuessNumber.bind(this, 'greater')}>
                <Ionicons name="md-add" size={24}/>
                    </MainButton>
            </Card>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    ButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: 400,
        maxWidth: '90%'
    }
});

export default GameScreen;