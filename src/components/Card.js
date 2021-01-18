import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
return <View style={{...styles.card,...props.style}}>
    {props.children}
</View>
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        //shadow in IOS
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        //shadow in Android
        elevation: 15,
    }
});

export default Card;