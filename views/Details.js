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
    TouchableWithoutFeedback,
    Platform,
    Dimensions
} from 'react-native';

import { WebView } from 'react-native-webview';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import VideoPlayer from '../components/player/player'
import LinearGradient from 'react-native-linear-gradient';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { FocusContext, Button } from 'react-native-tvfocus';
import { H1, H2, H3, H4, normalize } from '../components/Views/views';
import api from '../utils/api';
import styleComponent from '../components/styles/style';
import NavBar from '../components/Views/navbar';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const Details = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [movie, setMovie] = useState([]);
    const [focusedID, setFocusedID] = useState('none');
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [url, setUrl] = useState(false);
    const [poster, setPoster] = useState(false);
    const [isRented, setIsRented] = useState(false);
    const [movieKey, setMovieKey] = useState(false);
    const [isProcessingErr, setIsProcessingErr] = React.useState(false);
    const [isProcessingErrMsg, setIsProcessingErrMsg] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [selectedEp, setSelectedEp] = React.useState(false);
    const mainRef = React.createRef();

    useEffect(() => {
        if(!props.user){
            props.navigation.navigate('Login');
        }
        checkMovie();
    }, []);

    const playBA = () => {
        // setUrl(props.selectedMedia.media_trailer);
        // console.log('Setting trailer links: ', props.selectedMedia.media_trailer);
        // setPoster(props.selectedMedia.media_poster)
        props.setVideoUrl(props.selectedMedia.media_trailer);
        props.navigation.navigate('VideoPlayer');
    }

    const playSerieEp = (k) => {
        setSelectedEp(k);
        playRented(k);
    }

    const playRented = (k) => {

        var ts = "http://10.0.0.99:3000/tv-player?movieid=" + props.selectedMedia.id + "&useruid=" + props.user.user_uid + "&moviekey=" + k + "&poster=" + props.selectedMedia.media_poster;
        // var s = "https://www.yennegamovie.com/tv-player?movieid=" + props.selectedMedia.id + "&useruid=" + props.user.user_uid + "&moviekey=" + k + "&poster=" + JSON.stringify(props.selectedMedia.media_poster);
        var s = "https://d10ioppua96eut.cloudfront.net/" + k;
        console.log('Setting movie link: ', s);

        // setUrl(ts);
        // setPoster(props.selectedMedia.media_poster)
        // setIsPlaying(true);
        props.setVideoUrl(s);
        props.navigation.navigate('ReactVideoPlayer');
    }

    const copy = (obj1) => {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        return obj3;
    }

    const getExpirationDate = (mv) => {
        var date = new Date();
        if (mv.expiration_limit) {
            date.setDate(date.getDate() + mv.expiration_limit);
            return date.toISOString();
        } else {
            if (mv.type == 'movie') {
                date.setDate(date.getDate() + 3);
                return date.toISOString();
            } else {
                date.setDate(date.getDate() + 14);
                return date.toISOString();
            }
        }
    }

    const rentMovie = () => {
        var smovie = props.selectedMedia;

        var isNewRental = true;
        var foundMovie = [];

        if (props.user.rentals && props.user.rentals.length > 0) {
            props.user.rentals.forEach((rent, id) => {
                if (rent.media_id == smovie.id) {
                    isNewRental = false;
                    foundMovie.push(rent);
                }
            })

        }

        var dt = {
            billing: {
                methode: props.user.billing.billing_type,
                billing_id: props.user.billing.token,
                user_customer_id: props.user.billing.customer_id
            },
            amount: Number(smovie.DollarPrice),
            memo: 'Rental for: "' + smovie.title + '"',
            email: props.user.user_email,
            user_uid: props.user.user_uid,
            data: {
                billing_used: props.user.billing.billing_type + " " + props.user.billing.card_number.split('**** **** ****')[0],
                expiration_date: getExpirationDate(smovie),
                media_id: smovie.id,
                media_name: smovie.title,
                media_poster: smovie.media_poster,
                media_trailer: smovie.media_trailer,
                media_price: Number(smovie.DollarPrice),
                purchase_date: new Date().toISOString(),
                quality: 'HD',
                user_uid: props.user.user_uid,
            },
            isNewRental: isNewRental,
            foundMovies: foundMovie
        }

        api.rent(dt).then(res => {
            // console.log(res);
            if (res.data && res.data.status) {
                var user = copy(props.user);
                user.rentals = res.data.rentals;
                props.setUser(user);
                setIsRented(true);
                setIsProcessingErrMsg('');
                setIsProcessingErr(false);
            } else if (!res.data.status && res.data.msg) {
                setIsProcessingErrMsg(res.data.msg);
                setIsProcessingErr(true);
            }

            setIsProcessing(false);
        });
    }

    const checkMovie = () => {
        console.log('{props.selectedMedia.title}: ', props.selectedMedia.Description)
        props.user.rentals.forEach(rented => {
            if (rented.media_id == props.selectedMedia.id && new Date() < new Date(rented.expiration_date)) {
                setIsRented(true);
                setMovieKey(props.selectedMedia.Key);
            }
        });
    }

    const active = useIsFocused();

    const checkSub = () => {
        return props.user && props.user.is_monthly_sub && props.user.monthly_sub_end_date && new Date() <= new Date(props.user.monthly_sub_end_date);
    }

    return (
        <View style={{
            height: Dimensions.get('screen').height,
            width: Dimensions.get('screen').width
        }}>
            {isPlaying ? (
                <VideoPlayer url={url} />
            ) : (
                <FocusContext active={active}>
                    <LinearGradient colors={['#412c07', '#f3a015', '#412c07']} style={styles.linearGradient}>
                        <View style={styleComponent.allStyles.flexColumn}>
                            {!props.loading ? (
                                <ScrollView>
                                    <View style={{...styleComponent.allStyles.flexColumn, ...styleComponent.allStyles.justifySpaceAround, paddingTop: normalize(15), height: '100%' }}>

                                        <View style={{...styleComponent.padding(15), marginBottom: normalize(10), paddingTop: normalize(5), height: normalize(20) }}>
                                            <H4 style={{ color: 'white', textAlign: 'center' }} text={props.selectedMedia.title} />
                                        </View>
                                        <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                            <View style={{...styleComponent.allStyles.flexColumn, ...styleComponent.allStyles.justifySpaceAround, alignItems: 'center', width: normalize(55), marginLeft: normalize(15) }}>
                                                <Image style={styleComponent.allStyles.posterImgUnfocusedShadow}
                                                    source={{
                                                        uri: props.selectedMedia.media_poster,
                                                    }}
                                                />
                                                <Text style={{ color: 'white', textAlign: 'center', marginTop: normalize(2) }}>Durée: {props.selectedMedia.duration}</Text>
                                            </View>
                                            {!isProcessing ? (
                                                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: normalize(7) }}>
                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginLeft: normalize(7) }}>
                                                        <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5 }}
                                                            onPress={playBA} onFocus={() => setFocusedID('bA-btn')}>
                                                            <Text style={focusedID == 'bA-btn' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Bande Annonce</Text>
                                                        </TouchableHighlight>
                                                        {isRented || (checkSub() && props.selectedMedia.inMonthlySub) ? (
                                                            <>
                                                                {props.selectedMedia.type == 'movie' ? (
                                                                    <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5 }}
                                                                        onPress={() => playRented(props.selectedMedia.Key)} onFocus={() => setFocusedID('play-btn1')}>
                                                                        <Text style={focusedID == 'play-btn1' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer</Text>
                                                                    </TouchableHighlight>) : null}
                                                            </>
                                                        ) : (
                                                            <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5 }}
                                                                onPress={rentMovie} onFocus={() => setFocusedID('play-btn2')}>
                                                                <Text style={focusedID == 'play-btn2' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>
                                                                    Louer à ${props.selectedMedia.DollarPrice}
                                                                </Text>
                                                            </TouchableHighlight>
                                                        )}
                                                        {!isProcessingErr ? (
                                                            <View>
                                                                <Text>{isProcessingErrMsg}</Text>
                                                            </View>
                                                        ) : null}
                                                    </View>
                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: normalize(7), marginLeft: normalize(10) }}>
                                                        {props.selectedMedia.tag.map((ta, i) => {
                                                            var t;
                                                            if (ta == 'lm' || ta == 'cm') {
                                                                t = ta == 'lm' ? '- Long Métrage -' : '- Court Métrage -';
                                                            } else {
                                                                t = "- " + ta.charAt(0).toUpperCase() + ta.slice(1) + " -";
                                                            }
                                                            return (
                                                                <View key={i + '-tag'}>
                                                                    <Text style={{ backgroundColor: '#d45016', color: 'white', padding: normalize(2), borderRadius: normalize(4), fontSize: normalize(4), marginRight: normalize(2) }}>
                                                                        {" " + t + " "}
                                                                    </Text>
                                                                </View>
                                                            )
                                                        })}
                                                    </View>
                                                    {(isRented && props.selectedMedia.type != 'movie') || (checkSub() && props.selectedMedia.inMonthlySub && props.selectedMedia.type != 'movie') ? (
                                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                            {props.selectedMedia.Key1 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key1)} onFocus={() => setFocusedID('play-btn5')}>
                                                                    <Text style={focusedID == 'play-btn5' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep1}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key2 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key2)} onFocus={() => setFocusedID('play-btn6')}>
                                                                    <Text style={focusedID == 'play-btn6' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep2}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key3 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key3)} onFocus={() => setFocusedID('play-btn7')}>
                                                                    <Text style={focusedID == 'play-btn7' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep3}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key4 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key4)} onFocus={() => setFocusedID('play-btn8')}>
                                                                    <Text style={focusedID == 'play-btn8' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep4}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key5 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key5)} onFocus={() => setFocusedID('play-btn9')}>
                                                                    <Text style={focusedID == 'play-btn9' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep5}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key6 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key6)} onFocus={() => setFocusedID('play-btn10')}>
                                                                    <Text style={focusedID == 'play-btn10' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep6}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key7 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key7)} onFocus={() => setFocusedID('play-btn11')}>
                                                                    <Text style={focusedID == 'play-btn11' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep7}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key8 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key8)} onFocus={() => setFocusedID('play-btn12')}>
                                                                    <Text style={focusedID == 'play-btn12' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep8}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key9 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key9)} onFocus={() => setFocusedID('play-btn13')}>
                                                                    <Text style={focusedID == 'play-btn13' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep9}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key10 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key10)} onFocus={() => setFocusedID('play-btn14')}>
                                                                    <Text style={focusedID == 'play-btn14' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep10}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key11 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key11)} onFocus={() => setFocusedID('play-btn15')}>
                                                                    <Text style={focusedID == 'play-btn15' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep11}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key12 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key12)} onFocus={() => setFocusedID('play-btn16')}>
                                                                    <Text style={focusedID == 'play-btn16' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep12}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key13 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key13)} onFocus={() => setFocusedID('play-btn17')}>
                                                                    <Text style={focusedID == 'play-btn17' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep13}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key14 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key14)} onFocus={() => setFocusedID('play-btn18')}>
                                                                    <Text style={focusedID == 'play-btn18' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep14}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key15 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key15)} onFocus={() => setFocusedID('play-btn19')}>
                                                                    <Text style={focusedID == 'play-btn19' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep15}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key16 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key16)} onFocus={() => setFocusedID('play-btn20')}>
                                                                    <Text style={focusedID == 'play-btn20' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep16}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key17 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key17)} onFocus={() => setFocusedID('play-btn21')}>
                                                                    <Text style={focusedID == 'play-btn21' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep17}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key18 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key18)} onFocus={() => setFocusedID('play-btn22')}>
                                                                    <Text style={focusedID == 'play-btn22' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep18}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key19 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key19)} onFocus={() => setFocusedID('play-btn23')}>
                                                                    <Text style={focusedID == 'play-btn23' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep19}</Text>
                                                                </TouchableHighlight>)}
                                                            {props.selectedMedia.Key20 && (
                                                                <TouchableHighlight style={{ height: normalize(16), margin: 10, backgroundColor: 'transparent', borderRadius: 5, marginRight: normalize(5) }}
                                                                    onPress={() => playSerieEp(props.selectedMedia.Key20)} onFocus={() => setFocusedID('play-btn24')}>
                                                                    <Text style={focusedID == 'play-btn24' ? styleComponent.allStyles.FocusedBtn : styleComponent.allStyles.UnFocusedBtn}>Jouer {props.selectedMedia.Ep20}</Text>
                                                                </TouchableHighlight>)}

                                                        </View>
                                                    ) : null}

                                                </View>) : (
                                                <ActivityIndicator size="large" color="#b5a642" />
                                            )}
                                        </View>
                                        {props.selectedMedia.Description ? (
                                            <View style={{...styleComponent.padding(15), marginBottom: normalize(10), paddingTop: normalize(5), display: 'flex', flex: 1, flexDirection: 'column' }}>
                                                <Text style={{ color: 'white', fontSize: normalize(6), marginBottom: normalize(5) }}>
                                                    Type: {props.selectedMedia.type}
                                                </Text>
                                                <Text style={{ color: 'white', fontSize: normalize(6), marginBottom: normalize(5) }}>
                                                    Description: {props.selectedMedia.Description}
                                                </Text>
                                                <Text style={{ color: 'white', fontSize: normalize(6), marginBottom: normalize(5) }}>
                                                    Autheur: {props.selectedMedia.author}
                                                </Text>
                                                <Text style={{ color: 'white', fontSize: normalize(6), marginBottom: normalize(5) }}>
                                                    Poduction: {props.selectedMedia.production}
                                                </Text>
                                            </View>) : null}
                                    </View>
                                </ScrollView>
                            ) : (
                                <ActivityIndicator size="large" color="#b5a642" />
                            )}
                        </View>
                        <NavBar  {...props} />
                    </LinearGradient>
                </FocusContext>)}
        </View>
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

export default Details;