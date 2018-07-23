import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text, ScrollView, TouchableHighlight,
    View, TextInput, TouchableOpacity, Alert, AsyncStorage, StatusBar, FlatList, Image, Button, Animated
} from 'react-native';

export const Dictionary = {
    name: 'Dictionary',
    properties: {
        id: { type: 'int', default: 0 },
        kanji: 'string',
        furigana: 'string',
        part_of_speech: 'string',
        primary_def: 'string',
        secondary_def: 'string',
        jlpt_kanji: 'string',
        jlpt_furigana: 'string',
        romaji: 'string',
        example: 'string',
        translation: 'string',
    }
}
const dbOptions = {
    schema: [Dictionary]
}

let realm;

export default class Word extends React.Component {

    constructor() {
        super();
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
        },
        // headerLeft: (
        //     <TouchableOpacity onPress={() => Alert.alert('hello')}>
        //         <Image style={{ marginLeft: 10, height: 45, width: 45 }} source={require('../assets/icons/arrow_left.png')}></Image>
        //     </TouchableOpacity >
        // ),
        headerRight: (
            <TouchableOpacity onPress={this.searchAnimate}>
                <Image style={{ height: 22, width: 22, marginRight: 20 }} source={require('../assets/icons/menu.png')}></Image>
            </TouchableOpacity>
        ),
        headerTintColor: '#333'
    };

    render() {
        const { navigate } = this.props.navigation;
        const { navigation } = this.props;
        const word = navigation.getParam('word');
        return (
            <View style={styles.MainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor='#fff' />
                <View style={{marginTop: -200}}>    
                    <Text style={styles.word}>{word.primary_def}</Text>
                    <Text style={styles.wordJapan}>{word.kanji}, {word.furigana}</Text>
                    <Text style={styles.wordDefinition}>
                    {word.secondary_def.replace(/[^;'.,a-z\d\s]+/gi, '')}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Platform.OS) === 'ios' ? 20 : 20,
    },
    word: {
        paddingLeft: 20,
        paddingRight: 50,
        textAlign: 'center',
        fontSize: 40, 
        fontFamily: 'Lora-Bold', 
        color: '#3E3B3A'
    },
    wordJapan: {
        paddingLeft: 20,
        paddingRight: 50,
        textAlign: 'center',
        paddingTop: 5, 
        fontSize: 20, 
        color: '#3E3B3A'
    },
    wordDefinition: {
        color: '#666', 
        marginTop: 20,
        paddingLeft: 20,
        textAlign: 'center',
        lineHeight: 25,
        fontSize: 16,
        paddingHorizontal: 25, 
        fontFamily: 'SourceSansPro-LightItalic'
    },
    body: {
        padding: 15,
    },
});
