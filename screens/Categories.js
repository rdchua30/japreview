import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View, TextInput, TouchableOpacity, StatusBar, FlatList, Image, Button, ImageBackground
} from 'react-native';
import ListItem from '../components/ListItem'
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

export default class Categories extends React.Component {

    constructor() {
        super();
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
                    text: 'Occaecat non tempor reprehenderit.',
                    img: require('../assets/images/image5.jpg')
                },
                {
                    title: 'Grammar',
                    text: 'Sunt veniam aliqua amet deserunt.',
                    img: require('../assets/images/image3.jpg')
                },
                {
                    title: 'Vocabulary',
                    text: 'Occaecat non tempor reprehenderit.',
                    img: require('../assets/images/image6.jpg')
                }, {
                    title: 'Grammar',
                    text: 'Sunt veniam aliqua amet deserunt magna ex.',
                    img: require('../assets/images/image7.jpg')
                }
            ]
        }
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
                <Icon style={{ paddingRight: 10 }} name="more-vert" size={26} color="#333" />
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
        return (
            <View style={styles.MainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor='#fff' />
                <Text style={styles.heading}>Categories</Text>
                <View style={{ marginTop: -15, marginLeft: -12.5 }}>
                    <FlatList
                        style={{ marginTop: 15, height: 250 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.levels}
                        keyExtractor={(item, index) => item.title}
                        renderItem={({ item, index }) =>
                            <View style={{ paddingHorizontal: 10 }}>
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
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingLeft: 20,
        paddingTop: (Platform.OS) === 'ios' ? 20 : 20,
    }, 
    heading: {
        color: '#333',
        fontSize: 24,
        fontWeight: '700'
        // fontFamily: 'Lora-Bold',
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
    card: {
        width: 150,
        height: 210,
        elevation: 8,
        borderRadius: 4,
        marginTop: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    cardTitle: {
        fontFamily: 'Lora-Bold',
        // textAlign: 'center',
        fontSize: 20,
        color: '#fff',
        alignSelf: 'center',
        marginTop: 120
    },
    divider: {
        marginTop: 15,
        width: 35,
        borderBottomWidth: 1,
        borderRadius: 3,
        alignSelf: 'center',
        borderColor: '#fff',
        backgroundColor: '#fff'
    },
    cardContent: {
        fontSize: 10,
        marginTop: 15,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'SourceSansPro-SemiBold',
        letterSpacing: 1,
        paddingHorizontal: 20
    },
    cardFooter: {
        marginTop: 40,
        fontSize: 10,
        color: '#fff',
        letterSpacing: 3,
        fontFamily: 'SourceSansPro-Bold',
        textAlign: 'center',
    }
});
