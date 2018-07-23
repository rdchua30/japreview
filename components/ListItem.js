import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text, ScrollView, TouchableHighlight ,
    View, TextInput, TouchableOpacity, Alert, AsyncStorage, StatusBar, FlatList, Image, Button, Animated
} from 'react-native';


export default class Search extends React.Component {

    state = {
        animatePress: new Animated.Value(1),
        opacity: new Animated.Value(0)
    }

    animateIn() {
        Animated.timing(this.state.animatePress, {
            toValue: 0,
            duration: 300
        }).start();
    }

    animateOut() {
        Animated.timing(this.state.animatePress, {
            toValue: 1,
            duration: 300
        }).start();
    }

    componentDidMount() {
        const {index} = this.props
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true
        }).start();
    }

    render() {
        const {kanji, primary_def, secondary_def, index} = this.props
        return (
            <Animated.View style={[styles.wordContainer, {opacity: this.state.opacity}]} index={index}>
                <Text style={styles.word}>{kanji}</Text>
                <Text style={styles.definition}>{primary_def}</Text>
                <Text style={styles.sec_definition}>{secondary_def}</Text>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({

    wordContainer: {
        paddingVertical: 15,
        paddingHorizontal: 5,
        // elevation: 2,
        // backgroundColor: 'white',
        margin: 5,
        borderRadius: 5
    },
    word: {
        fontSize: 22,
        fontWeight: '700',
        color: 'black'
    },
    definition: {
        marginTop: 5,
        fontSize: 15,
        color: '#555',
        fontStyle: 'italic',
        fontWeight: '500'
    },
    sec_definition: {
        marginTop: 5,
        fontFamily: "Lora-Regular",
        fontSize: 13,
        lineHeight: 20
    },
});
