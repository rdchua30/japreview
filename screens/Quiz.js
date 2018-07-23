import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text, ScrollView, TouchableHighlight,
    View, TextInput, TouchableOpacity, Alert, AsyncStorage, StatusBar, FlatList, Image, Button, Animated
}
from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import HTMLView from 'react-native-htmlview';
var Realm = require('realm');
var Sound = require('react-native-sound');

export const DictionaryComplete = {
    name: 'DictionaryComplete',
    properties: {
        id: { type: 'int', default: 0 },
        kanji: "string",
        kanji_with_furigana: "string",
        furigana: "string",
        english_meaning: "string", 
        word_audio_file: "string",
        part_of_speech: "string",
        sentence_kanji: "string",
        sentence_with_furigana: "string",
        sentence_furigana: "string", 
        sentence_translation: "string", 
        something: "string",
        sentence_audio_file: "string"
    }
}

const dbOptions = {
    path: 'dictionary_complete.realm',
    schema: [DictionaryComplete]
}

let realm

export default class Word extends React.Component {

    constructor() {
        super();
        this.state = {
            choices: [],
            word: {},
            score: 0,
            correctWords: []
        }
        this.initView();
    }

    initView() {
        Realm.open(dbOptions).then(realm => {
            let db = realm.objects('DictionaryComplete');
            let word;
            let arr = [];
            let random = Math.floor(Math.random() * db.length) + 1
            let random_word = db[random];
            this.setState({ word: random_word });
            this.playSound(random_word.word_audio_file);
            arr.push(random_word);
            for(let i = 0; i < 3; i++){
                let randomnumber;
                do {
                    randomnumber = Math.floor(Math.random() * db.length) + 1;
                }
                while ((db[randomnumber].part_of_speech != random_word.part_of_speech) || (random == randomnumber) || this.state.correctWords.includes(db[randomnumber]))
                arr.push(db[randomnumber]);
            }
            arr = this.shuffleArray(arr)
            this.setState({ choices: arr });
        })
    }

    playSound(fileName){
        let dirs = RNFetchBlob.fs.dirs
        let song = new Sound(dirs.DownloadDir + '/audioFiles/' + fileName, '', (error) => {
            if (error) {
                console.log(error)
            }
            song.play();
        })
    }

    checkAnswer(answer) {
        if(answer == this.state.word.furigana){
            this.setState({ score: this.state.score + 1})
            this.initView();
            let temparr = this.state.correctWords;
            temparr.push(answer)
            this.setState({ correctWords: temparr })
        } else {
            this.initView();
        }
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    getSentence(sentence) {
        console.log(sentence)
        return "<p>" + sentence + "</p>";
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
        return (
            <View style={styles.MainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor='#fff' />
                <View style={{marginTop: -200}}>    
                    <Text style={styles.score}>Score: {this.state.score}</Text>
                    <Text style={styles.word}>{this.state.word.english_meaning}</Text>
                    <Text style={styles.wordDefinition}>{this.state.word.part_of_speech}</Text>
                    {/* <HTMLView stylesheet={styles} value={this.getSentence(this.state.word.sentence_with_furigana)}/> */}

                </View>
                <View style={[styles.choiceContainer, {flexDirection: 'row'}]}>
                    <View style={{flexDirection: 'column'}}>
                        <TouchableOpacity onPress={() => this.checkAnswer(this.state.choices[0].furigana)}><Text style={styles.choice}>{this.state.choices[0] ? this.state.choices[0].furigana : ''}</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.checkAnswer(this.state.choices[1].furigana)}><Text style={styles.choice}>{this.state.choices[1] ? this.state.choices[1].furigana : ''}</Text></TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'column', marginLeft: 0}}>
                        <TouchableOpacity onPress={() => this.checkAnswer(this.state.choices[2].furigana)}><Text style={styles.choice}>{this.state.choices[2] ? this.state.choices[2].furigana : ''}</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.checkAnswer(this.state.choices[3].furigana)}><Text style={styles.choice}>{this.state.choices[3] ? this.state.choices[3].furigana : ''}</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    b: {
        fontSize: 16,
        color: '#000', // make links coloured pink
        fontWeight: '500'
    },
    p: {
        color: '#666',
        marginTop: 10,
        paddingRight: 20,
        paddingLeft: 20,
        textAlign: 'center',
        lineHeight: 25,
        fontSize: 16,
        paddingHorizontal: 25,
        fontFamily: 'SourceSansPro-LightItalic'
    },
    MainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Platform.OS) === 'ios' ? 20 : 20,
    },
    score: {
        textAlign: 'center',
        fontSize: 14,
        color: "#555",
        fontFamily: 'Lora-Regular'
    },
    word: {
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'center',
        fontSize: 40, 
        fontFamily: 'Lora-Bold', 
        color: '#3E3B3A'
    },
    wordJapan: {
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'center',
        paddingTop: 5, 
        fontSize: 20, 
        color: '#3E3B3A'
    },
    wordDefinition: {
        color: '#666', 
        marginTop: 10,
        paddingRight: 20,
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
    choiceContainer: {
        position: 'absolute',
        bottom: 5,
        padding: 15,
    },
    choice: {
        backgroundColor: '#f5f5f5',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 20,
        margin: 20,
        textAlign: 'center'
    }
});
