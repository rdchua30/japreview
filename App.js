import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View, TextInput, TouchableOpacity, Alert, AsyncStorage, StatusBar, FlatList, Image, Animated, Easing
} from 'react-native';

import { createStackNavigator } from 'react-navigation';
//screens
import HomeScreen from './screens/HomeImage';
import SearchScreen from './screens/Search';
import WordScreen from './screens/Word';
import QuizScreen from './screens/Quiz';
import CategoriesScreen from './screens/Categories';
import MNN1VocabularyScreen from './screens/Mnn1Vocab';

export default class App extends React.Component {

    render() {
        return (
            <Navigation></Navigation>
        );
    }
}

const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 600,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
            const {
                layout,
                position,
                scene
            } = sceneProps

            const index = scene.index
            const width = layout.initWidth
            const translateX = 0
            const translateY = 0
            const opacity = position.interpolate({
                inputRange: [index - 0.7, index, index + 0.7],
                outputRange: [0.3, 1, 0.3]
            })

            return {
                opacity,
                transform: [{
                    translateX
                }, {
                    translateY
                }]
            }
        },
    }
}

export const Navigation = createStackNavigator({
    Home: { screen: HomeScreen },
    Search: { screen: SearchScreen },
    Word: { screen: WordScreen },
    Quiz: { screen: QuizScreen },
    Categories: { screen: CategoriesScreen },
    MNN1Vocabulary: { screen: MNN1VocabularyScreen }
}, {
    transitionConfig
});

