/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
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

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { WebView } from 'react-native-webview';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
// import { TVEventHandler, useTVEventHandler } from 'react-native';
import DoubleTapToClose  from './exitApp';

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState('');
  // const [url, setUrl] = useState('http://192.168.1.152:3000');
  const [url, setUrl] = useState('https://www.yennegamovie.com');
  const [showCSaveModal, setShowCSaveModal] = useState(false);
  const [credentials, setCredentials] = useState(false);
  const [isTV, setIsTV] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([{type: 'Andoid Phone', value: 0}, {type: 'Andoid TV', value: 1}, {type: 'Roku TV', value: 2}]);
  const [_tvEventHandler, set_tvEventHandler] = useState(null);
  const [SCRIPT, setSCRIPT] = useState(null);
  const [webview, setWebview] = useState(null);


  // let webview = null;

  useEffect(() => {
    setIsTV(Platform.isTV);
    setSCRIPT(`
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

  window.isTV=${Platform.isTV}

  window.webViewBridge = {
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
    isTV: ${Platform.isTV},

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
window.webViewBridge.send('Pay', window.location.href, function(res) {
  //localStorage.setItem("payLink", window.location.href);
  console.log("Pay detection sent: ", window.location.href);
}, function(err) {
  console.log("Pay Detection failed: ", err);
  //localStorage.setItem("payErr: ", err);
});
  window.counter = 0;
  window.addEventListener('locationchange', function(){
      if(window.location.href.indexOf('pay') > -1){
          window.webViewBridge.send('Pay', window.location.href, function(res) {
              //localStorage.setItem("payLink", window.location.href);
              console.log("Pay detection sent: ", window.location.href);
          }, function(err) {
              console.log("Pay Detection failed: ", err);
              //localStorage.setItem("payErr: ", err);
          });
      }
  })
`);
    RNSecureStorage.get("uc").then((value) => {
      console.log(value);
      var a = JSON.parse(value);
      if (a.uname) {
        // var url = 'http://192.168.1.152:3000/login?uname=' + a.uname + '&password=' + a.password;
        var url = 'https://www.yennegamovie.com/login?uname='+a.uname+'&password='+a.password;
        setUrl(url);
      }

      console.log('here-----------------:', url);
      setIsLoading(false);
    }).catch((err) => {
      console.log("error: *********** ", err);
      setIsLoading(false);
      // this.setState({ msg: 'Would you like to store you Credentials on this device?'}, ()=>{
      //   this.setState({ showCSaveModal: true });
      // });
    });
    // _enableTVEventHandler()
  }, [])

  const myTVEventHandler = evt => {
    setLastEventType(evt.eventType);
  };

  // useTVEventHandler(myTVEventHandler);

  // const _enableTVEventHandler = () => {
  //   _tvEventHandler = new TVEventHandler();
  //   _tvEventHandler.enable(this, function (cmp, evt) {
  //     if (evt && evt.eventType === 'right') {
  //       cmp.setState({ board: cmp.state.board.move(2) });
  //     } else if (evt && evt.eventType === 'up') {
  //       cmp.setState({ board: cmp.state.board.move(1) });
  //     } else if (evt && evt.eventType === 'left') {
  //       cmp.setState({ board: cmp.state.board.move(0) });
  //     } else if (evt && evt.eventType === 'down') {
  //       cmp.setState({ board: cmp.state.board.move(3) });
  //     } else if (evt && evt.eventType === 'playPause') {
  //       cmp.restartGame();
  //     }
  //   });
  // }

  // _disableTVEventHandler = () => {
  //   if (_tvEventHandler) {
  //     _tvEventHandler.disable();
  //     set_tvEventHandler(null);
  //   }
  // }

  const _onNavigationStateChange = (webViewState) => {
    console.log("state changed");
    // console.log("New URI: ", webViewState);
    // if (webViewState.url.indexOf('pay') > -1) {
    //   webview.stopLoading();
    //   webview.goBack();
    // Linking.openURL(webViewState.url);
    // }
  }

  _handleMessage = ({ nativeEvent: { data } }) => {
    console.log('got message, data:', data);
    var dt = JSON.parse(data);
    if (dt.targetFunc == 'login') {
      var d = dt.data
      setCredentials(d);
      // RNSecureStorage.exists("uc").then((r) => {
      //   if (r) {
      //     setMsg('Update saved credentials?');
      //     setShowCSaveModal(true);
      //   } else {
      //     setMsg('Would you like to store your Credentials on this device?');
      //     setShowCSaveModal(true);
      //   }
      // }).catch((err) => {
      //   setMsg('Would you like to store your Credentials on this device?');
      //   setShowCSaveModal(true);
      // });
      saveCredential(d)
    }

    if (dt.targetFunc == 'logout') {
      RNSecureStorage.remove('uc').then((val) => {
        console.log("uc Deleted: ", val)
      }).catch((err) => {
        console.log("unable to delete: ", err)
      });
    }
  }

  const saveCredential = (uc) => {
    var sUc = JSON.stringify(uc);
    RNSecureStorage.set("uc", sUc, { accessible: ACCESSIBLE.WHEN_UNLOCKED })
      .then((res) => {
        console.log("Success", res);
        setMsg('Updated!');
        setTimeout(() => {
          setShowCSaveModal(false);
        }, 2000);
      }, (err) => {
        setMsg('We could not save your credentials, please try again later!');
        setTimeout(() => {
          setShowCSaveModal(false);
        }, 2000);
        console.log("Err: ", err);
      });
  }

  return (
    <>
    <DoubleTapToClose webview={webview} />
      {!isLoading ? (
        <WebView
          source={{ uri: url }}
          ref={ref => (setWebview(ref))}
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
      <View style={styles.modalBody}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCSaveModal}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{msg}</Text>
              <View style={styles.action}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#8b0e04" }}
                  onPress={saveCredential}>
                  <Text style={styles.textStyle}>Yes</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={{ ...styles.closeButton, backgroundColor: "#b5a642" }}
                  onPress={() => {
                    setShowCSaveModal(false)
                  }}>
                  <Text style={styles.textStyle}>No, Thanks</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
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

export default App;