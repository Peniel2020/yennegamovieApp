import React, { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
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
import api from '../utils/api';
import styleComponent from '../components/styles/style';
import { H1, H2, H3, H4, normalize } from '../components/Views/views';
import NavBar from '../components/Views/navbar';

const Login = (props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [uniqueId, setUniqueId] = useState(null);
    const [url, setUrl] = useState(false);

    useEffect(() => {
        getUrl();
        if(props.user){
            props.navigation.navigate('Home');
        }
    }, [props.tempDeviceID, props.deviceID, props.user]);

    const getUrl = async () => {
        var uniqueId = props.tempDeviceID || props.deviceID || 'ABC';
        var url = api.loginUrl();
        console.log("uniqueId: ", uniqueId)
        setUrl(url + uniqueId);
        setUniqueId(uniqueId);
    }

    const validateDevice = async () => {
        props.getDeviceId();
    }

    const active = useIsFocused();

    return (
        <FocusContext active={active}>
            <NavBar  {...props} />
            {uniqueId ? (
                <LinearGradient colors={['#412c07', '#f3a015', '#412c07']} style={styles.linearGradient}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        {/* <Image style={styleComponent.allStyles.logo} source={{ uri: "https://firebasestorage.googleapis.com/v0/b/yennega-movie.appspot.com/o/files%2FLOGO%20YENNEGA%20MOVIES.png?alt=media&token=d9d73af2-1282-4c07-b43a-249d2e0eee25" }} /> */}
                        <H3 text="Bienvenue a Yennega Movie" style={{ color: 'white' }} />
                    </View>
                    {props.deviceID ? (
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                            <H4 text={`Veuillez ajouter cet appareil a votre liste d'appareil`} style={{ color: 'white', flexWrap: 'wrap', width: '85%'}} />
                            <H4 text={'Suivant ce lien:'} style={{ color: 'black'}}/>
                            <H4 text={url} style={{ color: 'black'}}/>
                            <H4 text={`Ou en scannant ce code avec votre smartphone`} style={{ color: 'white' }} />
                            <H4 text={`Une fois ajouter, cliquez sure ce button`} style={{ color: 'white' }} />
                            <TouchableHighlight style={{  margin: normalize(15), backgroundColor: 'transparent', borderRadius: 5, alignItems: 'center' }}
                                onPress={validateDevice}>
                                <Text style={styleComponent.allStyles.deviceValidationBtn}>Confirmer l'ajout</Text>
                            </TouchableHighlight>
                        </View>
                        <QRCode value={url} size={normalize(60)} />
                    </View>) : (
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <ActivityIndicator size="small" color="#b5a642" />
                            <Text>Please Wait loading...</Text>
                        </View>
                    )}
                </LinearGradient>
            ) : (
                <LinearGradient colors={['#412c07', '#f3a015', '#412c07']} style={{...styles.linearGradient, height: '100%', width: '100%' }}>
                    <ActivityIndicator size="large" color="#b5a642" />
                </LinearGradient>
            )}
        </FocusContext>
    );
}


const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    }
});

export default Login;