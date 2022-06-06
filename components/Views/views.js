import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
} from 'react-native';
import { Dimensions, Platform, PixelRatio } from 'react-native';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export const normalize = (size) => {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export const H1 = (props) => {
    return (
        <Text style={[props.style, styles.h1]}>{props.text}</Text>
    );
}
export const H2 = (props) => {
    return (
        <Text style={[props.style, styles.h2]}>{props.text}</Text>
    );
}
export const H3 = (props) => {
    return (
        <Text style={[props.style, styles.h3]}>{props.text}</Text>
    );
}
export const H4 = (props) => {
    return (
        <Text style={[props.style, styles.h4]}>{props.text}</Text>
    );
}

const formatStyle = (style, name) => {
    return StyleSheet.create({
        [name]: JSON.parse(style)
    })
}


const styles = StyleSheet.create({
    h1: {
        fontSize: normalize(19),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    h2: {
        fontSize: normalize(17),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    h3: {
        fontSize: normalize(13),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    h4: {
        fontSize: normalize(8),
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

