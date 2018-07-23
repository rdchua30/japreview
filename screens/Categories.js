import React, { Component } from 'react';
import {
    Platform,
    StyleSheet, Text,
    View, TouchableOpacity, StatusBar, FlatList, Image, Button, ImageBackground,
} from 'react-native';
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
            levels: [{
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

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#fafafa',
            elevation: 0,
        },
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
        return (
            <View style={styles.MainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor='#fff' />
                <Text style={styles.heading}>Categories</Text>
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
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        backgroundColor: '#fafafa',
        // alignItems: 'center',
        paddingLeft: 20,
        paddingTop: (Platform.OS) === 'ios' ? 20 : 20,
    },
    heading: {
        color: '#333',
        fontSize: 30,
        marginTop: -10,
        fontFamily: 'Lora-Bold',
        // letterSpacing: 2
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
