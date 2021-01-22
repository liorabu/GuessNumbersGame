import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Dimensions } from 'react-native';
import {ScreenOrientation} from 'expo';
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import DefaultStyles from '../constants/default-styles';
import MainButton from '../components/MainButton';
import { Ionicons } from '@expo/vector-icons';
import BodyText from '../components/BodyText';

const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max - min)) + min;
    return rndNum;
};

const renderListItem = (listLength, itemData) => {
    return (
        <View style={styles.listItem}>
            <BodyText>#{listLength - itemData.index}</BodyText>
            <BodyText>{itemData.item}</BodyText>
        </View>
    )
};

const GameScreen = props => {
    // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    const initialGuess = generateRandomBetween(1, 100, props.userChoice)
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [pastGuesses, setPastGuesses] = useState([initialGuess]);
    const [availableDeviceWidth,setAvailableDeviceWidth]=useState(
        Dimensions.get('window').width
    );
    const [availableDeviceHeight,setAvailableDeviceHeight]=useState(
        Dimensions.get('window').height
    )
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    useEffect(()=>{
        const updateLayout=()=>{
           setAvailableDeviceWidth(Dimensions.get('window').width);
           setAvailableDeviceHeight(Dimensions.get('window').height); 
        }
        Dimensions.addEventListener('change',updateLayout)
        return ()=>{Dimensions.removeEventListener('change',updateLayout)} 
    },[])
   

    useEffect(() => {
        if (currentGuess === props.userChoice) {
            props.onGameOver(pastGuesses.length);
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
            currentLow.current = currentGuess + 1;
        }
        const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, props.userChoice);
        setCurrentGuess(nextNumber);
        // setRounds((rounds) => rounds + 1);
        setPastGuesses(curPastGuesses => [nextNumber, ...curPastGuesses])
    };

    let listContainerStyle = styles.listContainer;
    if (availableDeviceWidth < 350) {
        listContainerStyle = styles.listContainerBig;
    }

    if (availableDeviceHeight < 350) {
        return (
            <View style={styles.screen}>
                <Text style={DefaultStyles.titleText}>Opponent's Guess</Text>
                <View style={styles.controls}>
                    <MainButton onPress={nextGuessNumber.bind(this, 'lower')}>
                        <Ionicons name="md-remove" size={24} />
                    </MainButton>
                    <NumberContainer>{currentGuess}</NumberContainer>
                    <MainButton onPress={nextGuessNumber.bind(this, 'greater')}>
                        <Ionicons name="md-add" size={24} />
                    </MainButton>
                </View>
                <View style={listContainerStyle}>
                    <FlatList
                        data={pastGuesses}
                        keyExtractor={item => item.toString()}
                        renderItem={renderListItem.bind(this, pastGuesses.length)}
                        contentContainerStyle={styles.list}
                    />
                </View>
            </View>
        )
    }
    return (
        <View style={styles.screen}>
            <Text style={DefaultStyles.titleText}>Opponent's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.ButtonContainer}>
                <MainButton onPress={nextGuessNumber.bind(this, 'lower')}>
                    <Ionicons name="md-remove" size={24} />
                </MainButton>
                <MainButton onPress={nextGuessNumber.bind(this, 'greater')}>
                    <Ionicons name="md-add" size={24} />
                </MainButton>
            </Card>
            <View style={listContainerStyle}>
                <FlatList
                    data={pastGuesses}
                    keyExtractor={item => item.toString()}
                    renderItem={renderListItem.bind(this, pastGuesses.length)}
                    contentContainerStyle={styles.list}
                />
            </View>
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
        marginTop: Dimensions.get('window').height > 600 ? 20 : 5,
        width: 400,
        maxWidth: '90%'
    },
    listContainer: {
        flex: 1,
        width: '60%'
    },
    listContainerBig: {
        flex: 1,
        width: '80%'
    },
    list: {
        flexGrow: 1,
        // alignItems: 'center',
        justifyContent: 'flex-end'
    },
    listItem: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 15,
        marginVertical: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems:'center',
        width:'80%'
    }
});

export default GameScreen;