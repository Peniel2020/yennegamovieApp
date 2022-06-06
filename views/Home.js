import React, { useEffect, useState } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Linking,
    Text,
    useColorScheme,
    View,
    Image,
    Modal,
    ActivityIndicator,
    TouchableHighlight,
    TouchableOpacity,
    Platform
} from 'react-native';

import { WebView } from 'react-native-webview';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import { H1, H2, H3, H4, normalize } from '../components/Views/views';

import LinearGradient from 'react-native-linear-gradient';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { FocusContext, Button } from 'react-native-tvfocus';
import api from '../utils/api';
import styleComponent from '../components/styles/style';
import NavBar from '../components/Views/navbar';

const Home = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [movies, setMovies] = useState([]);

    const [allMedia, setAllMedia] = useState([]);
    const [subscriptionMedia, setSubscriptionMedia] = useState([]);
    const [romanceMedia, setRomanceMedia] = useState([]);
    const [comedyMedia, setComedyMedia] = useState([]);
    const [actionMedia, setActionMedia] = useState([]);
    const [dramaMedia, setDramaMedia] = useState([]);
    const [mysteryMedia, setMysteryMedia] = useState([]);
    const [focusedID, setFocusedID] = useState([]);
    const [focusedCatID, setFocusedCatID] = useState([]);
    const [selectedCatName, setSelectedCatName] = useState('all');
    const [loading, setLoading] = useState(true);
    const mainRef = React.createRef();

    useEffect(() => {
        if(!props.user){
            props.navigation.navigate('Login');
        }
        setLoading(true);
        setSubscriptionMedia(props.subscriptionMedia);
        setRomanceMedia(props.romanceMedia);
        setComedyMedia(props.comedyMedia);
        setActionMedia(props.actionMedia);
        setDramaMedia(props.dramaMedia);
        setMysteryMedia(props.mysteryMedia);
        setLoading(false);
    }, [props.allMedia, props.subscriptionMedia, props.romanceMedia, props.comedyMedia, props.actionMedia, props.dramaMedia]);

    const mediaClicked = (media) => {
        console.log('clicked');
        props.setSelectedMedia(media);
        props.navigation.navigate('Details');
    }

    const handleBlur = (index) => {
        if (index == 0) {
            setFocusedID('none');
        }
    }

    const filterMovie = (type) => {
        setLoading(true);
        switch (type) {
            case 'all' : {
                setSubscriptionMedia(props.subscriptionMedia);
                setRomanceMedia(props.romanceMedia);
                setComedyMedia(props.comedyMedia);
                setActionMedia(props.actionMedia);
                setDramaMedia(props.dramaMedia);
                setMysteryMedia(props.mysteryMedia);
                setLoading(false);
                break;
            }
            default : {
                var subM = props.subscriptionMedia.filter((mv) =>{
                    return mv.tag.includes(type) ? true : false;
                });
                setSubscriptionMedia(subM);

                var romM = props.romanceMedia.filter((mv) =>{
                    return mv.tag.includes(type) ? true : false;
                });
                setRomanceMedia(romM);

                var comM = props.comedyMedia.filter((mv) =>{
                    return mv.tag.includes(type) ? true : false;
                });
                setComedyMedia(comM);

                var acM = props.actionMedia.filter((mv) =>{
                    return mv.tag.includes(type) ? true : false;
                });
                setActionMedia(acM);

                var draM = props.dramaMedia.filter((mv) =>{
                    return mv.tag.includes(type) ? true : false;
                });
                setDramaMedia(draM);

                var mysM = props.mysteryMedia.filter((mv) =>{
                    return mv.tag.includes(type) ? true : false;
                })
                setMysteryMedia(mysM);

                setLoading(false);
                break;
            }
        }
    }

    const active = useIsFocused();

    return (
        <FocusContext active={active}>
            <LinearGradient colors={['#412c07', '#f3a015', '#412c07']} style={styles.linearGradient}>
                <NavBar  {...props} />
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableHighlight style={{borderBottomEndRadius: normalize(3), borderBottomStartRadius: normalize(3)}}
                        onPress={() => filterMovie('all')}
                        // onBlur={() => handleBlur(i)}
                        onFocus={() => setFocusedCatID('all')}
                    >
                        <View style={{margin:normalize(3)}}>
                            <Text style={focusedCatID == 'all' ? styleComponent.allStyles.catTouchFocusedShadow : styleComponent.allStyles.catTouchUnfocusedShadow}>
                                All
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{borderBottomEndRadius: normalize(3), borderBottomStartRadius: normalize(3)}}
                        onPress={() => filterMovie('lm')}
                        // onBlur={() => handleBlur(i)}
                        onFocus={() => setFocusedCatID('lm')}
                    >
                        <View style={{margin:normalize(3)}}>
                            <Text style={focusedCatID == 'lm' ? styleComponent.allStyles.catTouchFocusedShadow : styleComponent.allStyles.catTouchUnfocusedShadow}>
                                Long Métrage
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{borderBottomEndRadius: normalize(3), borderBottomStartRadius: normalize(3)}}
                        onPress={() => filterMovie('cm')}
                        // onBlur={() => handleBlur(i)}
                        onFocus={() => setFocusedCatID('cm')}
                    >
                        <View style={{margin:normalize(3)}}>
                            <Text style={focusedCatID == 'cm' ? styleComponent.allStyles.catTouchFocusedShadow : styleComponent.allStyles.catTouchUnfocusedShadow}>
                                Court Métrage
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{borderBottomEndRadius: normalize(3), borderBottomStartRadius: normalize(3)}}
                        onPress={() => filterMovie('serie')}
                        // onBlur={() => handleBlur(i)}
                        onFocus={() => setFocusedCatID('serie')}
                    >
                        <View style={{margin:normalize(3)}}>
                            <Text style={focusedCatID == 'serie' ? styleComponent.allStyles.catTouchFocusedShadow : styleComponent.allStyles.catTouchUnfocusedShadow}>
                                Série
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{borderBottomEndRadius: normalize(3), borderBottomStartRadius: normalize(3)}}
                        onPress={() => filterMovie('doc')}
                        // onBlur={() => handleBlur(i)}
                        onFocus={() => setFocusedCatID('doc')}
                    >
                        <View style={{margin:normalize(3)}}>
                            <Text style={focusedCatID == 'doc' ? styleComponent.allStyles.catTouchFocusedShadow : styleComponent.allStyles.catTouchUnfocusedShadow}>
                                Documentaires
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{borderBottomEndRadius: normalize(3), borderBottomStartRadius: normalize(3)}}
                        onPress={() => filterMovie('em')}
                        // onBlur={() => handleBlur(i)}
                        onFocus={() => setFocusedCatID('emission')}
                    >
                        <View style={{margin:normalize(3)}}>
                            <Text style={focusedCatID == 'emission' ? styleComponent.allStyles.catTouchFocusedShadow : styleComponent.allStyles.catTouchUnfocusedShadow}>
                                Emission
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styleComponent.allStyles.flexColumn}>
                    {!loading ? (
                        <ScrollView>
                            <View style={{...styleComponent.allStyles.flexColumn, paddingTop: 25 }}>
                                <LinearGradient
                                    style={{ marginTop: normalize(15), height: normalize(19), padding: normalize(5), borderTopLeftRadius: normalize(3) }}
                                    colors={['#000000', '#ffffff00']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: normalize(7), width: '100%' }}>Incluts dans la Souscription</Text>
                                    </View>
                                </LinearGradient>
                                <ScrollView horizontal={true} style={styleComponent.allStyles.flexRow}>
                                    <View style={styleComponent.allStyles.flexRow}>
                                        {subscriptionMedia.map((media, i) => {
                                            return (
                                                <View key={i + '-subscriptionMedia'} style={focusedID == 'sub-' + i ? styleComponent.allStyles.posterFocusedShadow : styleComponent.allStyles.posterUnfocusedShadow}>

                                                    <TouchableHighlight style={focusedID == 'sub-' + i ? styleComponent.allStyles.posterTouchFocusedShadow : styleComponent.allStyles.posterTouchUnfocusedShadow} onPress={() => mediaClicked(media)} onBlur={() => handleBlur(i)} onFocus={() => setFocusedID('sub-' + i)}>
                                                        <Image
                                                            style={focusedID == 'sub-' + i ? styleComponent.allStyles.posterImgFocusedShadow : styleComponent.allStyles.posterImgUnfocusedShadow}
                                                            source={{
                                                                uri: media.media_poster,
                                                            }}
                                                        />
                                                    </TouchableHighlight>
                                                    <Text style={{ textAlign: 'center', maxWidth: normalize(45), flexWrap: 'wrap' }}>{media.title}</Text>
                                                </View>
                                            )
                                        })}
                                        {subscriptionMedia.length < 1 ? (
                                            <View style={{height: normalize(15)}}>
                                                <Text>No match</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </ScrollView>

                                <LinearGradient
                                    style={{ marginTop: normalize(10), height: normalize(19), padding: normalize(5), borderTopLeftRadius: normalize(3) }}
                                    colors={['#000000', '#ffffff00']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: normalize(7), width: '100%' }}>Romance</Text>
                                    </View>
                                </LinearGradient>
                                <ScrollView horizontal={true} style={styleComponent.allStyles.flexRow}>
                                    <View style={styleComponent.allStyles.flexRow}>
                                        {romanceMedia.map((media, i) => {
                                            return (
                                                <View key={i + '-romance'} style={focusedID == 'romance-' + i ? styleComponent.allStyles.posterFocusedShadow : styleComponent.allStyles.posterUnfocusedShadow}>

                                                    <TouchableHighlight style={focusedID == 'romance-' + i ? styleComponent.allStyles.posterTouchFocusedShadow : styleComponent.allStyles.posterTouchUnfocusedShadow} onPress={() => mediaClicked(media)} onBlur={() => handleBlur(i)} onFocus={() => setFocusedID('romance-' + i)}>
                                                        <Image
                                                            style={focusedID == 'romance-' + i ? styleComponent.allStyles.posterImgFocusedShadow : styleComponent.allStyles.posterImgUnfocusedShadow}
                                                            source={{
                                                                uri: media.media_poster,
                                                            }}
                                                        />
                                                    </TouchableHighlight>
                                                    <Text style={{ textAlign: 'center', maxWidth: normalize(45), flexWrap: 'wrap' }}>{media.title}</Text>
                                                </View>
                                            )
                                        })}
                                        {romanceMedia.length < 1 ? (
                                            <View style={{height: normalize(15)}}>
                                                <Text>No match</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </ScrollView>

                                <LinearGradient
                                    style={{ marginTop: normalize(10), height: normalize(19), padding: normalize(5), borderTopLeftRadius: normalize(3) }}
                                    colors={['#000000', '#ffffff00']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: normalize(7), width: '100%' }}>Comedie</Text>
                                    </View>
                                </LinearGradient>
                                <ScrollView horizontal={true} style={styleComponent.allStyles.flexRow}>
                                    <View style={styleComponent.allStyles.flexRow}>
                                        {comedyMedia.map((media, i) => {
                                            return (
                                                <View key={i + '-com'} style={focusedID == 'com-' + i ? styleComponent.allStyles.posterFocusedShadow : styleComponent.allStyles.posterUnfocusedShadow}>

                                                    <TouchableHighlight style={focusedID == 'com-' + i ? styleComponent.allStyles.posterTouchFocusedShadow : styleComponent.allStyles.posterTouchUnfocusedShadow} onPress={() => mediaClicked(media)} onBlur={() => handleBlur(i)} onFocus={() => setFocusedID('com-' + i)}>
                                                        <Image
                                                            style={focusedID == 'com-' + i ? styleComponent.allStyles.posterImgFocusedShadow : styleComponent.allStyles.posterImgUnfocusedShadow}
                                                            source={{
                                                                uri: media.media_poster,
                                                            }}
                                                        />
                                                    </TouchableHighlight>
                                                    <Text style={{ textAlign: 'center', maxWidth: normalize(45), flexWrap: 'wrap' }}>{media.title}</Text>
                                                </View>
                                            )
                                        })}
                                        {comedyMedia.length < 1 ? (
                                            <View style={{height: normalize(15)}}>
                                                <Text>No match</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </ScrollView>

                                <LinearGradient
                                    style={{ marginTop: normalize(10), height: normalize(19), padding: normalize(5), borderTopLeftRadius: normalize(3) }}
                                    colors={['#000000', '#ffffff00']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: normalize(7), width: '100%' }}>Action</Text>
                                    </View>
                                </LinearGradient>
                                <ScrollView horizontal={true} style={styleComponent.allStyles.flexRow}>
                                    <View style={styleComponent.allStyles.flexRow}>
                                        {actionMedia.map((media, i) => {
                                            return (
                                                <View key={i + '-action'} style={focusedID == 'action-' + i ? styleComponent.allStyles.posterFocusedShadow : styleComponent.allStyles.posterUnfocusedShadow}>

                                                    <TouchableHighlight style={focusedID == 'action-' + i ? styleComponent.allStyles.posterTouchFocusedShadow : styleComponent.allStyles.posterTouchUnfocusedShadow} onPress={() => mediaClicked(media)} onBlur={() => handleBlur(i)} onFocus={() => setFocusedID('action-' + i)}>
                                                        <Image
                                                            style={focusedID == 'action-' + i ? styleComponent.allStyles.posterImgFocusedShadow : styleComponent.allStyles.posterImgUnfocusedShadow}
                                                            source={{
                                                                uri: media.media_poster,
                                                            }}
                                                        />
                                                    </TouchableHighlight>
                                                    <Text style={{ textAlign: 'center', maxWidth: normalize(45), flexWrap: 'wrap' }}>{media.title}</Text>
                                                </View>
                                            )
                                        })}
                                        {actionMedia.length < 1 ? (
                                            <View style={{height: normalize(15)}}>
                                                <Text>No match</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </ScrollView>

                                <LinearGradient
                                    style={{ marginTop: normalize(10), height: normalize(19), padding: normalize(5), borderTopLeftRadius: normalize(3) }}
                                    colors={['#000000', '#ffffff00']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: normalize(7), width: '100%' }}>Drama</Text>
                                    </View>
                                </LinearGradient>
                                <ScrollView horizontal={true} style={styleComponent.allStyles.flexRow}>
                                    <View style={styleComponent.allStyles.flexRow}>
                                        {dramaMedia.map((media, i) => {
                                            return (
                                                <View key={i + '-drama'} style={focusedID == 'drama-' + i ? styleComponent.allStyles.posterFocusedShadow : styleComponent.allStyles.posterUnfocusedShadow}>

                                                    <TouchableHighlight style={focusedID == 'drama-' + i ? styleComponent.allStyles.posterTouchFocusedShadow : styleComponent.allStyles.posterTouchUnfocusedShadow} onPress={() => mediaClicked(media)} onBlur={() => handleBlur(i)} onFocus={() => setFocusedID('drama-' + i)}>
                                                        <Image
                                                            style={focusedID == 'drama-' + i ? styleComponent.allStyles.posterImgFocusedShadow : styleComponent.allStyles.posterImgUnfocusedShadow}
                                                            source={{
                                                                uri: media.media_poster,
                                                            }}
                                                        />
                                                    </TouchableHighlight>
                                                    <Text style={{ textAlign: 'center', maxWidth: normalize(45), flexWrap: 'wrap' }}>{media.title}</Text>
                                                </View>
                                            )
                                        })}
                                        {dramaMedia.length < 1 ? (
                                            <View style={{height: normalize(15)}}>
                                                <Text>No match</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </ScrollView>

                                <LinearGradient
                                    style={{ marginTop: normalize(10), height: normalize(19), padding: normalize(5), borderTopLeftRadius: normalize(3) }}
                                    colors={['#000000', '#ffffff00']}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: normalize(7), width: '100%' }}>Mystère</Text>
                                    </View>
                                </LinearGradient>
                                <ScrollView horizontal={true} style={styleComponent.allStyles.flexRow}>
                                    <View style={styleComponent.allStyles.flexRow}>
                                        {mysteryMedia.map((media, i) => {
                                            return (
                                                <View key={i + '-myst'} style={focusedID == 'myst-' + i ? styleComponent.allStyles.posterFocusedShadow : styleComponent.allStyles.posterUnfocusedShadow}>

                                                    <TouchableHighlight style={focusedID == 'myst-' + i ? styleComponent.allStyles.posterTouchFocusedShadow : styleComponent.allStyles.posterTouchUnfocusedShadow} onPress={() => mediaClicked(media)} onBlur={() => handleBlur(i)} onFocus={() => setFocusedID('myst-' + i)}>
                                                        <Image
                                                            style={focusedID == 'myst-' + i ? styleComponent.allStyles.posterImgFocusedShadow : styleComponent.allStyles.posterImgUnfocusedShadow}
                                                            source={{
                                                                uri: media.media_poster,
                                                            }}
                                                        />
                                                    </TouchableHighlight>
                                                    <Text style={{ textAlign: 'center', maxWidth: normalize(45), flexWrap: 'wrap' }}>{media.title}</Text>
                                                </View>
                                            )
                                        })}
                                        {mysteryMedia.length < 1 ? (
                                            <View style={{height: normalize(15)}}>
                                                <Text>No match</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </ScrollView>

                            </View>
                        </ScrollView>
                    ) : (
                        <ActivityIndicator size="large" color="#b5a642" />
                    )}
                </View>
            </LinearGradient>
        </FocusContext>
    );
}


const styles = StyleSheet.create({
    homeBody: {
        margin: 0,
        padding: 0,

    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        // borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});

export default Home;