
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

const generateOnMessageFunction = (data) =>
    `(() => {
    window.dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(data)}}));
})()`;

const VideoPlayer = (props) => {

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


    let webviewRef = useRef();

    useEffect(() => {
        setSCRIPT(webviewScript);
        console.log(props);
        setUrl(props.url);
        setIsLoading(false);
        _enableTVEventHandler();
        return () => _disableTVEventHandler();
    }, [])


    const _tvEventHandler = new TVEventHandler();
    var counter = 0;

    const _enableTVEventHandler = () => {
        _tvEventHandler.enable(this, function (cmp, evt) {
            // console.log('evt.eventType: ', evt.eventType);
            // console.log('webviewRef: ', webviewRef);
            if (evt && evt.eventKeyAction == 0 && evt.eventType === 'right') {
                setFastForwading(true);
                setTimeout(() => {
                    setFastForwading(false)
                }, 1500)
                console.log(evt);
                webviewRef.current.injectJavaScript(generateOnMessageFunction('player-1'))
            } else if (evt && evt.eventKeyAction == 0 && evt.eventType === 'up') {
                console.log(evt);
                webviewRef.current.injectJavaScript(generateOnMessageFunction('player-97')) // focuse may use it to controle volume maybe
            } else if (evt && evt.eventKeyAction == 0 && evt.eventType === 'left') {
                setRewinding(true)
                setTimeout(() => {
                    setRewinding(false)
                }, 1500)
                console.log(evt);
                webviewRef.current.injectJavaScript(generateOnMessageFunction('player-98'))
            } else if (evt && evt.eventKeyAction == 0 && evt.eventType === 'down') {
                console.log(evt);
                webviewRef.current.injectJavaScript(generateOnMessageFunction('player-96')) // focuse may use it to controle volume maybe
            }
            else if (evt && evt.eventKeyAction == 1 && evt.eventType === 'select') {
                console.log(evt);
                webviewRef.current.injectJavaScript(generateOnMessageFunction('player-0'))
            }
        });
    };

    const _disableTVEventHandler = () => {
        if (_tvEventHandler) {
            _tvEventHandler.disable();
        }
    }

    const _onNavigationStateChange = (webViewState) => {
        console.log("state changed");
    }

    _handleMessage = ({ nativeEvent: { data } }) => {
        console.log('got message, data:', data);
        var dt = JSON.parse(data);
        if (dt.targetFunc == 'togglePlay') {

        }

        if (dt.targetFunc == 'rewind') {

        }

        if (dt.targetFunc == 'forward') {

        }
    }





    const active = useIsFocused();


    return (
        <FocusContext active={active}>
            {/* <SafeAreaView><DoubleTapToClose webview={webview} /></SafeAreaView> */}
            {!isLoading ? (
                <WebView
                    source={{ uri: url }}
                    ref={webviewRef}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    useWebkit={false}
                    javaScriptEnabledAndroid={true}
                    allowsFullscreenVideo={true}
                    injectedJavaScript={SCRIPT}
                    // onShouldStartLoadWithRequest={_onShouldStartLoadWithRequest}
                    onNavigationStateChange={_onNavigationStateChange}
                    onMessage={_handleMessage}
                />
            ) : <ActivityIndicator size="large" color="#b5a642" />}
            {rewinding ? (
                <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black', position: 'absolute', bottom: normalize(10), left: 0, borderBottomEndRadius: normalize(4), borderTopEndRadius: normalize(4), paddingvertical: normalize(5), paddingHorizontal: normalize(8)}}>
                    <Icon name="play-back" size={normalize(8)} color="white" />
                    <Text style={{ color: 'white', marginLeft: normalize(2)}}>Hold to Rewind</Text>
                </View>
            ) : null}
            {fastForwading ? (
                <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black', position: 'absolute', bottom: normalize(10), right: 0, borderBottomStartRadius: normalize(4), borderTopStartRadius: normalize(4), paddingvertical: normalize(5), paddingHorizontal: normalize(8)}}>
                    <Text style={{ color: 'white', marginRight: normalize(2)}}>Hold to Rewind</Text>
                    <Icon name="play-forward" size={normalize(8)} color="white" />
                </View>
            ) : null}
        </FocusContext>
    );
};

const styles = StyleSheet.create({
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

export default VideoPlayer;

const webviewScript = `
var promiseChain = Promise.resolve();
var callbacks = {};
var init = function() {
      // alert("Injected");
      
  const guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  }
  window.webViewB = {
    /**
     * send message to the React-Native WebView onMessage handler
     * @param targetFunc - name of the function to invoke on the React-Native side
     * @param data - data to pass
     * @param success - success callback
     * @param error - error callback
     */
    send: function(targetFunc, data, success, error) {
      var msgObj = {
        targetFunc: targetFunc,
        data: data || {}
      };
      if (success || error) {
        msgObj.msgId = guid();
      }
      var msg = JSON.stringify(msgObj);
      promiseChain = promiseChain.then(function () {
        return new Promise(function (resolve, reject) {
          console.log("sending message " + msgObj.targetFunc);
          if (msgObj.msgId) {
            callbacks[msgObj.msgId] = {
              onsuccess: success,
              onerror: error
            };
          }
          window.ReactNativeWebView.postMessage(msg);
          resolve();
        })
      }).catch(function (e) {
        console.error('rnBridge send failed ' + e.message);
      });
    },
  };
  window.addEventListener('message', function(e) {
    console.log("message received from react native");
    var message;
    try {
      message = JSON.parse(e.data)
    }
    catch(err) {
      console.error("failed to parse message from react-native " + err);
      return;
    }
    //trigger callback
    if (message.args && callbacks[message.msgId]) {
      if (message.isSuccessfull) {
        callbacks[message.msgId].onsuccess(message.args);
      }
      else {
        callbacks[message.msgId].onerror(nmessage.args);
      }
      delete callbacks[message.msgId];
    }
  });
};
init();

  window.counter = 0;
  window.addEventListener('locationchange', function(){
      if(window.location.href.indexOf('pay') > -1){
          window.webViewB.send('Pay', window.location.href, function(res) {
              //localStorage.setItem("payLink", window.location.href);
              console.log("Pay detection sent: ", window.location.href);
          }, function(err) {
              console.log("Pay Detection failed: ", err);
              //localStorage.setItem("payErr: ", err);
          });
      }
  })
`