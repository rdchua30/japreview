import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text, ScrollView, ImageBackground, ActivityIndicator,
    View, TextInput, TouchableOpacity, Alert, AsyncStorage, StatusBar, FlatList, Image, Button, Animated
} from 'react-native';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import N5N4vocab from '../assets/N5N4vocab.json';
import N4vocabParsed from '../assets/N4vocab.json';
import RNFetchBlob from 'rn-fetch-blob';
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
            levels: [
                {
                    title: 'Vocabulary',
                    text: 'Occaecat non tempor reprehenderit duis mollit sint incididunt.',
                    img: require('../assets/images/image5.jpg')
                },
                {
                    title: 'Grammar',
                    text: 'Sunt veniam aliqua amet deserunt magna ex.',
                    img: require('../assets/images/image3.jpg')
                },
                {
                    title: 'Vocabulary',
                    text: 'Occaecat non tempor reprehenderit duis mollit sint incididunt.',
                    img: require('../assets/images/image6.jpg')
                }, {
                    title: 'Grammar',
                    text: 'Sunt veniam aliqua amet deserunt magna ex.',
                    img: require('../assets/images/image7.jpg')
                }
            ]
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
                await this.downloadN5N4vocab();
                await this.downloadN4vocabParsed();
                this.setAsDownloaded();
                this.getWordOfTheDay();
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    downloadN4vocabParsed() {
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

    downloadN5N4vocab() {
        for (let i = 0; i < N5N4vocab.length; i++) {
            let word = {
                id: i,
                kanji: N5N4vocab[i].kanji.toString(),
                kanji_with_furigana: N5N4vocab[i].kanji_with_furigana.toString(),
                furigana: N5N4vocab[i].furigana.toString(),
                english_meaning: N5N4vocab[i].english_meaning.toString(),
                word_audio_file: N5N4vocab[i].word_audio_file.toString(),
                part_of_speech: N5N4vocab[i].part_of_speech.toString(),
                sentence_kanji: N5N4vocab[i].sentence_kanji.toString(),
                sentence_with_furigana: N5N4vocab[i].sentence_with_furigana.toString(),
                sentence_furigana: N5N4vocab[i].sentence_furigana.toString(),
                sentence_translation: N5N4vocab[i].sentence_translation.toString(),
                something: N5N4vocab[i].something.toString(),
                sentence_audio_file: N5N4vocab[i].sentence_audio_file.toString(),
            }
            this.addWordToComplete(word);
        }
    }

    addWordToComplete = (word) => {
        Realm.open(dbOptionsComplete).then(realm => {
            realm.write(() => {
                realm.create('DictionaryComplete', {
                    id: word.id,
                    kanji: word.kanji,
                    kanji_with_furigana: word.kanji_with_furigana,
                    furigana: word.furigana,
                    english_meaning: word.english_meaning,
                    word_audio_file: word.word_audio_file,
                    part_of_speech: word.part_of_speech,
                    sentence_kanji: word.sentence_kanji,
                    sentence_with_furigana: word.sentence_with_furigana,
                    sentence_furigana: word.sentence_furigana,
                    sentence_translation: word.sentence_translation,
                    something: word.something,
                    sentence_audio_file: word.sentence_audio_file,
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
        Realm.open(dbOptionsComplete).then(realm => {
            let db = realm.objects('DictionaryComplete')
            let randomnumber = Math.floor(Math.random() * db.length) + 1;
            this.setState({
                word: db[randomnumber]
            })
        });
    }

    downloadMedia() {
        let dirs = RNFetchBlob.fs.dirs
        RNFetchBlob.config({
                path: dirs.DownloadDir + '/mediaFiles.zip',
                notification : false,
                appendExt : 'zip',
                useDownloadManager : true,
                fileCache: true,
            }).fetch('GET', 'https://drive.google.com/uc?export=download&id=1narht9B8Wo0Iv6BmTHgvvkw_uzS_vayR', {
                //some headers ..
            }).progress((received, total) => {
                console.log(received + '/' + total)
            }).then((res) => {
                console.log('The file saved to ', res.path())
                let sourcePath = dirs.DownloadDir + '/mediaFiles.zip'
                let targetPath = dirs.DownloadDir + '/audioFiles'
                this.unzipFile(sourcePath, targetPath);
            })
    }

    unzipFile(sourcePath, targetPath){
        unzip(sourcePath, targetPath)
            .then((path) => {
                console.log(`unzip completed at ${path}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    capitalize = (str) => {
        console.log(str)
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#fafafa',
            elevation: 0,
        },
        // headerTitleStyle: {
        //     fontSize: 24,
        //     fontFamily: 'SourceSansPro-Bold',
        //     fontWeight: '1000'
        // },
        // headerTitle: 'Japanese Review',
        headerRight: (
            <TouchableOpacity >
                <Icon style={{paddingRight: 10}} name="more-vert" size={26} color="#333" />
            </TouchableOpacity>
        ),
        headerLeft: (
            <TouchableOpacity onPress={this.searchAnimate}>
                <Image style={{ height: 22, width: 22, marginLeft: 20 }} source={require('../assets/icons/menu.png')}></Image>
            </TouchableOpacity>
        ),
        headerTintColor: '#000'
    };

    render() {

        const { navigate } = this.props.navigation;
        if(this.state.word.english_meaning){
            return (
                // <ImageBackground source={require('../assets/images/image16.png')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.MainContainer}>
                    {/* <StatusBar barStyle="dark-content" backgroundColor='#F8F7F1' /> */}
                    <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />
                    <View>
                        <Text style={styles.heading}>Word of the day</Text>
                        <Text style={styles.wotdTitle}>{this.state.word.english_meaning}</Text>
                        <Text style={styles.wotdJapan}>{this.state.word.kanji}, {this.state.word.furigana}</Text>
                        {/* <Text numberOfLines={4} ellipsizeMode='tail' style={styles.wodtDefinition}>{this.state.word.sentence_translation}</Text> */}
                        <Text numberOfLines={4} ellipsizeMode='tail' style={styles.wodtDefinition}>Consequat nostrud laboris sunt aliquip veniam proident eu officia ullamco nulla Lorem magna. Velit consequat dolor ullamco elit. Ea voluptate cillum esse proident amet eiusmod laboris. Incididunt adipisicing voluptate labore ad consectetur eiusmod velit amet sit commodo non.</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.button} onPress={() => navigate('Categories')}>
                                <Text style={styles.buttonText}>See more</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigate('Quiz')}>
                                <Text style={styles.buttonText}>Take Quiz</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.button} onPress={() => this.downloadMedia()}>
                                <Text style={styles.buttonText}>Download</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View style={{marginTop: 0, marginLeft: -12.5}}>
                            <FlatList
                                style={{marginTop: 10, height: 420 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.levels}
                                keyExtractor={(item, index) => item.title}
                                renderItem={({ item, index }) =>
                                <View style={{ paddingHorizontal: 15 }}>
                                        <ImageBackground imageStyle={{ borderRadius: 5 }} style={styles.card} source={item.img}>
                                            <Text style={styles.cardTitle}>{item.title}</Text>
                                            <View style={styles.divider}></View>
                                            <Text style={styles.cardContent}>{item.text}</Text>
                                            <Text style={styles.cardFooter}>EXPLORE</Text>
                                        </ImageBackground>
                                    </View>
                                }
                                />
                        </View>
                    </View>
                </View>
                // </ImageBackground >
            );
        } else {
            return(
                <View>
                    <ActivityIndicator size="large" color="#555" />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        paddingLeft: 20,
        backgroundColor: '#fafafa',
        paddingTop: (Platform.OS) === 'ios' ? 20 : 20,
    },
    body: {
        padding: 15,
    },
    heading: {
        color: '#333',
        fontSize: 14,
        marginTop: -15,
        fontFamily: 'Lora-Regular',
        // letterSpacing: 2
    },
    wotdTitle: {
        marginTop: 0,
        fontSize: 36,
        paddingRight: 15,
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
        marginTop: 20,
        lineHeight: 22,
        fontSize: 16,
        // letterSpacing: 0.3, 
        paddingRight: 60,
        fontFamily: 'SourceSansPro-Light'
    },
    button: {
        elevation: 10,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginTop: 30,
        // #edd2c8
        backgroundColor: '#57545D',
        // borderWidth: .7,
        // alignSelf: 'center',
        width: 130,
        marginRight: 15,
        borderRadius: 50,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        // textDecorationLine: 'underline',
        letterSpacing: 0.5,
        fontFamily: 'SourceSansPro-SemiBold'
    },
    card: {
        width: 250,
        height: 360,
        elevation: 10,
        borderRadius: 8,
        marginTop: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    cardTitle: {
        fontFamily: 'Lora-Bold',
        // textAlign: 'center',
        fontSize: 34,
        color: '#fff',
        alignSelf: 'center',
        marginTop: 120
    },
    divider: {
        marginTop: 15,
        width: 50,
        borderBottomWidth: 2,
        borderRadius: 3,
        alignSelf: 'center',
        borderColor: '#fff',
        backgroundColor: '#fff'
    },
    cardContent: {
        fontSize: 12,
        marginTop: 15,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'SourceSansPro-SemiBold',
        letterSpacing: 1,
        paddingHorizontal: 20
    },
    cardFooter: {
        marginTop: 40,
        fontSize: 12,
        color: '#fff',
        letterSpacing: 3,
        fontFamily: 'SourceSansPro-Bold',
        textAlign: 'center',
    }
});
