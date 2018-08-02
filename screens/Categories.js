import React, { Component } from 'react';
import { Platform,StyleSheet,Text, View, TouchableOpacity, StatusBar, FlatList, Image } from 'react-native';
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
                    title: 'Minna No Nihongo I',
                    text: 'Occaecat non tempor reprehenderit.',
                    img: require('../assets/images/image9.jpg')
                },
                {
                    title: 'Minna No Nihongo II',
                    text: 'Sunt veniam aliqua amet deserunt.',
                    img: require('../assets/images/image10.jpg')
                },
                {
                    title: 'Genki I',
                    text: 'Occaecat non tempor reprehenderit.',
                    img: require('../assets/images/image11.jpg')
                }, {
                    title: 'Genki II',
                    text: 'Sunt veniam aliqua amet deserunt magna ex.',
                    img: require('../assets/images/image12.jpg')
                }
            ],
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
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.MainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor='#fff' />
                <Text style={styles.heading}>CATEGORIES</Text>
                <View style={{ marginLeft: -12.5 }}>
                <FlatList
                        style={{ marginTop: 5, height: 250 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.levels}
                        keyExtractor={(item, index) => item.title}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity style={{ paddingHorizontal: 12.5 }}  onPress={() => navigate('MNN1Vocabulary')}>
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <View style={styles.divider}></View>
                                    <Text style={styles.cardContent}>{item.text}</Text>
                                    <Text style={styles.cardFooter}>explore</Text>
                                </View>
                            </TouchableOpacity>
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
        color: '#000',
        marginTop: -10,
        fontSize: 14,
        letterSpacing: 1,
        fontFamily: 'Raleway-Regular',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 35,
        marginTop: 70,
        backgroundColor: '#d1ada9',
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
        width: 130,
        height: 180,
        elevation: 10,
        borderRadius: 4,
        padding: 15,
        marginTop: 20,
        backgroundColor: 'white',
    },
    cardTitle: {
        marginTop: 5,
        fontFamily: 'PlayfairDisplay-Bold',
        fontSize: 18,
        color: '#000',
        letterSpacing: 0.5,
    },
    divider: {
        marginTop: 8,
        width: 35,
        borderBottomWidth: 1,
        borderRadius: 3,
        borderColor: '#000',
        backgroundColor: '#000'
    },
    cardContent: {
        fontSize: 12,
        marginTop: 8,
        color: '#000',
        fontFamily: 'OpenSans-Light',
        maxWidth: 120,
        letterSpacing: 0.4,
    },
    cardFooter: {
        position: 'absolute',
        bottom: 10,
        left: 15,
        fontSize: 12,
        color: '#d1ada9',
        letterSpacing: 0.3,
        fontFamily: 'PlayfairDisplay-Italic',
        // textAlign: 'center',
    },
    category: {
        marginTop: 25,
        fontSize: 16,
        // fontFamily: 'Lora-Regular',
        fontWeight: '700',
        color: '#000'
    }
});
