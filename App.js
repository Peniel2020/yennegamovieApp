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
import TVEventHandler from 'react-native/Libraries/Components/AppleTV/TVEventHandler';
import DoubleTapToClose from './exitApp';
import api from './utils/api';
import Home from './views/Home';
import Details from './views/Details';
import Login from './views/Login';
import VideoPlayer from './components/player/player';
import ReactVideoPlayer from './components/player/player2';
import { FocusContext, Button } from 'react-native-tvfocus';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getUniqueId, getManufacturer, getMacAddress, getDeviceId } from 'react-native-device-info';

const Stack = createStackNavigator();

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [userId, setUserId] = useState('https://www.yennegamovie.com');
  const [showCSaveModal, setShowCSaveModal] = useState(false);
  const [credentials, setCredentials] = useState(false);
  const [isTV, setIsTV] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([{ type: 'Andoid Phone', value: 0 }, { type: 'Andoid TV', value: 1 }, { type: 'Roku TV', value: 2 }]);
  // const [_tvEventHandler, set_tvEventHandler] = useState(null);
  const [SCRIPT, setSCRIPT] = useState(null);
  const [user, setUser] = useState(null);
  const [allMedia, setAllMedia] = useState([]);
  const [subscriptionMedia, setSubscriptionMedia] = useState([]);
  const [romanceMedia, setRomanceMedia] = useState([]);
  const [comedyMedia, setComedyMedia] = useState([]);
  const [actionMedia, setActionMedia] = useState([]);
  const [dramaMedia, setDramaMedia] = useState([]);
  const [mysteryMedia, setMysteryMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(false);
  const [deviceID, setdeviceID] = useState(null);
  const [tempDeviceID, setTempDeviceID] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  
  useEffect(() => {
    setIsTV(Platform.isTV);
    // RNSecureStorage.remove('deviceID').then((val) => {
    //   console.log("uc Deleted: ", val)
    // }).catch((err) => {
    //   console.log("unable to delete: ", err)
    // });
    getDeviceId();
    getDeviceInfo();
    getMovieList();
    _enableTVEventHandler();
    return () => _disableTVEventHandler();
  }, [])

  const _tvEventHandler = new TVEventHandler();

  const _enableTVEventHandler = () => {
    _tvEventHandler.enable(this, function (cmp, evt) {
      // console.log('evt.eventType: ', evt.eventType);
      if (evt && evt.eventType === 'right') {
        // console.log(evt);
      } else if (evt && evt.eventType === 'up') {
        // console.log(evt);
      } else if (evt && evt.eventType === 'left') {
        // console.log(evt);
      } else if (evt && evt.eventType === 'down') {
        // console.log(evt);
      }
    });
  };

  const _disableTVEventHandler = () => {
    if (_tvEventHandler) {
      _tvEventHandler.disable();
    }
  }

  const retreiveUserData = async () => {
    api.retreiveUserData()
  }

  const getFromStorage = async (name) => {
    return RNSecureStorage.get(name).then((value) => {
      return {status: true,  err: null, value}
    }).catch(async (err) => {
      return {status: false, value: null, err}
    })
  }

  const setInStorage = async (name,value) => {
    return RNSecureStorage.set(name, value, { accessible: ACCESSIBLE.WHEN_UNLOCKED }).then((value) => {
      return {status: true,  err: null, value}
    }).catch(async (err) => {
      return {status: false, value: null, err}
    })
  }

  const getDeviceId = async () => {
    var tempDeviceIDRes = await getFromStorage("tempDeviceID");
    var deviceIDRes = await getFromStorage("deviceID");
    console.log("tempDeviceIDRes: ", tempDeviceIDRes);
    console.log("deviceIDRes: ", deviceIDRes);
    if(!tempDeviceIDRes.status && !deviceIDRes.status){
      var newDt = await api.generateDeviceID();
      console.log("generating new: ", newDt);
      setTempDeviceID(newDt.tempDeviceID);
      setdeviceID(newDt.deviceID);
      setInStorage("tempDeviceID", JSON.stringify(newDt.tempDeviceID));
      setInStorage("deviceID", JSON.stringify(newDt.deviceID));
    } else {
      setTempDeviceID(JSON.parse(tempDeviceIDRes.value));
      setdeviceID(JSON.parse(deviceIDRes.value));
      console.log("Calling api: ", )
      var userData = await api.retreiveUserData({deviceID: JSON.parse(deviceIDRes.value)});
      console.log("userData: ", userData.data);
      if(userData.data.status){
        setUser(userData.data.data);
      } else {

      }
    }

    
  }

  const getDeviceInfo = async () => {
    var deviceInfo = await getMacAddress();
    var deviceUniqueId = await getUniqueId();
    // console.log("deviceInfo: ", deviceInfo);
    // console.log("deviceUniqueId: ", deviceUniqueId);
  }

  const _onNavigationStateChange = (webViewState) => {
    console.log("state changed");
  }

  _handleMessage = ({ nativeEvent: { data } }) => {
    console.log('got message, data:', data);
    var dt = JSON.parse(data);
    if (dt.targetFunc == 'login') {
      var d = dt.data
      setCredentials(d);
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

  const getMovieList = async () => {
    var lastUpdate =  await getFromStorage('lastUpdate');
    var date = '01/01/2021';
    var todayDate = new Date().toISOString().split('T')[0];
    if(lastUpdate.status){
      date = lastUpdate.value;
    }

    var hasNewDt = await api.hasNewMovie({date});
    var hasNew = true;
    if(hasNewDt.status){
      hasNew = hasNewDt.hasNew;
    }

    var movieListDt = await getFromStorage("movieList");
    var movieList = {};

    if(movieListDt.status){
      movieList = JSON.parse(movieListDt.value)
    }

    if(hasNew || !movieList.allMedia){
      console.log("retreiving from db");
      var res = await api.getMovieList();
  
      if (res && res.data && res.data.status) {
        setAllMedia(res.data.media.allMedia);
        setSubscriptionMedia(res.data.media.subscriptionMedia);
        setRomanceMedia(res.data.media.romanceMedia);
        setComedyMedia(res.data.media.comedyMedia);
        setActionMedia(res.data.media.actionMedia);
        setDramaMedia(res.data.media.dramaMedia);
        setMysteryMedia(res.data.media.mysteryMedia);
        setInStorage("movieList", JSON.stringify(res.data.media));
        setInStorage("lastUpdate", JSON.stringify(todayDate));
        setLoading(false);
      }
    } else if(movieList.allMedia) {
      console.log("retreiving from memory");
      setAllMedia(movieList.allMedia);
      setSubscriptionMedia(movieList.subscriptionMedia);
      setRomanceMedia(movieList.romanceMedia);
      setComedyMedia(movieList.comedyMedia);
      setActionMedia(movieList.actionMedia);
      setDramaMedia(movieList.dramaMedia);
      setMysteryMedia(movieList.mysteryMedia);
      setLoading(false);
    }
  }


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        
        <Stack.Screen name="Login">
          {props => (!user ? (<Login {...props} setVideoUrl={setVideoUrl} videoUrl={videoUrl} getDeviceId={getDeviceId} tempDeviceID={tempDeviceID} deviceID={deviceID} user={user} setUser={setUser} setSelectedMedia={setSelectedMedia} selectedMedia={selectedMedia} loading={loading} allMedia={allMedia} subscriptionMedia={subscriptionMedia} romanceMedia={romanceMedia} comedyMedia={comedyMedia} actionMedia={actionMedia} dramaMedia={dramaMedia} mysteryMedia={mysteryMedia} />) : (<Home {...props} setVideoUrl={setVideoUrl} videoUrl={videoUrl} getDeviceId={getDeviceId} tempDeviceID={tempDeviceID} deviceID={deviceID} user={user} setUser={setUser} setSelectedMedia={setSelectedMedia} selectedMedia={selectedMedia} loading={loading} allMedia={allMedia} subscriptionMedia={subscriptionMedia} romanceMedia={romanceMedia} comedyMedia={comedyMedia} actionMedia={actionMedia} dramaMedia={dramaMedia} mysteryMedia={mysteryMedia} />))}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {props => <Home {...props} setVideoUrl={setVideoUrl} videoUrl={videoUrl} getDeviceId={getDeviceId} tempDeviceID={tempDeviceID} deviceID={deviceID} user={user} setUser={setUser} setSelectedMedia={setSelectedMedia} selectedMedia={selectedMedia} loading={loading} allMedia={allMedia} subscriptionMedia={subscriptionMedia} romanceMedia={romanceMedia} comedyMedia={comedyMedia} actionMedia={actionMedia} dramaMedia={dramaMedia} mysteryMedia={mysteryMedia} />}
        </Stack.Screen>
        <Stack.Screen name="Details">
          {props => <Details {...props} setVideoUrl={setVideoUrl} videoUrl={videoUrl} getDeviceId={getDeviceId} tempDeviceID={tempDeviceID} deviceID={deviceID} user={user} setUser={setUser} setSelectedMedia={setSelectedMedia} selectedMedia={selectedMedia} loading={loading} allMedia={allMedia} subscriptionMedia={subscriptionMedia} romanceMedia={romanceMedia} comedyMedia={comedyMedia} actionMedia={actionMedia} dramaMedia={dramaMedia} mysteryMedia={mysteryMedia} />}
        </Stack.Screen>
        <Stack.Screen name="VideoPlayer">
          {props => <VideoPlayer {...props} setVideoUrl={setVideoUrl} url={videoUrl} getDeviceId={getDeviceId} tempDeviceID={tempDeviceID} deviceID={deviceID} user={user} setUser={setUser} setSelectedMedia={setSelectedMedia} selectedMedia={selectedMedia} loading={loading} allMedia={allMedia} subscriptionMedia={subscriptionMedia} romanceMedia={romanceMedia} comedyMedia={comedyMedia} actionMedia={actionMedia} dramaMedia={dramaMedia} mysteryMedia={mysteryMedia} />}
        </Stack.Screen>
        <Stack.Screen name="ReactVideoPlayer">
          {props => <ReactVideoPlayer {...props} setVideoUrl={setVideoUrl} url={videoUrl} getDeviceId={getDeviceId} tempDeviceID={tempDeviceID} deviceID={deviceID} user={user} setUser={setUser} setSelectedMedia={setSelectedMedia} selectedMedia={selectedMedia} loading={loading} allMedia={allMedia} subscriptionMedia={subscriptionMedia} romanceMedia={romanceMedia} comedyMedia={comedyMedia} actionMedia={actionMedia} dramaMedia={dramaMedia} mysteryMedia={mysteryMedia} />}
        </Stack.Screen>
        
      </Stack.Navigator>
    </NavigationContainer>
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