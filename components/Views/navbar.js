import React, { useState } from 'react';

import { View, TouchableHighlight, Text } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import { H1, H2, H3, H4, normalize } from './views';

export default function NavBar(props) {
    const [visible, setVisible] = useState(false);
    const [focused, setFocused] = useState(false);

    const hideMenu = (type) => {
        switch (type) {
            case "hide": { break; }
            case "Home": {
                props.navigation.navigate("Home");
                break;
            }
            case "Login": {
                props.navigation.navigate("Login");
                break;
            }
            case "LogOut": {
                props.setUser(null);
                props.navigation.navigate("Login");
                break;
            }
        }
        setVisible(false);
    }
    const handleFocus = (t) => {
        t == 1 ? setFocused(true) : setFocused(false); 
    }
    const showMenu = () => setVisible(true);

    return (
        <View style={{ position: 'absolute', left: 0, top: normalize(0), zIndex: 1, paddingTop: normalize(5), paddingLeft: normalize(5), display: 'flex', flexDirection: 'column', backgroundColor: visible ? '#d45016' : 'transparent', color: 'white', 
        }}>
            <View>
                {visible ? (
                    <TouchableHighlight style={{borderWidth: focused ? normalize(1) : 0, borderColor: focused ? '#f5bb47' : 'transparent', width: normalize(12)}} onPress={() => hideMenu("hide")} onFocus={() => handleFocus(1)} onBlur={() => handleFocus(0)}>
                        <View>
                            <Icon name="close" size={normalize(12)} color="white" />
                            {/* <Text>here</Text> */}
                        </View>
                    </TouchableHighlight>
                ) : (
                    <TouchableHighlight style={{borderWidth: focused ? normalize(1) : 0, borderColor: focused ? '#f5bb47' : 'transparent', width: normalize(12)}} onPress={showMenu}  onFocus={() => handleFocus(1)} onBlur={() => handleFocus(0)}>
                        <View>
                            <Icon name="menu" size={normalize(12)} color="#d45016" />
                            {/* <Text>here2</Text> */}
                        </View>
                    </TouchableHighlight>
                )}
            </View>

            {visible ? (
                <View style={{width: normalize(50), paddingBottom: normalize(50)}}>
                    <View style={{ margin: normalize(5), paddingBottom: normalize(2)}}>
                        <TouchableHighlight style={{padding: normalize(2)}} onPress={() => hideMenu("Home")}>
                            <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>List</Text>
                        </TouchableHighlight>
                    </View>

                    {
                        props.user ? (
                            <View style={{ margin: normalize(5), paddingBottom: normalize(2)}}>
                                <TouchableHighlight style={{padding: normalize(2)}} onPress={() => hideMenu("LogOut")}>
                                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Deconnexion</Text>
                                </TouchableHighlight>
                            </View>
                        ) : (
                            <View style={{ margin: normalize(5), paddingBottom: normalize(2)}}>
                                <TouchableHighlight style={{padding: normalize(2)}} onPress={() => hideMenu("Login")}>
                                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Connexion</Text>
                                </TouchableHighlight>
                            </View>
                        )
                    }
                </View >) : null}
        </View >
    );
}