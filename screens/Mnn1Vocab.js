import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, AsyncStorage, StatusBar, Image } from 'react-native';
import Mnn1Vocab from '../assets/mnn1vocab.json';
var Realm = require('realm');

export const Mnn1VocabMemrise = {
    name: 'Mnn1VocabMemrise',
    properties: {
        id: { type: 'int', default: 0 },
        furigana: "string",
        english: "string",
        kanji: "string",
        part_of_speech: "string",
        audio_file: "string",
        chapter: "string"
    }
}

const dbOptions = {
    path: 'Mnn1Vocab_deck.realm',
    schema: [Mnn1VocabMemrise]
}

export default class MNN1Vocabulary extends React.Component {

    constructor() {
        super();
        this.isDictionaryDownloaded();
        this.state = {
            choices: [],
            word: {},
            score: 0,
            correctWords: []
        }
    }

    isDictionaryDownloaded = async () => {
        console.log('Downloading deck')
        await this.downloadMinnaDeck();
        this.setAsDownloaded();
        this.initView();
    }

    setAsDownloaded = async () => {
        console.log('setting as downloaded')
        try {
            await AsyncStorage.setItem('N4downloaded', 'true');
            Alert.alert('Download complete');
        } catch (error) {
            // Error saving data
        }
    }

    downloadMinnaDeck() {
        for (let i = 0; i < Mnn1Vocab.length; i++) {
            let word = {
                kanji: Mnn1Vocab[i].kanji.toString(),
                furigana: Mnn1Vocab[i].furigana.toString(),
                english: Mnn1Vocab[i].english.toString(),
                part_of_speech: Mnn1Vocab[i].part_of_speech.toString(),
                audio_file: Mnn1Vocab[i].audio_file.toString(),
                chapter: Mnn1Vocab[i].chapter.toString(),
            }
            this.addWordToDeck(word);
        }
    }

    addWordToDeck = (word) => {
        Realm.open(dbOptions).then(realm => {
            realm.write(() => {
                var ID = realm.objects('Mnn1VocabMemrise').length + 1;
                realm.create('Mnn1VocabMemrise', {
                    id: ID,
                    kanji: word.kanji,
                    furigana: word.furigana,
                    english: word.english,
                    part_of_speech: word.part_of_speech,
                    audio_file: word.audio_file,
                    chapter: word.chapter
                });
            })
        })
    }


    initView() {
        Realm.open(dbOptions).then(realm => {
            let db = realm.objects('Mnn1VocabMemrise');
            let word;
            let arr = [];
            let random;
            do{
                random = Math.floor(Math.random() * db.length) + 1
            }
            while(db[random].kanji == '');
            let random_word = db[random];
            this.setState({ word: random_word });
            arr.push(random_word);
            for(let i = 0; i < 3; i++){
                let randomnumber;
                do {
                    randomnumber = Math.floor(Math.random() * db.length) + 1;
                }
                while ((random == randomnumber) || this.state.correctWords.includes(db[randomnumber]))
                arr.push(db[randomnumber]);
            }
            arr = this.shuffleArray(arr)
            this.setState({ choices: arr });
        })
    }

    checkAnswer(answer) {
        if(answer == this.state.word.english){
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

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
        },
        headerRight: (
            <TouchableOpacity onPress={this.searchAnimate}>
                <Image style={{ height: 22, width: 22, marginRight: 20 }} source={require('../assets/icons/menu.png')}></Image>
            </TouchableOpacity>
        ),
        headerTintColor: '#333'
    };

    render() {
        return (
            <View style={styles.MainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor='#fff' />
                <View style={{marginTop: -200}}>    
                    <Text style={styles.score}>Score: {this.state.score}</Text>
                    <Text style={styles.word}>{this.state.word.furigana}</Text>
                    <Text style={styles.wordSpeech}>{this.state.word.part_of_speech}</Text>
                    {/* <HTMLView stylesheet={styles} value={this.getSentence(this.state.word.sentence_with_furigana)}/> */}

                </View>
                <View style={[styles.choiceContainer, {flexDirection: 'row'}]}>
                    <View style={{flexDirection: 'column'}}>
                        <TouchableOpacity onPress={() => this.checkAnswer(this.state.choices[0].english)}><Text style={styles.choice}>{this.state.choices[0] ? this.state.choices[0].english : ''}</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.checkAnswer(this.state.choices[1].english)}><Text style={styles.choice}>{this.state.choices[1] ? this.state.choices[1].english : ''}</Text></TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'column', marginLeft: 0}}>
                        <TouchableOpacity onPress={() => this.checkAnswer(this.state.choices[2].english)}><Text style={styles.choice}>{this.state.choices[2] ? this.state.choices[2].english : ''}</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.checkAnswer(this.state.choices[3].english)}><Text style={styles.choice}>{this.state.choices[3] ? this.state.choices[3].english : ''}</Text></TouchableOpacity>
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
    wordSpeech: {
        fontSize: 14,
        fontFamily: 'SourceSansPro-LightItalic',
        textAlign: 'center',
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
    // choice: {
    //     backgroundColor: '#f5f5f5',
    //     borderRadius: 30,
    //     paddingVertical: 10,
    //     paddingHorizontal: 20,
    //     fontSize: 20,
    //     margin: 20,
    //     textAlign: 'center'
    // },
    choice: {
        backgroundColor: '#f5f5f5',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        fontSize: 16,
        margin: 20,
        fontFamily: 'SourceSansPro-Light',
        textAlign: 'center'
    }
});
