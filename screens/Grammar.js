import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text, ScrollView, TouchableHighlight,
    View, TextInput, TouchableOpacity, Alert, AsyncStorage, StatusBar, FlatList, Image, Button, Animated
} from 'react-native';
import ListItem from '../components/ListItem'
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

const dbOptions = {
    path: 'dictionary_parsed.realm',
    schema: [DictionaryParsed]
}

let realm;

export default class Search extends React.Component {

    constructor() {
        super();
        this.isDictionaryDownloaded()
        // downloadN5vocab();
        this.state = {
            query: '',
            results: [],
            isSearching: false
        }
    }

    isDictionaryDownloaded = async () => {
        try {
            let value = await AsyncStorage.getItem('N4downloaded');
            console.log(value)
            if (value === 'true') {
                this.alertWord();
            } else {
                Alert.alert('Downloading Dictionary')
                this.downloadN4vocab();
                this.setAsDownloaded();
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    searchWord = (query) => {
        Realm.open(dbOptions).then(realm => {
            let results = realm.objects('DictionaryParsed').filtered('primary_def CONTAINS "' + query.toLowerCase() + '"')
            this.setState({
                results: []
            })
            this.setState({
                results: results
            })
        })
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
        },
        headerTintColor: '#333'
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.MainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor='#fff' />
                <Animated.View style={[styles.body, { width: '100%' }]}>
                    <ScrollView>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={this.state.results}
                            keyExtractor={(item, index) => item.kanji}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity onPress={() => navigate('Word', {
                                    word: item
                                })}>
                                    <ListItem index={index} kanji={item.kanji} primary_def={item.primary_def} secondary_def={item.secondary_def.replace(/[^;'.,a-z\d\s]+/gi, '')}></ListItem>
                                </TouchableOpacity>
                            }
                        />
                    </ScrollView>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: (Platform.OS) === 'ios' ? 20 : 20,
    },
    navbar: {
        height: 64,
        backgroundColor: 'white',
        elevation: 3,
    },
    wordContainer: {
        paddingVertical: 15,
        paddingHorizontal: 5,
        // elevation: 2,
        // backgroundColor: 'white',
        margin: 5,
        borderRadius: 5
    },
    body: {
        padding: 15,
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
    TextInputStyle: {
        marginTop: '-10%',
        height: 120,
        paddingLeft: 10,
        width: '100%',
        fontSize: 30,
        color: 'black',
        paddingRight: 20,
        fontFamily: 'Lora-Bold'
    },
    TextInputStyle2: {
        paddingLeft: 25,
        paddingTop: 20,
        position: 'absolute',
        width: '100%',
        fontSize: 30,
        color: 'black',
        fontFamily: 'Lora-Bold'
    },
    card: {
        padding: 20,
        width: 180,
        margin: 10,
        marginBottom: 0,
        elevation: 10,
        height: 210,
        overflow: 'hidden',
        borderRadius: 15,
        backgroundColor: '#fff',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 35,
        marginTop: 70,
        backgroundColor: '#d1ada9',
        // borderWidth: .7,
        alignSelf: 'center',
        borderRadius: 50,
        borderColor: '#000'
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'SourceSansPro-Regular'
    },
});
