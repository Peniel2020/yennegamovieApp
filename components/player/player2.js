
import React, { useEffect, useState, useRef } from 'react';
// import type {Node} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Linking,
    Text,
    useColorScheme,
    View,
    Modal,
    ActivityIndicator,
    TouchableHighlight,
    Platform
} from 'react-native';


import { WebView } from 'react-native-webview';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import DoubleTapToClose from '../../exitApp';
import TVEventHandler from 'react-native/Libraries/Components/AppleTV/TVEventHandler';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { FocusContext, Button } from 'react-native-tvfocus';
import Icon from 'react-native-vector-icons/Ionicons';
import { normalize } from '../../components/Views/views';
import Video from 'react-native-video';
// import VideoPlayer from 'react-native-video-controls';
import { Slider } from '@miblanchard/react-native-slider';
// import * as Progress from 'react-native-progress';
import { ProgressBar } from '@react-native-community/progress-bar-android';

const generateOnMessageFunction = (data) =>
    `(() => {
    window.dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(data)}}));
})()`;

const ReactVideoPlayer = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [msg, setMsg] = useState('');
    // const [url, setUrl] = useState('http://localhost:3000');
    const [url, setUrl] = useState('https://www.yennegamovie.com');
    const [showCSaveModal, setShowCSaveModal] = useState(false);
    const [credentials, setCredentials] = useState(false);
    const [isTV, setIsTV] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [devices, setDevices] = useState([{ type: 'Andoid Phone', value: 0 }, { type: 'Andoid TV', value: 1 }, { type: 'Roku TV', value: 2 }]);
    const [SCRIPT, setSCRIPT] = useState(null);
    const [rewinding, setRewinding] = useState(false);
    const [fastForwading, setFastForwading] = useState(false);

    const [paused, setPaused] = useState(false);
    const [displayProgress, setDisplayProgress] = useState(false);
    const [displayTotal, setDisplayTotal] = useState(false);
    // const [progressState, setProgressState] = useState(0);


    let webviewRef = useRef();

    let player = useRef(null);


    useEffect(() => {
        console.log(props);
        setUrl(props.url);
        setIsLoading(false);
        _enableTVEventHandler();
        handlePlayTimer();
        console.log(player?.current)
        return () => _disableTVEventHandler();
    }, [player])


    const _tvEventHandler = new TVEventHandler();
    var counter = 0;

    const handlePlayTimer = () => {
        var inter = setTimeout(() => {
            // console.log('presentFullscreenPlayer: ', player)
            player.current.presentFullscreenPlayer()
        }, 5000)
    }

    var progressState = 0
    var seekableDuration = 0
    const handleProgress = (evt) => {
        // console.log(evt.seekableDuration)
        seekableDuration = evt.seekableDuration;
        setDisplayTotal(evt.seekableDuration);
        progressState = evt.currentTime;
        setDisplayProgress(evt.currentTime);
        // console.log(progressState)
        // "seekableDuration":
    }

    const getMinutesFromSeconds = (time) => {
        // const minutes = time >= 60 ? Math.floor(time / 60) : 0;
        // const seconds = Math.floor(time - minutes * 60);

        // return `${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
        return new Date(time * 1000).toISOString().slice(11, 19);
    }

    var fft;
    var rwt;

    const _enableTVEventHandler = () => {

        _tvEventHandler.enable(this, function (cmp, evt) {
            if (evt && evt.eventKeyAction == 1 && evt.eventType === 'right') {
                if (fastForwading) {
                    var nt = progressState + 60;
                    progressState = progressState + 60;
                    player.current.seek(nt);
                    clearTimeout(fft)
                    fft = setTimeout(() => {
                        setFastForwading(false)
                    }, 5000)
                } else {
                    var nt = progressState + 15;
                    progressState = progressState + 15;
                    player.current.seek(nt);
                    setFastForwading(true);
                    fft = setTimeout(() => {
                        setFastForwading(false)
                    }, 5000)
                }

                console.log(evt);
            } else if (evt && evt.eventKeyAction == 1 && evt.eventType === 'up') {
                console.log(evt);
            } else if (evt && evt.eventKeyAction == 1 && evt.eventType === 'left') {
                if (rewinding) {
                    var nt = progressState - 60;
                    progressState = progressState - 60;
                    player.current.seek(nt);
                    clearTimeout(rwt);
                    rwt = setTimeout(() => {
                        setRewinding(false)
                    }, 5000)
                } else {
                    var nt = progressState - 15;
                    progressState = progressState - 15;
                    player.current.seek(nt);
                    setRewinding(true)
                    rwt = setTimeout(() => {
                        setRewinding(false)
                    }, 5000)
                }
                console.log(evt);
            } else if (evt && evt.eventKeyAction == 1 && evt.eventType === 'down') {
                console.log(evt);
            }
            else if (evt && evt.eventKeyAction == 1 && evt.eventType === 'select') {
                console.log(evt);
                if (paused) {
                    setPaused(false)
                } else {
                    setPaused(true)
                }

            }
        });
    };

    const _disableTVEventHandler = () => {
        if (_tvEventHandler) {
            _tvEventHandler.disable();
        }
    }

    const active = useIsFocused();

    return (
        <View style={styles.container}>
            <Video source={{ uri: props.url }}   // Can be a URL or a local file.
                ref={player}                                      // Store reference
                controls={false}
                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                // onError={this.videoError}               // Callback when video cannot be loaded
                repeat={false}
                onProgress={(evt) => handleProgress(evt)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }}
                paused={paused}
            />
            {rewinding || fastForwading ? (
                <View style={styles.progressContainer}>
                    <View style={{display: 'flex', flexDirection: 'row', marginRight: normalize(5)}}>
                        <Text style={{color: 'white'}}>{getMinutesFromSeconds(displayTotal)} / {getMinutesFromSeconds(displayProgress)}</Text>
                    </View>
                    <ProgressBar
                        styleAttr="Horizontal"
                        color="#d45016"
                        indeterminate={false}
                        progress={displayProgress / displayTotal}
                        style={{width: normalize(200)}}
                    />
                </View>
            ) : null}
            {rewinding ? (
                <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black', position: 'absolute', bottom: normalize(20), left: 0, borderBottomEndRadius: normalize(4), borderTopEndRadius: normalize(4), paddingvertical: normalize(5), paddingHorizontal: normalize(8) }}>
                    <Icon name="play-back" size={normalize(8)} color="white" />
                    <Text style={{ color: 'white', marginLeft: normalize(2) }}>Rewinding</Text>
                </View>
            ) : null}
            {fastForwading ? (
                <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black', position: 'absolute', bottom: normalize(20), right: 0, borderBottomStartRadius: normalize(4), borderTopStartRadius: normalize(4), paddingvertical: normalize(5), paddingHorizontal: normalize(8) }}>
                    <Text style={{ color: 'white', marginRight: normalize(2) }}>Forwarding</Text>
                    <Icon name="play-forward" size={normalize(8)} color="white" />
                </View>
            ) : null}
        </View>
        // <VideoPlayer
        //     source={{ uri: url }}
        //     navigator={props.navigator}
        //     toggleResizeModeOnFullscreen={true}
        //     disableVolume={true}
        //     disableFullscreen={true}
        //     disableBack={true}
        //     ref={(ref) => (player = ref)}  
        // />

    );
};

const styles = StyleSheet.create({
    progressContainer: {

        display: 'flex',
        flexDirection: 'row',
        // backgroundColor: 'black',
        // borderWidth: 1,
        position: 'absolute',
        bottom: normalize(10),
        left: 0,
        width: normalize(200),
        borderBottomEndRadius: normalize(4),
        borderTopEndRadius: normalize(4),
        paddingvertical: normalize(5),
        paddingHorizontal: normalize(8)
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
        marginEnd: 10
    },
    scrollView: {
        backgroundColor: 'blue',
    },
    action: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginVertical: 10
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: 'white',
    },
    modal: {
        width: "100%",
        height: "100%"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        backgroundColor: "#0000009a"
    },
    modalBody: {
        backgroundColor: "#0000009a",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#8b0e04",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 15
    },
    closeButton: {
        backgroundColor: "#b5a642",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 15
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default ReactVideoPlayer;