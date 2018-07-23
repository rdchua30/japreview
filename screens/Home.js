import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text, ScrollView, TouchableHighlight, ImageBackground,
    View, TextInput, TouchableOpacity, Alert, AsyncStorage, StatusBar, FlatList, Image, Button, Animated
} from 'react-native';

// import N4vocab from '../assets/N4vocab.json';
import N4vocabComplete from '../assets/N4vocab_complete.json';
import N4vocabParsed from '../assets/N4vocab.json';
import N5vocab from '../assets/N5vocab.json';
import { createStackNavigator } from 'react-navigation';
var Realm = require('realm');

export const DictionaryComplete = {
    name: 'DictionaryComplete',
    properties: {
        id: { type: 'int', default: 0 },
        kanji: 'string',
        furigana: 'string',
        primary_def: 'string',
        secondary_def: 'string',
        jlpt_kanji: 'string',
        jlpt_furigana: 'string',
        romaji: 'string',
        example: 'string',
        translation: 'string',
    }
}

export const DictionaryParsed = {
    name: 'DictionaryParsed',
    properties: {
        id: { type: 'int', default: 0 },
        kanji: "string",
        furigana: "string",
        part_of_speech: "string",
        primary_def: "string",
        secondary_def: "string"
    }
}

const dbOptionsComplete = {
    path: 'dictionary_complete.realm',
    schema: [DictionaryComplete]
}
const dbOptionsParsed = {
    path: 'dictionary_parsed.realm',
    schema: [DictionaryParsed]
}

export default class Home extends React.Component {

    constructor() {
        super();
        this.isDictionaryCompleteDownloaded()
        // downloadN5vocab();
        this.state = {
            query: '',
            word: {
                secondary_def: '',
                primary_def: '',
                kanji: ''
            },
            results: [],
            set: [],
            levels: []
        }
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

    isDictionaryCompleteDownloaded = async () => {
        try {
            let value = await AsyncStorage.getItem('N4downloaded');
            if (value == 'true') {
                this.getWordOfTheDay();
            } else {
                console.log('Downloading dictionaries')
                await this.downloadN4vocabComplete();
                await this.downloadN4vocabParsed();
                this.setAsDownloaded();
                this.getWordOfTheDay();
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    downloadN4vocabParsed() {
        console.log(N4vocabParsed[0].kanji)
        for (let i = 0; i < N4vocabParsed.length; i++) {
            let word = {
                kanji: N4vocabParsed[i].kanji.toString(),
                furigana: N4vocabParsed[i].furigana.toString(),
                part_of_speech: N4vocabParsed[i].part_of_speech.toString(),
                primary_def: N4vocabParsed[i].primary_def.toString(),
                secondary_def: N4vocabParsed[i].secondary_def.toString(),
            }
            this.addWordToParsed(word);
        }
    }

    downloadN4vocabComplete() {
        console.log(N4vocabComplete[0].kanji)
        for (let i = 0; i < N4vocabComplete.length; i++) {
            let word = {
                kanji: N4vocabComplete[i].kanji.toString(),
                furigana: N4vocabComplete[i].hiragana.toString(),
                example: N4vocabComplete[i].example.toString(),
                translation: N4vocabComplete[i].translation.toString(),
                secondary_def: N4vocabComplete[i].entry.toString(),
                jlpt_kanji: N4vocabComplete[i].jlpt_kanji.toString(),
                jlpt_furigana: N4vocabComplete[i].jlpt_furigana.toString(),
                romaji: N4vocabComplete[i].romaji.toString(),
                primary_def: N4vocabComplete[i].jlpt_eng.toString(),
            }
            this.addWordToComplete(word);
        }
    }

    addWordToComplete = (word) => {
        Realm.open(dbOptionsComplete).then(realm => {
            realm.write(() => {
                var ID = realm.objects('DictionaryComplete').length + 1;
                realm.create('DictionaryComplete', {
                    id: ID,
                    kanji: word.kanji,
                    furigana: word.furigana,
                    example: word.example,
                    translation: word.translation,
                    secondary_def: word.secondary_def,
                    jlpt_kanji: word.jlpt_kanji,
                    jlpt_furigana: word.jlpt_furigana,
                    romaji: word.romaji,
                    primary_def: word.primary_def,
                });
            });
        })
    }

    addWordToParsed = (word) => {
        Realm.open(dbOptionsParsed).then(realm => {
            realm.write(() => {
                var ID = realm.objects('DictionaryParsed').length + 1;
                realm.create('DictionaryParsed', {
                    id: ID,
                    kanji: word.kanji,
                    furigana: word.furigana,
                    part_of_speech: word.part_of_speech,
                    secondary_def: word.secondary_def,
                    primary_def: word.primary_def,
                });
            })
        })
    }

    getWordOfTheDay() {
        console.log('get words oth day')
        Realm.open(dbOptionsParsed).then(realm => {
            let db = realm.objects('DictionaryParsed')
            let arr = []
            while (arr.length < 4) {
                let randomnumber = Math.floor(Math.random() * 100) + 1;
                if (arr.indexOf(randomnumber) > -1) continue;
                if(arr.length == 3){
                    console.log('third')
                    this.setState({
                        word: db[randomnumber]
                    })
                    break;
                } else {
                    arr.push(db[randomnumber])
                }
            }
            this.setState({
                levels: arr
            })
        });
    }


    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#F8F7F1',
            elevation: 0,
        },
        headerLeft: (
            <TouchableOpacity onPress={this.searchAnimate}>
                <Image style={{ height: 22, width: 22, marginLeft: 20 }} source={require('../assets/icons/menu.png')}></Image>
            </TouchableOpacity>
        ),
        headerTintColor: '#fff'
    };

    render() {

        const { navigate } = this.props.navigation;
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.MainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor='#F8F7F1' />
                <View>
                    <Text style={styles.wotdTitle}>{this.state.word.primary_def}</Text>
                    <Text style={styles.wotdJapan}>{this.state.word.kanji}</Text>
                    <Text numberOfLines={4} ellipsizeMode='tail' style={styles.wodtDefinition}>{this.state.word.secondary_def.replace(/[^;'.,a-z\d\s]+/gi, '')}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigate('Search')}>
                        <Text style={styles.buttonText}>See more</Text>
                        <Image style={{ marginTop: -1.5, height: 25, width: 25 }} source={require('../assets/icons/arrow_right.png')}></Image>
                    </TouchableOpacity>
                        <Text style={{fontSize: 18, color: '#000', fontFamily: 'Lora-Regular', marginTop: 50}}>Words of the day</Text>
                        <View>
                            <FlatList
                                style={{marginTop: 10, marginLeft: -12.5 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.levels}
                                keyExtractor={(item, index) => item.kanji}
                                renderItem={({ item, index }) =>
                                    <View style={styles.card}>
                                        <Text 
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                        style={{ fontSize: 18, fontFamily: 'Lora-Regular', color: '#3E3B3A' }}>{item.primary_def}</Text>
                                        <Text style={{marginTop: 10, color: "#000", fontSize: 16 }}>{item.kanji}</Text>
                                        <Text
                                            numberOfLines={3}
                                            ellipsizeMode='tail'
                                            style={{ marginTop: 10, fontSize: 13, fontFamily: 'SourceSansPro-Light', color: '#333'}}>{item.secondary_def}</Text>
                                    </View>
                                }
                            />
                        </View>
                        <Text style={{ fontSize: 18, color: '#000', fontFamily: 'Lora-Regular', marginTop: 30 }}>Flash cards</Text>
                        <View>
                            <FlatList
                                style={{ marginTop: 10, marginLeft: -12.5 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.levels}
                                keyExtractor={(item, index) => item.kanji}
                                renderItem={({ item, index }) =>
                                    <View style={styles.card}>
                                        <Text
                                            numberOfLines={2}
                                            ellipsizeMode='tail'
                                            style={{ fontSize: 18, fontFamily: 'Lora-Regular', color: '#3E3B3A' }}>{item.primary_def}</Text>
                                        <Text style={{ marginTop: 10, color: "#000", fontSize: 16 }}>{item.kanji}</Text>
                                        <Text
                                            numberOfLines={3}
                                            ellipsizeMode='tail'
                                            style={{ marginTop: 10, fontSize: 13, fontFamily: 'SourceSansPro-Light', color: '#333' }}>{item.secondary_def}</Text>
                                    </View>
                                }
                            />
                        </View>
                </View>
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        backgroundColor: '#F8F7F1',
        paddingTop: (Platform.OS) === 'ios' ? 20 : 20,
        paddingLeft: 20,
    },
    body: {
        padding: 15,
    },
    wotdTitle: {
        marginTop: '5%',
        fontSize: 40, 
        fontFamily: 'Lora-Bold', 
        color: '#000',
    },
    wotdJapan: {
        fontSize: 20,
        // fontWeight: '500',
        color: '#000',
        // fontStyle: 'italic'
    },
    wodtDefinition: {
        color: '#444', 
        marginTop: 15, 
        lineHeight: 22, 
        fontSize: 16,
        // letterSpacing: 0.3, 
        paddingRight: 60, 
        fontFamily: 'SourceSansPro-Light'
    },
    button: {
        flexDirection: 'row',
        // paddingVertical: 15,
        // paddingHorizontal: 35,
        marginTop: 10,
        // #edd2c8
        // backgroundColor: '#666',
        // borderWidth: .7,
        // alignSelf: 'center',
        borderRadius: 50,
    },
    buttonText: {
        fontSize: 14,
        color: '#444',
        textDecorationLine: 'underline',
        letterSpacing: 0.5,
        fontFamily: 'Lora-Italic'
    },
    card: {
        padding: 20,
        width: 180,
        height: 180,
        margin: 10,
        elevation: 4,
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
});
